
function Display3D(sizeInPixels, fontName, fontHeightInPixels, colorFore, colorBack)
{
	this.sizeInPixels = sizeInPixels;

	this.sizeDefault = sizeInPixels;
	this.scaleFactor = new Coords(1, 1, 1);
	this._display2DOverlay = new Display([sizeInPixels], fontName, fontHeightInPixels, colorFore, colorBack);
}

{
	// constants

	Display3D.VerticesPerTriangle = 3;

	// methods

	Display3D.prototype.cameraSet = function(camera)
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

	Display3D.prototype.clear = function()
	{
		var webGLContext = this.webGLContext;
		var gl = webGLContext.gl;
		var shaderProgram = webGLContext.shaderProgram;

		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	Display3D.prototype.drawMesh = function(mesh)
	{
		var webGLContext = this.webGLContext;
		var gl = webGLContext.gl;

		var shaderProgram = webGLContext.shaderProgram;

		var vertexPositionsAsFloatArray = [];
		var vertexColorsAsFloatArray = [];
		var vertexNormalsAsFloatArray = [];
		var vertexTextureUVsAsFloatArray = [];

		var numberOfTrianglesSoFar = 0;
		var faces = mesh.faces();
		var faceTextures = mesh.faceTextures;

		for (var f = 0; f < faces.length; f++)
		{
			var face = faces[f];
			var faceMaterial = face.material;
			var faceGeometry = face.geometry;
			var faceNormal = faceGeometry.plane().normal;
			var vertexNormalsForFaceVertices = mesh.vertexNormalsForFaceVertices;

			var vertexIndicesForTriangles = 
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

					var vertexNormal = 
					(
						vertexNormalsForFaceVertices == null 
						? faceNormal
						: vertexNormalsForFaceVertices[f][vertexIndex]
					);

					vertexNormalsAsFloatArray = vertexNormalsAsFloatArray.concat
					(
						vertexNormal.dimensions()
					);

					var vertexTextureUV = 
					(
						faceTextures == null 
						? new Coords(-1, -1)
						: faceTextures[f] == null
						? new Coords(-1, -1)
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

		var texture = mesh.materials[0].texture;
		if (texture != null)
		{
			var textureName = texture.name;

			var textureRegistered = this.texturesRegistered[textureName];
			if (textureRegistered == null)
			{
				texture.initializeForWebGLContext(this.webGLContext);
				this.texturesRegistered[textureName] = texture;
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
	}

	Display3D.prototype.drawMeshWithOrientation = function(mesh, meshOrientation)
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

	Display3D.prototype.initialize = function(universe)
	{
		var platformHelper = universe.platformHelper;
		platformHelper.initialize(universe);

		if (this.canvas != null)
		{
			platformHelper.domElementRemove(this.canvas);
		}

		this.canvas = document.createElement("canvas");
		this.canvas.style.position = "absolute";
		this.canvas.width = this.sizeInPixels.x;
		this.canvas.height = this.sizeInPixels.y;
		divMain.appendChild(this.canvas);

		this.webGLContext = new WebGLContext(this.canvas);

		this.texturesRegistered = [];

		// hack

		this.lighting = new Lighting
		(
			.5, // ambientIntensity
			new Coords(-1, -1, -1), // direction
			.3 // directionalIntensity
		);

		this._display2DOverlay.initialize(universe);

		// temps

		this.matrixEntity = Matrix.buildZeroes();
		this.matrixCamera = Matrix.buildZeroes();
		this.matrixOrient = Matrix.buildZeroes();
		this.matrixPerspective = Matrix.buildZeroes();
		this.matrixTranslate = Matrix.buildZeroes();
		this.tempCoords = new Coords(0, 0, 0);
		this.tempMatrix0 = Matrix.buildZeroes();
		this.tempMatrix1 = Matrix.buildZeroes();
	}

	Display3D.prototype.lightingSet = function(todo)
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

	Display3D.prototype.clear = function()
	{
		this._display2DOverlay.clear();
	}

	Display3D.prototype.drawArc = function
	(
		center, radiusInner, radiusOuter, angleStartInTurns, angleStopInTurns, colorFill, colorBorder
	)
	{
		this._display2DOverlay.drawArc(center, radiusInner, radiusOuter, angleStartInTurns, angleStopInTurns, colorFill, colorBorder);
	}

	Display3D.prototype.drawBackground = function()
	{
		this._display2DOverlay.drawBackground();
	}

	Display3D.prototype.drawCircle = function(center, radius, colorFill, colorBorder)
	{
		this._display2DOverlay.drawCircle(center, radius, colorFill, colorBorder);
	}

	Display3D.prototype.drawCircleWithGradient = function(center, radius, gradientFill, colorBorder)
	{
		this._display2DOverlay.drawCircleWithGradient(center, radius, gradientFill, colorBorder);
	}

	Display3D.prototype.drawImage = function(imageToDraw, pos, size)
	{
		this._display2DOverlay.drawImage(imageToDraw, pos, size);
	}

	Display3D.prototype.drawLine = function(fromPos, toPos, color)
	{
		this._display2DOverlay.drawLine(fromPos, toPos, color);
	}

	Display3D.prototype.drawPolygon = function(vertices, colorFill, colorBorder)
	{
		this._display2DOverlay.drawPolygon(vertices, colorFill, colorBorder);
	}

	Display3D.prototype.drawRectangle = function
	(
		pos,
		size,
		colorFill,
		colorBorder,
		areColorsReversed
	)
	{
		this._display2DOverlay.drawRectangle
		(
			pos, size, colorFill, colorBorder, areColorsReversed
		);
	}

	Display3D.prototype.drawText = function
	(
		text,
		fontHeightInPixels,
		pos,
		colorFill,
		colorOutline,
		areColorsReversed,
		isCentered,
		widthMaxInPixels
	)
	{
		this._display2DOverlay.drawText
		(
			text,
			fontHeightInPixels,
			pos,
			colorFill,
			colorOutline,
			areColorsReversed,
			isCentered,
			widthMaxInPixels
		);
	}

	Display3D.prototype.fontSizeSet = function(fontHeightInPixels)
	{
		this._display2DOverlay.fontSizeSet(fontHeightInPixels);
	}

	Display3D.prototype.fontValidate = function(fontName)
	{
		this._display2DOverlay.fontValidate(fontName);
	}

	Display3D.prototype.hide = function(universe)
	{
		this._display2DOverlay.hide(universe);
	}

	Display3D.prototype.show = function(universe)
	{
		this._display2DOverlay.show(universe);
	}

	Display3D.prototype.textWidthForFontHeight = function(textToMeasure, fontHeightInPixels)
	{
		return this._display2DOverlay.textWidthForFontHeight(textToMeasure, fontHeightInPixels);
	}

}
