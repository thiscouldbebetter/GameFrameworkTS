"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Display3D {
            constructor(sizeInPixels, fontNameAndHeight, colorFore, colorBack) {
                this.sizeInPixels = sizeInPixels;
                this.sizesAvailable = [this.sizeInPixels];
                this.fontNameAndHeight =
                    fontNameAndHeight || GameFramework.FontNameAndHeight.default();
                this.colorFore = colorFore || GameFramework.Color.Instances().White;
                this.colorBack = colorBack || GameFramework.Color.Instances().Black;
                this._cameraPosInverted = GameFramework.Coords.create();
                this._sizeDefault = sizeInPixels;
                this._scaleFactor = GameFramework.Coords.ones();
                this._display2DOverlay = GameFramework.Display2D.fromSizesFontAndColorsForeAndBack(this.sizesAvailable, fontNameAndHeight, colorFore, colorBack);
                this._vertexIndicesForTrianglesSingle = [[0, 1, 2]];
                this._vertexIndicesForTrianglesDouble = [[0, 1, 2], [0, 2, 3]];
            }
            static fromViewSizeInPixels(viewSizeInPixels) {
                return new Display3D(viewSizeInPixels, null, null, null);
            }
            // methods
            cameraSet(camera) {
                var cameraLoc = camera.loc;
                var cameraPosInverted = this._cameraPosInverted
                    .overwriteWith(cameraLoc.pos)
                    .multiplyScalar(-1);
                var matrixCamera = this.matrixCamera.overwriteWithTranslate(cameraPosInverted);
                var matrixOrient = this.matrixOrient.overwriteWithOrientationCamera(cameraLoc.orientation);
                var matrixPerspective = this.matrixPerspective.overwriteWithPerspectiveForCamera(camera);
                matrixCamera
                    .multiply(matrixOrient)
                    .multiply(matrixPerspective);
                var webGLContext = this.webGLContext;
                var gl = webGLContext.gl;
                var shaderProgramVariables = webGLContext.shaderProgramVariables;
                gl.uniformMatrix4fv(shaderProgramVariables.cameraMatrix, false, // transpose
                matrixCamera.toWebGLArray());
            }
            clear() {
                var webGLContext = this.webGLContext;
                var gl = webGLContext.gl;
                var viewportDimensionsAsIntegers = gl.getParameter(gl.VIEWPORT);
                gl.viewport(0, 0, viewportDimensionsAsIntegers[2], viewportDimensionsAsIntegers[3]);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                this._display2DOverlay.clear();
            }
            colorAtPos(pos, colorOut) {
                throw new Error("Not yet implemented!");
            }
            colorBackSet(value) {
                this.colorBack = value;
                return this;
            }
            colorForeSet(value) {
                this.colorFore = value;
                return this;
            }
            displayToUse() {
                return this;
            }
            drawCrosshairs(center, numberOfLines, radiusOuter, radiusInner, color, lineThickness) {
                this._display2DOverlay.drawCrosshairs(center, numberOfLines, radiusOuter, radiusInner, color, lineThickness);
            }
            drawEllipse(center, semimajorAxis, semiminorAxis, rotationInTurns, colorFill, colorBorder) {
                this._display2DOverlay.drawEllipse(center, semimajorAxis, semiminorAxis, rotationInTurns, colorFill, colorBorder);
            }
            drawMesh(mesh) {
                var vertexPositionsAsFloatArray = [];
                var vertexColorsAsFloatArray = [];
                var vertexNormalsAsFloatArray = [];
                var vertexTextureUvsAsFloatArray = [];
                var numberOfTrianglesSoFar = new GameFramework.Reference(0);
                var meshMaterials = mesh.materials;
                for (var m = 0; m < meshMaterials.length; m++) {
                    var material = meshMaterials[m];
                    this.drawMesh_1_PopulateVertexDataArrays(mesh, material, numberOfTrianglesSoFar, vertexColorsAsFloatArray, vertexNormalsAsFloatArray, vertexPositionsAsFloatArray, vertexTextureUvsAsFloatArray);
                    this.drawMesh_2_WriteVertexDataArraysToWebGlContext(material.texture, numberOfTrianglesSoFar.value, vertexColorsAsFloatArray, vertexNormalsAsFloatArray, vertexPositionsAsFloatArray, vertexTextureUvsAsFloatArray);
                } // end for each material
            }
            drawMesh_1_PopulateVertexDataArrays(mesh, material, numberOfTrianglesSoFar, vertexColorsAsFloatArray, vertexNormalsAsFloatArray, vertexPositionsAsFloatArray, vertexTextureUvsAsFloatArray) {
                var meshFaces = mesh.faces();
                var meshFaceTextures = mesh.faceTextures;
                var meshFaceIndicesByMaterialName = mesh.faceIndicesByMaterialName();
                var materialName = material.name;
                var faceIndices = meshFaceIndicesByMaterialName.get(materialName);
                for (var fi = 0; fi < faceIndices.length; fi++) {
                    var f = faceIndices[fi];
                    var face = meshFaces[f];
                    var faceMaterial = face.material;
                    var faceNormal = face.plane().normal;
                    var faceVertices = face.vertices;
                    var numberOfVerticesInFace = faceVertices.length;
                    var vertexIndicesForTriangles = numberOfVerticesInFace == 3
                        ? this._vertexIndicesForTrianglesSingle
                        : numberOfVerticesInFace == 4
                            ? this._vertexIndicesForTrianglesDouble
                            : null;
                    if (vertexIndicesForTriangles == null) {
                        throw new Error("Only faces with 3 or 4 vertices are supported.");
                    }
                    for (var t = 0; t < vertexIndicesForTriangles.length; t++) {
                        var vertexIndicesForTriangle = vertexIndicesForTriangles[t];
                        for (var vi = 0; vi < vertexIndicesForTriangle.length; vi++) {
                            var vertexIndex = vertexIndicesForTriangle[vi];
                            var vertexPos = faceVertices[vertexIndex];
                            vertexPositionsAsFloatArray.push(...vertexPos.dimensions());
                            var vertexColor = faceMaterial.colorFill;
                            vertexColorsAsFloatArray.push(...vertexColor.fractionsRgba);
                            var vertexNormal = faceNormal;
                            vertexNormalsAsFloatArray.push(...vertexNormal.dimensions());
                            var vertexTextureUv = (meshFaceTextures == null
                                ? GameFramework.Coords.fromXY(-1, -1)
                                : meshFaceTextures[f] == null
                                    ? GameFramework.Coords.fromXY(-1, -1)
                                    : meshFaceTextures[f].textureUVs[vertexIndex]);
                            vertexTextureUvsAsFloatArray.push(...vertexTextureUv.dimensionsXY());
                        }
                    }
                    numberOfTrianglesSoFar.value += vertexIndicesForTriangles.length;
                }
            }
            drawMesh_2_WriteVertexDataArraysToWebGlContext(texture, numberOfTrianglesSoFar, vertexColorsAsFloatArray, vertexNormalsAsFloatArray, vertexPositionsAsFloatArray, vertexTextureUvsAsFloatArray) {
                var webGLContext = this.webGLContext;
                var gl = webGLContext.gl;
                var shaderProgramVariables = webGLContext.shaderProgramVariables;
                var colorBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColorsAsFloatArray), gl.STATIC_DRAW);
                gl.vertexAttribPointer(shaderProgramVariables.vertexColorAttribute, GameFramework.Color.NumberOfComponentsRgba, gl.FLOAT, false, 0, 0);
                var normalBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormalsAsFloatArray), gl.STATIC_DRAW);
                gl.vertexAttribPointer(shaderProgramVariables.vertexNormalAttribute, GameFramework.Coords.NumberOfDimensions, gl.FLOAT, false, 0, 0);
                var positionBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionsAsFloatArray), gl.STATIC_DRAW);
                gl.vertexAttribPointer(shaderProgramVariables.vertexPositionAttribute, GameFramework.Coords.NumberOfDimensions, gl.FLOAT, false, 0, 0);
                if (texture != null) {
                    var textureName = texture.name;
                    var textureRegistered = this.texturesRegisteredByName.get(textureName);
                    if (textureRegistered == null) {
                        texture.initializeForWebGLContext(this.webGLContext);
                        this.texturesRegisteredByName.set(textureName, texture);
                    }
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, texture.systemTexture);
                }
                var textureBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureUvsAsFloatArray), gl.STATIC_DRAW);
                gl.vertexAttribPointer(shaderProgramVariables.vertexTextureUVAttribute, 2, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLES, 0, numberOfTrianglesSoFar * Display3D.VerticesPerTriangle);
            }
            drawMeshWithOrientation(mesh, meshOrientation) {
                var matrixOrient = this.matrixOrient;
                var matrixEntity = this.matrixEntity
                    .overwriteWithOrientationMover(meshOrientation)
                    .multiply(matrixOrient
                    .overwriteWithOrientationEntity(meshOrientation));
                var webGLContext = this.webGLContext;
                var gl = webGLContext.gl;
                var shaderProgramVariables = webGLContext.shaderProgramVariables;
                gl.uniformMatrix4fv(shaderProgramVariables.normalMatrix, false, // transpose
                matrixOrient.toWebGLArray());
                gl.uniformMatrix4fv(shaderProgramVariables.entityMatrix, false, // transpose
                matrixEntity.toWebGLArray());
                this.drawMesh(mesh);
            }
            drawPixel(pos, color) {
                this._display2DOverlay.drawPixel(pos, color);
            }
            initialize(universe) {
                this.canvas = document.createElement("canvas");
                this.canvas.id = "canvas3D";
                this.canvas.style.position = "absolute";
                this.canvas.width = this.sizeInPixels.x;
                this.canvas.height = this.sizeInPixels.y;
                this.webGLContext = new GameFramework.WebGLContext(this.canvas); // The canvas from the overlay cannot be used here.
                this.texturesRegisteredByName = new Map();
                // hack
                this.lighting =
                    GameFramework.Lighting.default();
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
                this.matrixEntity = GameFramework.Matrix.buildZeroes();
                this.matrixCamera = GameFramework.Matrix.buildZeroes();
                this.matrixOrient = GameFramework.Matrix.buildZeroes();
                this.matrixPerspective = GameFramework.Matrix.buildZeroes();
                this.matrixTranslate = GameFramework.Matrix.buildZeroes();
                this.tempCoords = GameFramework.Coords.create();
                this.tempMatrix0 = GameFramework.Matrix.buildZeroes();
                this.tempMatrix1 = GameFramework.Matrix.buildZeroes();
                return this;
            }
            lightingSet(lightingToSet) {
                var webGlContext = this.webGLContext;
                var lighting = this.lighting;
                lighting.lightAmbient.writeToWebGlContext(webGlContext);
                lighting.lightDirectional.writeToWebGlContext(webGlContext);
            }
            // Display2D overlay.
            drawArc(center, radiusInner, radiusOuter, angleStartInTurns, angleStopInTurns, colorFill, colorBorder) {
                this._display2DOverlay.drawArc(center, radiusInner, radiusOuter, angleStartInTurns, angleStopInTurns, colorFill, colorBorder);
            }
            drawBackground() {
                this._display2DOverlay.drawBackground();
            }
            drawBackgroundWithColorsBackAndBorder(colorBack, colorBorder) {
                this._display2DOverlay.drawBackgroundWithColorsBackAndBorder(colorBack, colorBorder);
            }
            drawCircle(center, radius, colorFill, colorBorder, borderThickness) {
                this._display2DOverlay.drawCircle(center, radius, colorFill, colorBorder, borderThickness);
            }
            drawCircleWithGradient(center, radius, gradientFill, colorBorder) {
                this._display2DOverlay.drawCircleWithGradient(center, radius, gradientFill, colorBorder);
            }
            drawImage(imageToDraw, pos) {
                this._display2DOverlay.drawImage(imageToDraw, pos);
            }
            drawImagePartial(imageToDraw, pos, boxToShow) {
                this._display2DOverlay.drawImagePartial(imageToDraw, pos, boxToShow);
            }
            drawImagePartialScaled(imageToDraw, pos, regionToDrawAsBox, sizeToDraw) {
                this._display2DOverlay.drawImagePartialScaled(imageToDraw, pos, regionToDrawAsBox, sizeToDraw);
            }
            drawImageScaled(imageToDraw, pos, size) {
                this._display2DOverlay.drawImageScaled(imageToDraw, pos, size);
            }
            drawLine(fromPos, toPos, color, lineThickness) {
                this._display2DOverlay.drawLine(fromPos, toPos, color, lineThickness);
            }
            drawPath(vertices, color, lineThickness, isClosed) {
                this._display2DOverlay.drawPath(vertices, color, lineThickness, isClosed);
            }
            drawPolygon(vertices, colorFill, colorBorder) {
                this._display2DOverlay.drawPolygon(vertices, colorFill, colorBorder);
            }
            drawRectangle(pos, size, colorFill, colorBorder) {
                this._display2DOverlay.drawRectangle(pos, size, colorFill, colorBorder);
            }
            drawRectangleCentered(pos, size, colorFill, colorBorder) {
                this._display2DOverlay.drawRectangleCentered(pos, size, colorFill, colorBorder);
            }
            drawRectangleWithBeveledCorners(pos, size, colorFill, colorBorder, cornerRadius) {
                this._display2DOverlay.drawRectangleWithBeveledCorners(pos, size, colorFill, colorBorder, cornerRadius);
            }
            drawRectangleWithRoundedCorners(pos, size, colorFill, colorBorder, cornerRadius) {
                this._display2DOverlay.drawRectangleWithRoundedCorners(pos, size, colorFill, colorBorder, cornerRadius);
            }
            drawTextWithFontAtPos(text, fontNameAndHeight, pos) {
                this.drawTextWithFontAtPosWithColorsFillAndOutline(text, fontNameAndHeight, pos, null, null, null, null, null);
            }
            drawTextWithFontAtPosWithColorsFillAndOutline(text, fontNameAndHeight, pos, colorFill, colorOutline, isCenteredHorizontally, isCenteredVertically, sizeMaxInPixels) {
                this._display2DOverlay.drawTextWithFontAtPosWithColorsFillAndOutline(text, fontNameAndHeight, pos, colorFill, colorOutline, isCenteredHorizontally, isCenteredVertically, sizeMaxInPixels);
            }
            drawWedge(center, radius, angleStartInTurns, angleStopInTurns, colorFill, colorBorder) {
                this._display2DOverlay.drawWedge(center, radius, angleStartInTurns, angleStopInTurns, colorFill, colorBorder);
            }
            eraseModeSet(value) {
                this._display2DOverlay.eraseModeSet(value);
            }
            fontSet(fontNameAndHeight) {
                this._display2DOverlay.fontSet(fontNameAndHeight);
            }
            flush() {
                var display2d = this._display2DOverlay;
                display2d.graphics.drawImage(this.canvas, 0, 0);
            }
            hide() { }
            rotateTurnsAroundCenter(turnsToRotate, centerOfRotation) {
                this._display2DOverlay.rotateTurnsAroundCenter(turnsToRotate, centerOfRotation);
            }
            scaleFactor() {
                return this._scaleFactor;
            }
            show() { }
            sizeDefault() {
                return this._sizeDefault;
            }
            stateRestore() {
                this._display2DOverlay.stateRestore();
            }
            stateSave() {
                this._display2DOverlay.stateSave();
            }
            textWidthForFontHeight(textToMeasure, fontHeightInPixels) {
                return this._display2DOverlay.textWidthForFontHeight(textToMeasure, fontHeightInPixels);
            }
            toImage(name) {
                return null;
            }
            // Platformable.
            toDomElement() {
                return this._display2DOverlay.toDomElement();
            }
        }
        // constants
        Display3D.VerticesPerTriangle = 3;
        GameFramework.Display3D = Display3D;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
