
namespace ThisCouldBeBetter.GameFramework
{

export class Display3D implements Display
{
	sizeInPixels: Coords;
	sizesAvailable: Coords[];
	fontNameAndHeight: FontNameAndHeight;
	colorFore: Color;
	colorBack: Color;

	canvas: HTMLCanvasElement;
	lighting: Lighting;
	matrixCamera: Matrix;
	matrixEntity: Matrix;
	matrixOrient: Matrix;
	matrixPerspective: Matrix;
	matrixTranslate: Matrix;
	sizeInPixelsHalf: Coords;
	tempCoords: Coords;
	tempMatrix0: Matrix;
	tempMatrix1: Matrix;
	texturesRegisteredByName: Map<string, Texture>;
	webGLContext: WebGLContext;

	_cameraPosInverted: Coords;
	_sizeDefault: Coords;
	_scaleFactor: Coords;
	_display2DOverlay: Display;
	_vertexIndicesForTrianglesSingle: number[][];
	_vertexIndicesForTrianglesDouble: number[][];

	constructor
	(
		sizeInPixels: Coords,
		fontNameAndHeight: FontNameAndHeight,
		colorFore: Color,
		colorBack: Color
	)
	{
		this.sizeInPixels = sizeInPixels;
		this.sizesAvailable = [ this.sizeInPixels ];
		this.fontNameAndHeight =
			fontNameAndHeight || FontNameAndHeight.default();
		this.colorFore = colorFore || Color.Instances().White;
		this.colorBack = colorBack || Color.Instances().Black;

		this._cameraPosInverted = Coords.create();
		this._sizeDefault = sizeInPixels;
		this._scaleFactor = Coords.ones();
		this._display2DOverlay = Display2D.fromSizesFontAndColorsForeAndBack
		(
			this.sizesAvailable,
			fontNameAndHeight,
			colorFore,
			colorBack
		);
		this._vertexIndicesForTrianglesSingle = [ [0, 1, 2] ];
		this._vertexIndicesForTrianglesDouble = [ [0, 1, 2], [0, 2, 3] ];
	}

	static fromViewSizeInPixels(viewSizeInPixels: Coords): Display3D
	{
		return new Display3D
		(
			viewSizeInPixels, null, null, null
		);
	}

	// constants

	static VerticesPerTriangle = 3;

	// methods

	cameraSet(camera: Camera): void
	{
		var cameraLoc = camera.loc;

		var cameraPosInverted =
			this._cameraPosInverted
				.overwriteWith(cameraLoc.pos)
				.multiplyScalar(-1);

		var matrixCamera =
			this.matrixCamera.overwriteWithTranslate(cameraPosInverted);

		var matrixOrient =
			this.matrixOrient.overwriteWithOrientationCamera(cameraLoc.orientation);

		var matrixPerspective =
			this.matrixPerspective.overwriteWithPerspectiveForCamera(camera);

		matrixCamera
			.multiply(matrixOrient)
			.multiply(matrixPerspective);

		var webGLContext = this.webGLContext;
		var gl = webGLContext.gl;
		var shaderProgramVariables = webGLContext.shaderProgramVariables;

		gl.uniformMatrix4fv
		(
			shaderProgramVariables.cameraMatrix,
			false, // transpose
			matrixCamera.toWebGLArray()
		);
	}

	clear(): void
	{
		var webGLContext = this.webGLContext;
		var gl = webGLContext.gl;

		var viewportDimensionsAsIntegers = gl.getParameter(gl.VIEWPORT);
		gl.viewport(0, 0, viewportDimensionsAsIntegers[2], viewportDimensionsAsIntegers[3]);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		this._display2DOverlay.clear();
	}

	colorAtPos(pos: Coords, colorOut: Color): Color
	{
		throw new Error("Not yet implemented!");
	}

	colorBackSet(value: Color): Display
	{
		this.colorBack = value;
		return this;
	}

	colorForeSet(value: Color): Display
	{
		this.colorFore = value;
		return this;
	}

	displayToUse(): Display
	{
		return this;
	}

