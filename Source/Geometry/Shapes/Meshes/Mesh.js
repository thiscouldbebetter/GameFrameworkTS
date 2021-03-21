"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Mesh {
            constructor(center, vertexOffsets, faceBuilders) {
                this.center = center;
                this.vertexOffsets = vertexOffsets;
                this.faceBuilders = faceBuilders;
            }
            // static methods
            static boxOfSize(center, size) {
                var box = new GameFramework.Box(center, size);
                var returnValue = Mesh.fromBox(box);
                return returnValue;
            }
            static cubeUnit(center) {
                if (center == null) {
                    center = GameFramework.Coords.blank();
                }
                var size = new GameFramework.Coords(2, 2, 2);
                var returnValue = Mesh.boxOfSize(center, size);
                return returnValue;
            }
            static fromBox(box) {
                var sizeHalf = box.sizeHalf();
                var min = new GameFramework.Coords(-sizeHalf.x, -sizeHalf.y, -sizeHalf.z);
                var max = new GameFramework.Coords(sizeHalf.x, sizeHalf.y, sizeHalf.z);
                var vertexOffsets = [
                    // top
                    new GameFramework.Coords(min.x, min.y, min.z),
                    new GameFramework.Coords(max.x, min.y, min.z),
                    new GameFramework.Coords(max.x, max.y, min.z),
                    new GameFramework.Coords(min.x, max.y, min.z),
                    // bottom
                    new GameFramework.Coords(min.x, min.y, max.z),
                    new GameFramework.Coords(max.x, min.y, max.z),
                    new GameFramework.Coords(max.x, max.y, max.z),
                    new GameFramework.Coords(min.x, max.y, max.z),
                ];
                var faceBuilders = [
                    new Mesh_FaceBuilder([0, 1, 5, 4]),
                    new Mesh_FaceBuilder([1, 2, 6, 5]),
                    new Mesh_FaceBuilder([2, 3, 7, 6]),
                    new Mesh_FaceBuilder([3, 0, 4, 7]),
                    new Mesh_FaceBuilder([0, 3, 2, 1]),
                    new Mesh_FaceBuilder([4, 5, 6, 7]),
                ];
                var returnValue = new Mesh(box.center, vertexOffsets, faceBuilders);
                return returnValue;
            }
            static fromFace(center, faceToExtrude, thickness) {
                var faceVertices = faceToExtrude.vertices;
                var numberOfFaceVertices = faceVertices.length;
                var thicknessHalf = thickness / 2;
                var meshVertices = [];
                var faceBuilders = [];
                for (var z = 0; z < 2; z++) {
                    var offsetForExtrusion = new GameFramework.Coords(0, 0, (z == 0 ? -1 : 1)).multiplyScalar(thicknessHalf);
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
                if (this._box == null) {
                    this._box = new GameFramework.Box(GameFramework.Coords.blank(), GameFramework.Coords.blank());
                }
                this._box.ofPoints(this.vertices());
                return this._box;
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
                        this._vertices.push(GameFramework.Coords.blank());
                    }
                }
                for (var v = 0; v < this._vertices.length; v++) {
                    var vertex = this._vertices[v];
                    var vertexOffset = this.vertexOffsets[v];
                    vertex.overwriteWith(this.center).add(vertexOffset);
                }
                return this._vertices;
            }
            // transformable
            transform(transformToApply) {
                for (var v = 0; v < this.vertexOffsets.length; v++) {
                    var vertexOffset = this.vertexOffsets[v];
                    transformToApply.transformCoords(vertexOffset);
                }
                this.vertices(); // hack - Recalculate.
                return this;
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
            // transformable
            coordsGroupToTranslate() {
                return [this.center];
            }
            // ShapeBase.
            locate(loc) {
                return GameFramework.ShapeHelper.Instance().applyLocationToShapeDefault(loc, this);
            }
            normalAtPos(posToCheck, normalOut) {
                return this.box().normalAtPos(posToCheck, normalOut);
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return surfacePointOut.overwriteWith(posToCheck); // todo
            }
        }
        GameFramework.Mesh = Mesh;
        class Mesh_FaceBuilder {
            constructor(vertexIndices) {
                this.vertexIndices = vertexIndices;
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
            ;
            vertexIndicesShift(offset) {
                for (var i = 0; i < this.vertexIndices.length; i++) {
                    var vertexIndex = this.vertexIndices[i];
                    vertexIndex += offset;
                    this.vertexIndices[i] = vertexIndex;
                }
            }
            // clonable
            clone() {
                return new Mesh_FaceBuilder(this.vertexIndices.slice());
            }
            overwriteWith(other) {
                GameFramework.ArrayHelper.overwriteWith(this.vertexIndices, other.vertexIndices);
            }
        }
        GameFramework.Mesh_FaceBuilder = Mesh_FaceBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
