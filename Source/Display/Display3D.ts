
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

	_sizeDefault: Coords;
	_scaleFactor: Coords;
	_display2DOverlay: Display;

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
		this.colorFore = colorFore;
		this.colorBack = colorBack;

		this._sizeDefault = sizeInPixels;
		this._scaleFactor = Coords.ones();
		this._display2DOverlay = new Display2D
		(
			this.sizesAvailable,
			fontNameAndHeight,
			colorFore, colorBack, null
		);
	}

	// constants

	static VerticesPerTriangle = 3;

	// methods

	cameraSet(camera: Camera): void
	{
		var cameraLoc = camera.loc;

		var matrixCamera = this.matrixCamera.overwriteWithTranslate
		(
			cameraLoc.pos.clone().multiplyScalar(-1)
		).multiply
		(
			this.matrixOrient.overwriteWithOrientationCamera
			(
				cameraLoc.orientation
			)
		).multiply
		(
			this.matrixPerspective.overwriteWithPerspectiveForCamera
			(
				camera
			)
		);

		var webGLContext = this.webGLContext;
		var gl = webGLContext.gl;
		var shaderProgram = webGLContext.shaderProgram;

		gl.uniformMatrix4fv
		(
			shaderProgram.cameraMatrix,
			false, // transpose
			matrixCamera.toWebGLArray()
		);
	}

	clear(): void
	{
		var webGLContext = this.webGLContext;
		var gl = webGLContext.gl;
		// var shaderProgram = webGLContext.shaderProgram;

		var viewportDimensionsAsIntegers = gl.getParameter(gl.VIEWPORT);
		gl.viewport(0, 0, viewportDimensionsAsIntegers[2], viewportDimensionsAsIntegers[3]);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		this._display2DOverlay.clear();
	}

	colorAtPos(pos: Coords, colorOut: Color): Color
	{
		throw new Error("Not yet implemented!");
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
		var webGLContext = this.webGLContext;
		var gl = webGLContext.gl;

		var shaderProgram = webGLContext.shaderProgram;

		var vertexPositionsAsFloatArray: number[] = [];
		var vertexColorsAsFloatArray: number[] = [];
		var vertexNormalsAsFloatArray: number[] = [];
		var vertexTextureUVsAsFloatArray: number[] = [];

		var numberOfTrianglesSoFar = 0;
		var materials = mesh.materials;
		var faces = mesh.faces();
		var faceTextures = mesh.faceTextures;
		var faceIndicesByMaterialName = mesh.faceIndicesByMaterialName();

		for (var m = 0; m < materials.length; m++)
		{
			var material = materials[m];
			var materialName = material.name;
			var faceIndices = faceIndicesByMaterialName.get(materialName);

			for (var fi = 0; fi < faceIndices.length; fi++)
			{
				var f = faceIndices[fi];
				var face = faces[f];
				var faceMaterial = face.material;
				var faceGeometry = face.geometry;
				var faceNormal = faceGeometry.plane().normal;

				// todo
				// var vertexNormalsForFaceVertices = mesh.vertexNormalsForFaceVertices;

				var vertexIndicesForTriangles: number[][] =
				[
					[0, 1, 2]
				];

				var faceVertices = faceGeometry.vertices;
				var numberOfVerticesInFace = faceVertices.length;

				if (numberOfVerticesInFace == 4)
				{
					vertexIndicesForTriangles.push([0, 2, 3]);
				}

				for (var t = 0; t < vertexIndicesForTriangles.length; t++)
				{
					var vertexIndicesForTriangle = vertexIndicesForTriangles[t];

					for (var vi = 0; vi < vertexIndicesForTriangle.length; vi++)
					{
						var vertexIndex = vertexIndicesForTriangle[vi];
						var vertex = faceVertices[vertexIndex];

						vertexPositionsAsFloatArray = vertexPositionsAsFloatArray.concat
						(
							vertex.dimensions()
						);

						var vertexColor = faceMaterial.colorFill;

						vertexColorsAsFloatArray = vertexColorsAsFloatArray.concat
						(
							vertexColor.componentsRGBA
						);

						var vertexNormal = faceNormal;
						/*
						// todo
						(
							vertexNormalsForFaceVertices == null
							? faceNormal
							: vertexNormalsForFaceVertices[f][vertexIndex]
						);
						*/

						vertexNormalsAsFloatArray = vertexNormalsAsFloatArray.concat
						(
							vertexNormal.dimensions()
						);

						var vertexTextureUV =
						(
							faceTextures == null
							? Coords.fromXY(-1, -1)
							: faceTextures[f] == null
							? Coords.fromXY(-1, -1)
							: faceTextures[f].textureUVs[vertexIndex]
						);

						vertexTextureUVsAsFloatArray = vertexTextureUVsAsFloatArray.concat
						(
							[
								vertexTextureUV.x,
								vertexTextureUV.y
							]
						);
					}
				}

				numberOfTrianglesSoFar += vertexIndicesForTriangles.length;
			}

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
				shaderProgram.vertexColorAttribute,
				Color.NumberOfComponentsRGBA,
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
				shaderProgram.vertexNormalAttribute,
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
				shaderProgram.vertexPositionAttribute,
				Coords.NumberOfDimensions,
				gl.FLOAT,
				false,
				0,
				0
			);

			var texture = material.texture;
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

			gl.uniform1i(shaderProgram.samplerUniform, 0);

			var textureBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
			gl.bufferData
			(
				gl.ARRAY_BUFFER,
				new Float32Array(vertexTextureUVsAsFloatArray),
				gl.STATIC_DRAW
			);
			gl.vertexAttribPointer
			(
				shaderProgram.vertexTextureUVAttribute,
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
		} // end for each material
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
		var shaderProgram = webGLContext.shaderProgram;

		gl.uniformMatrix4fv
		(
			shaderProgram.normalMatrix,
			false, // transpose
			matrixOrient.toWebGLArray()
		);

		gl.uniformMatrix4fv
		(
			shaderProgram.entityMatrix,
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
		this._display2DOverlay.initialize(universe);

		this.canvas = document.createElement("canvas");
		this.canvas.style.position = "absolute";
		this.canvas.width = this.sizeInPixels.x;
		this.canvas.height = this.sizeInPixels.y;

		this.webGLContext = new WebGLContext(this.canvas);

		this.texturesRegisteredByName = new Map<string, Texture>();

		// hack

		this.lighting = new Lighting
		(
			.5, // ambientIntensity
			new Coords(-1, -1, -1), // direction
			.3 // directionalIntensity
		);

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
		var webGLContext = this.webGLContext;
		var gl = webGLContext.gl;
		var shaderProgram = webGLContext.shaderProgram;

		var lighting = this.lighting;

		gl.uniform1f
		(
			shaderProgram.lightAmbientIntensity,
			lighting.ambientIntensity
		);

		gl.uniform3fv
		(
			shaderProgram.lightDirection,
			WebGLContext.coordsToWebGLArray(lighting.direction)
		);

		gl.uniform1f
		(
			shaderProgram.lightDirectionalIntensity,
			lighting.directionalIntensity
		);
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

	drawBackground(colorBack: Color, colorBorder: Color): void
	{
		this._display2DOverlay.drawBackground(colorBack, colorBorder);
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

	drawImagePartial(imageToDraw: Image2, pos: Coords, boxToShow: Box): void
	{
		this._display2DOverlay.drawImagePartial(imageToDraw, pos, boxToShow);
	}

	drawImagePartialScaled
	(
		imageToDraw: Image2, pos: Coords, regionToDrawAsBox: Box, sizeToDraw: Coords
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

	drawText
	(
		text: string,
		fontHeightInPixels: number,
		pos: Coords,
		colorFill: Color,
		colorOutline: Color,
		isCenteredHorizontally: boolean,
		isCenteredVertically: boolean,
		sizeMaxInPixels: Coords
	): void
	{
		this._display2DOverlay.drawText
		(
			text,
			fontHeightInPixels,
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

	flush(): void {}

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

	toImage(): Image2
	{
		return null;
	}

	// platformable

	toDomElement(): HTMLElement
	{
		var returnValue = document.createElement("div");
		returnValue.appendChild(this.canvas);
		var overlayAsDomElement = this._display2DOverlay.toDomElement();
		returnValue.appendChild(overlayAsDomElement);
		return returnValue;
	}
}

}