	drawCrosshairs
	(
		center: Coords,
		numberOfLines: number,
		radiusOuter: number,
		radiusInner: number,
		color: Color,
		lineThickness: number
	): void
	{
		this._display2DOverlay.drawCrosshairs
		(
			center, numberOfLines, radiusOuter, radiusInner, color,
			lineThickness
		);
	}

	drawEllipse
	(
		center: Coords, semimajorAxis: number, semiminorAxis: number,
		rotationInTurns: number, colorFill: Color, colorBorder: Color
	): void
	{
		this._display2DOverlay.drawEllipse
		(
			center, semimajorAxis, semiminorAxis, rotationInTurns, colorFill, colorBorder
		);
	}

	drawMesh(mesh: MeshTextured): void
	{
		var vertexPositionsAsFloatArray: number[] = [];
		var vertexColorsAsFloatArray: number[] = [];
		var vertexNormalsAsFloatArray: number[] = [];
		var vertexTextureUvsAsFloatArray: number[] = [];

		var numberOfTrianglesSoFar = new Reference<number>(0);

		var meshMaterials = mesh.materials;

		for (var m = 0; m < meshMaterials.length; m++)
		{
			var material = meshMaterials[m];

			this.drawMesh_1_PopulateVertexDataArrays
			(
				mesh,
				material,
				numberOfTrianglesSoFar,
				vertexColorsAsFloatArray,
				vertexNormalsAsFloatArray,
				vertexPositionsAsFloatArray,
				vertexTextureUvsAsFloatArray
			);

			this.drawMesh_2_WriteVertexDataArraysToWebGlContext
			(
				material.texture,
				numberOfTrianglesSoFar.value,
				vertexColorsAsFloatArray,
				vertexNormalsAsFloatArray,
				vertexPositionsAsFloatArray,
				vertexTextureUvsAsFloatArray
			);

		} // end for each material
	}

	drawMesh_1_PopulateVertexDataArrays
	(
		mesh: MeshTextured,
		material: Material,
		numberOfTrianglesSoFar: Reference<number>,
		vertexColorsAsFloatArray: any[],
		vertexNormalsAsFloatArray: any[],
		vertexPositionsAsFloatArray: any[],
		vertexTextureUvsAsFloatArray: any[]
	): void
	{
		var meshFaces = mesh.faces();
		var meshFaceTextures = mesh.faceTextures;
		var meshFaceIndicesByMaterialName = mesh.faceIndicesByMaterialName();

		var materialName = material.name;
		var faceIndices = meshFaceIndicesByMaterialName.get(materialName);

		for (var fi = 0; fi < faceIndices.length; fi++)
		{
			var f = faceIndices[fi];
			var face = meshFaces[f];
			var faceMaterial = face.material;
			var faceGeometry = face.geometry;
			var faceNormal = faceGeometry.plane().normal;

			var faceVertices = faceGeometry.vertices;
			var numberOfVerticesInFace = faceVertices.length;

			var vertexIndicesForTriangles: number[][] =
				numberOfVerticesInFace == 3
				? this._vertexIndicesForTrianglesSingle
				: numberOfVerticesInFace == 4
				? this._vertexIndicesForTrianglesDouble
				: null;

			if (vertexIndicesForTriangles == null)
			{
				throw new Error("Only faces with 3 or 4 vertices are supported.");
			}

			for (var t = 0; t < vertexIndicesForTriangles.length; t++)
			{
				var vertexIndicesForTriangle = vertexIndicesForTriangles[t];

				for (var vi = 0; vi < vertexIndicesForTriangle.length; vi++)
				{
					var vertexIndex = vertexIndicesForTriangle[vi];

					var vertexPos = faceVertices[vertexIndex];
					vertexPositionsAsFloatArray.push
					(
						...vertexPos.dimensions()
					);

					var vertexColor = faceMaterial.colorFill;
					vertexColorsAsFloatArray.push
					(
						...vertexColor.fractionsRgba
					);

					var vertexNormal = faceNormal;
					vertexNormalsAsFloatArray.push
					(
						...vertexNormal.dimensions()
					);

					var vertexTextureUv =
					(
						meshFaceTextures == null
						? Coords.fromXY(-1, -1)
						: meshFaceTextures[f] == null
						? Coords.fromXY(-1, -1)
						: meshFaceTextures[f].textureUVs[vertexIndex]
					);
					vertexTextureUvsAsFloatArray.push
					(
						...vertexTextureUv.dimensionsXY()
					);
				}
			}

			numberOfTrianglesSoFar.value += vertexIndicesForTriangles.length;
		}

	}

