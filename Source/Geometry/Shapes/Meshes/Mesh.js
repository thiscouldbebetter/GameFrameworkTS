"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Mesh extends GameFramework.ShapeBase {
            constructor(center, vertexOffsets, faceBuilders) {
                super();
                this.center = center;
                this.vertexOffsets = vertexOffsets;
                this.faceBuilders = faceBuilders;
            }
            // static methods
            static boxOfSize(center, size) {
                var box = GameFramework.BoxAxisAligned.fromCenterAndSize(center, size);
                var returnValue = Mesh.fromBox(box);
                return returnValue;
            }
            static cubeUnit(center) {
                if (center == null) {
                    center = GameFramework.Coords.create();
                }
                var size = GameFramework.Coords.fromXYZ(2, 2, 2);
                var returnValue = Mesh.boxOfSize(center, size);
                return returnValue;
            }
            static fromBox(box) {
                var sizeHalf = box.sizeHalf();
                var min = GameFramework.Coords.fromXYZ(-sizeHalf.x, -sizeHalf.y, -sizeHalf.z);
                var max = GameFramework.Coords.fromXYZ(sizeHalf.x, sizeHalf.y, sizeHalf.z);
                var vertexOffsets = [
                    // top
                    GameFramework.Coords.fromXYZ(min.x, min.y, min.z),
                    GameFramework.Coords.fromXYZ(max.x, min.y, min.z),
                    GameFramework.Coords.fromXYZ(max.x, max.y, min.z),
                    GameFramework.Coords.fromXYZ(min.x, max.y, min.z),
                    // bottom
                    GameFramework.Coords.fromXYZ(min.x, min.y, max.z),
                    GameFramework.Coords.fromXYZ(max.x, min.y, max.z),
                    GameFramework.Coords.fromXYZ(max.x, max.y, max.z),
                    GameFramework.Coords.fromXYZ(min.x, max.y, max.z),
                ];
                var faceBuilders = [
                    Mesh_FaceBuilder.fromVertexIndices([0, 1, 5, 4]), // north
                    Mesh_FaceBuilder.fromVertexIndices([1, 2, 6, 5]), // east
                    Mesh_FaceBuilder.fromVertexIndices([2, 3, 7, 6]), // south
                    Mesh_FaceBuilder.fromVertexIndices([3, 0, 4, 7]), // west
                    Mesh_FaceBuilder.fromVertexIndices([0, 3, 2, 1]), // top
                    Mesh_FaceBuilder.fromVertexIndices([4, 5, 6, 7]), // bottom
                ];
                var returnValue = Mesh.fromCenterVertexOffsetsAndFaceBuilders(box.center, vertexOffsets, faceBuilders);
                return returnValue;
            }
            static fromCenterVertexOffsetsAndFaceBuilders(center, vertexOffsets, faceBuilders) {
                return new Mesh(center, vertexOffsets, faceBuilders);
            }
            static fromFace(face) {
                return Mesh.fromCenterFaceToExtrudeAndThickness(GameFramework.Coords.create(), face, 1);
            }
            static fromCenterFaceToExtrudeAndThickness(center, faceToExtrude, thickness) {
                var faceVertices = faceToExtrude.vertices;
                var numberOfFaceVertices = faceVertices.length;
                var thicknessHalf = thickness / 2;
                var meshVertices = [];
                var faceBuilders = [];
                for (var z = 0; z < 2; z++) {
                    var offsetForExtrusion = GameFramework.Coords.fromXYZ(0, 0, (z == 0 ? -1 : 1)).multiplyScalar(thicknessHalf);
                    var vertexIndicesTopOrBottom = [];
                    for (var v = 0; v < numberOfFaceVertices; v++) {
                        var vertexIndex = meshVertices.length;
                        if (z == 0) {
                            var vertexIndexNext = GameFramework.NumberHelper.wrapToRangeMinMax(vertexIndex + 1, 0, numberOfFaceVertices);
                            var faceBuilderSide = new Mesh_FaceBuilder([
                                vertexIndex,
                                vertexIndexNext,
                                vertexIndexNext + numberOfFaceVertices,
                                vertexIndex + numberOfFaceVertices
                            ]);
                            faceBuilders.push(faceBuilderSide);
                            vertexIndicesTopOrBottom.push(vertexIndex);
                        }
                        else {
                            vertexIndicesTopOrBottom.splice(0, 0, vertexIndex);
                        }
                        var vertex = faceVertices[v].clone().add(offsetForExtrusion);
                        meshVertices.push(vertex);
                    }
                    var faceBuilderTopOrBottom = new Mesh_FaceBuilder(vertexIndicesTopOrBottom);
                    faceBuilders.push(faceBuilderTopOrBottom);
                }
                var returnValue = new Mesh(center, meshVertices, // vertexOffsets
                faceBuilders);
                return returnValue;
            }
            // instance methods
            box() {
                if (this._boxAxisAligned == null) {
                    this._boxAxisAligned = GameFramework.BoxAxisAligned.create();
                }
                this._boxAxisAligned.containPoints(this.vertices());
                return this._boxAxisAligned;
            }
            edges() {
                return null; // todo
            }
            faces() {
                var vertices = this.vertices();
                if (this._faces == null) {
                    this._faces = [];
                    for (var f = 0; f < this.faceBuilders.length; f++) {
                        var faceBuilder = this.faceBuilders[f];
                        var face = faceBuilder.toFace(vertices);
                        this._faces.push(face);
                    }
                }
                return this._faces;
            }
            vertices() {
                if (this._vertices == null) {
                    this._vertices = [];
                    for (var v = 0; v < this.vertexOffsets.length; v++) {
                        this._vertices.push(GameFramework.Coords.create());
                    }
                }
                for (var v = 0; v < this._vertices.length; v++) {
                    var vertex = this._vertices[v];
                    var vertexOffset = this.vertexOffsets[v];
                    vertex.overwriteWith(this.center).add(vertexOffset);
                }
                return this._vertices;
            }
            // clonable
            clone() {
                return new Mesh(this.center.clone(), GameFramework.ArrayHelper.clone(this.vertexOffsets), GameFramework.ArrayHelper.clone(this.faceBuilders));
            }
            overwriteWith(other) {
                this.center.overwriteWith(other.center);
                GameFramework.ArrayHelper.overwriteWith(this.vertexOffsets, other.vertexOffsets);
                GameFramework.ArrayHelper.overwriteWith(this.faceBuilders, other.faceBuilders);
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
            // Transformable.
            coordsGroupToTransform() {
                return [this.center];
            }
            transform(transformToApply) {
                for (var v = 0; v < this.vertexOffsets.length; v++) {
                    var vertexOffset = this.vertexOffsets[v];
                    transformToApply.transformCoords(vertexOffset);
                }
                this.vertices(); // hack - Recalculate.
                return this;
            }
            // Serialization.
            static fromStringHumanReadable(meshAsString) {
                var newline = "\n";
                var lines = meshAsString.split(newline);
                var centerAsString = lines[1].split(": ")[1];
                var center = GameFramework.Coords.fromStringXxYxZ(centerAsString);
                lines = lines.slice(4);
                var textFaces = "Faces:";
                var lineIndexForTextFaces = lines.indexOf(textFaces);
                var vertexOffsetsAsStrings = lines.slice(0, lineIndexForTextFaces);
                var facesAsLines = lines.slice(lineIndexForTextFaces + 1);
                var vertexOffsets = vertexOffsetsAsStrings
                    .map(x => GameFramework.Coords.fromStringXxYxZ(x.split(": ")[1]));
                var vertexIndicesForFaces = facesAsLines.map(x => x
                    .split(": ")[1]
                    .split(", ")
                    .map(y => parseInt(y)));
                var faceBuilders = vertexIndicesForFaces
                    .map(x => Mesh_FaceBuilder.fromVertexIndices(x));
                var mesh = Mesh.fromCenterVertexOffsetsAndFaceBuilders(center, vertexOffsets, faceBuilders);
                return mesh;
            }
            toStringHumanReadable() {
                var verticesAsStrings = this.vertexOffsets.map((v, i) => i + ": " + v.toStringXxYxZ());
                var newline = "\n";
                var verticesAsString = verticesAsStrings.join(newline);
                var tab = "\t";
                var tabTab = tab + tab;
                var newlineTabTab = newline + tabTab;
                verticesAsString =
                    tabTab
                        + verticesAsString
                            .split(newline)
                            .join(newlineTabTab);
                var facesAsVertexIndexStrings = this.faceBuilders.map((f, i) => i + ": " + f.toStringHumanReadable());
                var facesAsString = facesAsVertexIndexStrings.join(newline);
                facesAsString =
                    tabTab
                        + facesAsString
                            .split(newline)
                            .join(newlineTabTab);
                var lines = [
                    Mesh.name + ":",
                    tab + "Center: " + this.center.toStringXxYxZ(),
                    tab + "Vertices:",
                    verticesAsString,
                    tab + "Faces:",
                    facesAsString
                ];
                var returnValue = lines.join(newline);
                return returnValue;
            }
            // ShapeBase.
            normalAtPos(posToCheck, normalOut) {
                return this.box().normalAtPos(posToCheck, normalOut);
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return surfacePointOut.overwriteWith(posToCheck); // todo
            }
            toBoxAxisAligned(boxOut) {
                return boxOut.containPoints(this.vertices());
            }
        }
        GameFramework.Mesh = Mesh;
        class Mesh_FaceBuilder {
            constructor(vertexIndices) {
                this.vertexIndices = vertexIndices;
            }
            static fromVertexIndices(vertexIndices) {
                return new Mesh_FaceBuilder(vertexIndices);
            }
            toFace(meshVertices) {
                var faceVertices = [];
                for (var vi = 0; vi < this.vertexIndices.length; vi++) {
                    var vertexIndex = this.vertexIndices[vi];
                    var meshVertex = meshVertices[vertexIndex];
                    faceVertices.push(meshVertex);
                }
                var returnValue = new GameFramework.Face(faceVertices);
                return returnValue;
            }
            vertexIndicesShift(offset) {
                for (var i = 0; i < this.vertexIndices.length; i++) {
                    var vertexIndex = this.vertexIndices[i];
                    vertexIndex += offset;
                    this.vertexIndices[i] = vertexIndex;
                }
            }
            // Clonable.
            clone() {
                return new Mesh_FaceBuilder(this.vertexIndices.slice());
            }
            overwriteWith(other) {
                GameFramework.ArrayHelper.overwriteWithNonClonables(this.vertexIndices, other.vertexIndices);
                return this;
            }
            // Serialization.
            toStringHumanReadable() {
                return this.vertexIndices.join(", ");
            }
            // Transformable.
            transform(transformToApply) { throw new Error("Not implemented!"); }
        }
        GameFramework.Mesh_FaceBuilder = Mesh_FaceBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
