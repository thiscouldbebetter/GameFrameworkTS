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
                this.colorFore = colorFore;
                this.colorBack = colorBack;
                this._sizeDefault = sizeInPixels;
                this._scaleFactor = GameFramework.Coords.ones();
                this._display2DOverlay = new GameFramework.Display2D(this.sizesAvailable, fontNameAndHeight, colorFore, colorBack, null);
            }
            // methods
            cameraSet(camera) {
                var cameraLoc = camera.loc;
                var matrixCamera = this.matrixCamera.overwriteWithTranslate(cameraLoc.pos.clone().multiplyScalar(-1)).multiply(this.matrixOrient.overwriteWithOrientationCamera(cameraLoc.orientation)).multiply(this.matrixPerspective.overwriteWithPerspectiveForCamera(camera));
                var webGLContext = this.webGLContext;
                var gl = webGLContext.gl;
                var shaderProgram = webGLContext.shaderProgram;
                gl.uniformMatrix4fv(shaderProgram.cameraMatrix, false, // transpose
                matrixCamera.toWebGLArray());
            }
            clear() {
                var webGLContext = this.webGLContext;
                var gl = webGLContext.gl;
                // var shaderProgram = webGLContext.shaderProgram;
                var viewportDimensionsAsIntegers = gl.getParameter(gl.VIEWPORT);
                gl.viewport(0, 0, viewportDimensionsAsIntegers[2], viewportDimensionsAsIntegers[3]);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                this._display2DOverlay.clear();
            }
            colorAtPos(pos, colorOut) {
                throw new Error("Not yet implemented!");
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
                var webGLContext = this.webGLContext;
                var gl = webGLContext.gl;
                var shaderProgram = webGLContext.shaderProgram;
                var vertexPositionsAsFloatArray = [];
                var vertexColorsAsFloatArray = [];
                var vertexNormalsAsFloatArray = [];
                var vertexTextureUVsAsFloatArray = [];
                var numberOfTrianglesSoFar = 0;
                var materials = mesh.materials;
                var faces = mesh.faces();
                var faceTextures = mesh.faceTextures;
                var faceIndicesByMaterialName = mesh.faceIndicesByMaterialName();
                for (var m = 0; m < materials.length; m++) {
                    var material = materials[m];
                    var materialName = material.name;
                    var faceIndices = faceIndicesByMaterialName.get(materialName);
                    for (var fi = 0; fi < faceIndices.length; fi++) {
                        var f = faceIndices[fi];
                        var face = faces[f];
                        var faceMaterial = face.material;
                        var faceGeometry = face.geometry;
                        var faceNormal = faceGeometry.plane().normal;
                        // todo
                        // var vertexNormalsForFaceVertices = mesh.vertexNormalsForFaceVertices;
                        var vertexIndicesForTriangles = [
                            [0, 1, 2]
                        ];
                        var faceVertices = faceGeometry.vertices;
                        var numberOfVerticesInFace = faceVertices.length;
                        if (numberOfVerticesInFace == 4) {
                            vertexIndicesForTriangles.push([0, 2, 3]);
                        }
                        for (var t = 0; t < vertexIndicesForTriangles.length; t++) {
                            var vertexIndicesForTriangle = vertexIndicesForTriangles[t];
                            for (var vi = 0; vi < vertexIndicesForTriangle.length; vi++) {
                                var vertexIndex = vertexIndicesForTriangle[vi];
                                var vertex = faceVertices[vertexIndex];
                                vertexPositionsAsFloatArray = vertexPositionsAsFloatArray.concat(vertex.dimensions());
                                var vertexColor = faceMaterial.colorFill;
                                vertexColorsAsFloatArray = vertexColorsAsFloatArray.concat(vertexColor.componentsRGBA);
                                var vertexNormal = faceNormal;
                                /*
                                // todo
                                (
                                    vertexNormalsForFaceVertices == null
                                    ? faceNormal
                                    : vertexNormalsForFaceVertices[f][vertexIndex]
                                );
                                */
                                vertexNormalsAsFloatArray = vertexNormalsAsFloatArray.concat(vertexNormal.dimensions());
                                var vertexTextureUV = (faceTextures == null
                                    ? GameFramework.Coords.fromXY(-1, -1)
                                    : faceTextures[f] == null
                                        ? GameFramework.Coords.fromXY(-1, -1)
                                        : faceTextures[f].textureUVs[vertexIndex]);
                                vertexTextureUVsAsFloatArray = vertexTextureUVsAsFloatArray.concat([
                                    vertexTextureUV.x,
                                    vertexTextureUV.y
                                ]);
                            }
                        }
                        numberOfTrianglesSoFar += vertexIndicesForTriangles.length;
                    }
                    var colorBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColorsAsFloatArray), gl.STATIC_DRAW);
                    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, GameFramework.Color.NumberOfComponentsRGBA, gl.FLOAT, false, 0, 0);
                    var normalBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormalsAsFloatArray), gl.STATIC_DRAW);
                    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, GameFramework.Coords.NumberOfDimensions, gl.FLOAT, false, 0, 0);
                    var positionBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionsAsFloatArray), gl.STATIC_DRAW);
                    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, GameFramework.Coords.NumberOfDimensions, gl.FLOAT, false, 0, 0);
                    var texture = material.texture;
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
                    gl.uniform1i(shaderProgram.samplerUniform, 0);
                    var textureBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureUVsAsFloatArray), gl.STATIC_DRAW);
                    gl.vertexAttribPointer(shaderProgram.vertexTextureUVAttribute, 2, gl.FLOAT, false, 0, 0);
                    gl.drawArrays(gl.TRIANGLES, 0, numberOfTrianglesSoFar * Display3D.VerticesPerTriangle);
                } // end for each material
            }
            drawMeshWithOrientation(mesh, meshOrientation) {
                var matrixOrient = this.matrixOrient;
                var matrixEntity = this.matrixEntity.overwriteWithOrientationMover(meshOrientation).multiply(matrixOrient.overwriteWithOrientationEntity(meshOrientation));
                var webGLContext = this.webGLContext;
                var gl = webGLContext.gl;
                var shaderProgram = webGLContext.shaderProgram;
                gl.uniformMatrix4fv(shaderProgram.normalMatrix, false, // transpose
                matrixOrient.toWebGLArray());
                gl.uniformMatrix4fv(shaderProgram.entityMatrix, false, // transpose
                matrixEntity.toWebGLArray());
                this.drawMesh(mesh);
            }
            drawPixel(pos, color) {
                this._display2DOverlay.drawPixel(pos, color);
            }
            initialize(universe) {
                this._display2DOverlay.initialize(universe);
                this.canvas = document.createElement("canvas");
                this.canvas.style.position = "absolute";
                this.canvas.width = this.sizeInPixels.x;
                this.canvas.height = this.sizeInPixels.y;
                this.webGLContext = new GameFramework.WebGLContext(this.canvas);
                this.texturesRegisteredByName = new Map();
                // hack
                this.lighting = new GameFramework.Lighting(.5, // ambientIntensity
                new GameFramework.Coords(-1, -1, -1), // direction
                .3 // directionalIntensity
                );
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
                var webGLContext = this.webGLContext;
                var gl = webGLContext.gl;
                var shaderProgram = webGLContext.shaderProgram;
                var lighting = this.lighting;
                gl.uniform1f(shaderProgram.lightAmbientIntensity, lighting.ambientIntensity);
                gl.uniform3fv(shaderProgram.lightDirection, GameFramework.WebGLContext.coordsToWebGLArray(lighting.direction));
                gl.uniform1f(shaderProgram.lightDirectionalIntensity, lighting.directionalIntensity);
            }
            // Display2D overlay.
            drawArc(center, radiusInner, radiusOuter, angleStartInTurns, angleStopInTurns, colorFill, colorBorder) {
                this._display2DOverlay.drawArc(center, radiusInner, radiusOuter, angleStartInTurns, angleStopInTurns, colorFill, colorBorder);
            }
            drawBackground(colorBack, colorBorder) {
                this._display2DOverlay.drawBackground(colorBack, colorBorder);
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
            drawText(text, fontNameAndHeight, pos, colorFill, colorOutline, isCenteredHorizontally, isCenteredVertically, sizeMaxInPixels) {
                this._display2DOverlay.drawText(text, fontNameAndHeight, pos, colorFill, colorOutline, isCenteredHorizontally, isCenteredVertically, sizeMaxInPixels);
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
            flush() { }
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
            toImage() {
                return null;
            }
            // platformable
            toDomElement() {
                var returnValue = document.createElement("div");
                returnValue.appendChild(this.canvas);
                var overlayAsDomElement = this._display2DOverlay.toDomElement();
                returnValue.appendChild(overlayAsDomElement);
                return returnValue;
            }
        }
        // constants
        Display3D.VerticesPerTriangle = 3;
        GameFramework.Display3D = Display3D;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