	drawMesh_2_WriteVertexDataArraysToWebGlContext
	(
		texture: Texture,
		numberOfTrianglesSoFar: number,
		vertexColorsAsFloatArray: any[],
		vertexNormalsAsFloatArray: any[],
		vertexPositionsAsFloatArray: any[],
		vertexTextureUvsAsFloatArray: any[]
	): void
	{
		var webGLContext = this.webGLContext;
		var gl = webGLContext.gl;

		var shaderProgramVariables = webGLContext.shaderProgramVariables;

		var colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData
		(
			gl.ARRAY_BUFFER,
			new Float32Array(vertexColorsAsFloatArray),
			gl.STATIC_DRAW
		);
		gl.vertexAttribPointer
		(
			shaderProgramVariables.vertexColorAttribute,
			Color.NumberOfComponentsRgba,
			gl.FLOAT,
			false,
			0,
			0
		);

		var normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferData
		(
			gl.ARRAY_BUFFER,
			new Float32Array(vertexNormalsAsFloatArray),
			gl.STATIC_DRAW
		);
		gl.vertexAttribPointer
		(
			shaderProgramVariables.vertexNormalAttribute,
			Coords.NumberOfDimensions,
			gl.FLOAT,
			false,
			0,
			0
		);

		var positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData
		(
			gl.ARRAY_BUFFER,
			new Float32Array(vertexPositionsAsFloatArray),
			gl.STATIC_DRAW
		);
		gl.vertexAttribPointer
		(
			shaderProgramVariables.vertexPositionAttribute,
			Coords.NumberOfDimensions,
			gl.FLOAT,
			false,
			0,
			0
		);

		if (texture != null)
		{
			var textureName = texture.name;

			var textureRegistered = this.texturesRegisteredByName.get(textureName);
			if (textureRegistered == null)
			{
				texture.initializeForWebGLContext(this.webGLContext);
				this.texturesRegisteredByName.set(textureName, texture);
			}

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture.systemTexture);
		}

		var textureBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
		gl.bufferData
		(
			gl.ARRAY_BUFFER,
			new Float32Array(vertexTextureUvsAsFloatArray),
			gl.STATIC_DRAW
		);
		gl.vertexAttribPointer
		(
			shaderProgramVariables.vertexTextureUVAttribute,
			2,
			gl.FLOAT,
			false,
			0,
			0
		);

		gl.drawArrays
		(
			gl.TRIANGLES,
			0,
			numberOfTrianglesSoFar * Display3D.VerticesPerTriangle
		);
	}

	drawMeshWithOrientation
	(
		mesh: MeshTextured, meshOrientation: Orientation
	): void
	{
		var matrixOrient = this.matrixOrient;

		var matrixEntity = this.matrixEntity.overwriteWithOrientationMover
		(
			meshOrientation
		).multiply
		(
			matrixOrient.overwriteWithOrientationEntity
			(
				meshOrientation
			)
		);

		var webGLContext = this.webGLContext;
		var gl = webGLContext.gl;
		var shaderProgramVariables = webGLContext.shaderProgramVariables;

		gl.uniformMatrix4fv
		(
			shaderProgramVariables.normalMatrix,
			false, // transpose
			matrixOrient.toWebGLArray()
		);

		gl.uniformMatrix4fv
		(
			shaderProgramVariables.entityMatrix,
			false, // transpose
			matrixEntity.toWebGLArray()
		);

		this.drawMesh(mesh);
	}

	drawPixel(pos: Coords, color: Color): void
	{
		this._display2DOverlay.drawPixel(pos, color);
	}

	initialize(universe: Universe): Display
	{
		this.canvas = document.createElement("canvas"); 
		this.canvas.id = "canvas3D";
		this.canvas.style.position = "absolute";
		this.canvas.width = this.sizeInPixels.x;
		this.canvas.height = this.sizeInPixels.y;

		this.webGLContext = new WebGLContext(this.canvas); // The canvas from the overlay cannot be used here.

		this.texturesRegisteredByName = new Map<string, Texture>();

		// hack

		this.lighting =
			Lighting.default();
			/*
			Lighting.fromLightsAmbientDirectionalAndPoint
				(
					LightAmbient.fromIntensity(.25),
					LightDirectional.dark(),
					LightPoint.fromIntensityAndPos(1000000, Coords.fromXYZ(0, 0, -100) )
				);
			*/

		this._display2DOverlay.initialize(universe);

		// temps

		this.matrixEntity = Matrix.buildZeroes();
		this.matrixCamera = Matrix.buildZeroes();
		this.matrixOrient = Matrix.buildZeroes();
		this.matrixPerspective = Matrix.buildZeroes();
		this.matrixTranslate = Matrix.buildZeroes();
		this.tempCoords = Coords.create();
		this.tempMatrix0 = Matrix.buildZeroes();
		this.tempMatrix1 = Matrix.buildZeroes();

		return this;
	}

	lightingSet(lightingToSet: Lighting): void
	{
		var webGlContext = this.webGLContext;

		var lighting = this.lighting;

		lighting.lightAmbient.writeToWebGlContext(webGlContext);

		lighting.lightDirectional.writeToWebGlContext(webGlContext);
	}

	// Display2D overlay.

	drawArc
	(
		center: Coords, radiusInner: number, radiusOuter: number,
		angleStartInTurns: number, angleStopInTurns: number, colorFill: Color,
		colorBorder: Color
	): void
	{
		this._display2DOverlay.drawArc(center, radiusInner, radiusOuter, angleStartInTurns, angleStopInTurns, colorFill, colorBorder);
	}

	drawBackground(): void
	{
		this._display2DOverlay.drawBackground();
	}

	drawBackgroundWithColorsBackAndBorder
	(
		colorBack: Color, colorBorder: Color
	): void
	{
		this._display2DOverlay.drawBackgroundWithColorsBackAndBorder
		(
			colorBack, colorBorder
		);
	}

	drawCircle
	(
		center: Coords, radius: number, colorFill: Color,
		colorBorder: Color, borderThickness: number
	): void
	{
		this._display2DOverlay.drawCircle
		(
			center, radius, colorFill, colorBorder, borderThickness
		);
	}

	drawCircleWithGradient
	(
		center: Coords,
		radius: number,
		gradientFill: ValueBreakGroup<Color>,
		colorBorder: Color
	): void
	{
		this._display2DOverlay.drawCircleWithGradient(center, radius, gradientFill, colorBorder);
	}

	drawImage(imageToDraw: Image2, pos: Coords): void
	{
		this._display2DOverlay.drawImage(imageToDraw, pos);
	}

	drawImagePartial(imageToDraw: Image2, pos: Coords, boxToShow: BoxAxisAligned): void
	{
		this._display2DOverlay.drawImagePartial(imageToDraw, pos, boxToShow);
	}

	drawImagePartialScaled
	(
		imageToDraw: Image2, pos: Coords, regionToDrawAsBox: BoxAxisAligned, sizeToDraw: Coords
	): void
	{
		this._display2DOverlay.drawImagePartialScaled(imageToDraw, pos, regionToDrawAsBox, sizeToDraw);
	}

	drawImageScaled(imageToDraw: Image2, pos: Coords, size: Coords): void
	{
		this._display2DOverlay.drawImageScaled(imageToDraw, pos, size);
	}

	drawLine
	(
		fromPos: Coords, toPos: Coords, color: Color, lineThickness: number
	): void
	{
		this._display2DOverlay.drawLine(fromPos, toPos, color, lineThickness);
	}

	drawPath
	(
		vertices: Coords[], color: Color, lineThickness: number, isClosed: boolean
	): void
	{
		this._display2DOverlay.drawPath(vertices, color, lineThickness, isClosed);
	}

	drawPolygon(vertices: Coords[], colorFill: Color, colorBorder: Color): void
	{
		this._display2DOverlay.drawPolygon(vertices, colorFill, colorBorder);
	}

	drawRectangle
	(
		pos: Coords,
		size : Coords,
		colorFill: Color,
		colorBorder: Color
	): void
	{
		this._display2DOverlay.drawRectangle
		(
			pos, size, colorFill, colorBorder
		);
	}

	drawRectangleCentered
	(
		pos: Coords, size: Coords, colorFill: Color, colorBorder: Color
	): void
	{
		this._display2DOverlay.drawRectangleCentered(pos, size, colorFill, colorBorder);
	}

	drawRectangleWithBeveledCorners
	(
		pos: Coords, size: Coords,
		colorFill: Color, colorBorder: Color,
		cornerRadius: number
	): void
	{
		this._display2DOverlay.drawRectangleWithBeveledCorners
		(
			pos, size, colorFill, colorBorder, cornerRadius
		);
	}

	drawRectangleWithRoundedCorners
	(
		pos: Coords, size: Coords,
		colorFill: Color, colorBorder: Color,
		cornerRadius: number
	): void
	{
		this._display2DOverlay.drawRectangleWithRoundedCorners
		(
			pos, size, colorFill, colorBorder, cornerRadius
		);
	}

	drawTextWithFontAtPos
	(
		text: string,
		fontNameAndHeight: FontNameAndHeight,
		pos: Coords
	): void
	{
		this.drawTextWithFontAtPosWithColorsFillAndOutline
		(
			text, fontNameAndHeight, pos, null, null, null, null, null
		);
	}

	drawTextWithFontAtPosWithColorsFillAndOutline
	(
		text: string,
		fontNameAndHeight: FontNameAndHeight,
		pos: Coords,
		colorFill: Color,
		colorOutline: Color,
		isCenteredHorizontally: boolean,
		isCenteredVertically: boolean,
		sizeMaxInPixels: Coords
	): void
	{
		this._display2DOverlay.drawTextWithFontAtPosWithColorsFillAndOutline
		(
			text,
			fontNameAndHeight,
			pos,
			colorFill,
			colorOutline,
			isCenteredHorizontally,
			isCenteredVertically,
			sizeMaxInPixels
		);
	}

	drawWedge
	(
		center: Coords, radius: number, angleStartInTurns: number,
		angleStopInTurns: number, colorFill: Color, colorBorder: Color
	): void
	{
		this._display2DOverlay.drawWedge
		(
			center, radius, angleStartInTurns, angleStopInTurns, colorFill, colorBorder
		);
	}

	eraseModeSet(value: boolean): void
	{
		this._display2DOverlay.eraseModeSet(value);
	}

	fontSet(fontNameAndHeight: FontNameAndHeight): void
	{
		this._display2DOverlay.fontSet(fontNameAndHeight);
	}

	flush(): void
	{
		var display2d = this._display2DOverlay as Display2D;
		display2d.graphics.drawImage(this.canvas, 0, 0);
	}

	hide(): void {}

	rotateTurnsAroundCenter(turnsToRotate: number, centerOfRotation: Coords)
	{
		this._display2DOverlay.rotateTurnsAroundCenter(turnsToRotate, centerOfRotation);
	}

	scaleFactor(): Coords
	{
		return this._scaleFactor;
	}

	show(): void {}

	sizeDefault(): Coords
	{
		return this._sizeDefault;
	}

	stateRestore(): void
	{
		this._display2DOverlay.stateRestore();
	}

	stateSave(): void
	{
		this._display2DOverlay.stateSave();
	}

	textWidthForFontHeight
	(
		textToMeasure: string, fontHeightInPixels: number
	): number
	{
		return this._display2DOverlay.textWidthForFontHeight
		(
			textToMeasure, fontHeightInPixels
		);
	}

	toImage(name: string): Image2
	{
		return null;
	}

	// Platformable.

	toDomElement(): HTMLElement
	{
		return this._display2DOverlay.toDomElement();
	}
}

}
