"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Face {
            constructor(vertices) {
                this.vertices = vertices;
            }
            box() {
                if (this._box == null) {
                    this._box = new GameFramework.Box(GameFramework.Coords.create(), GameFramework.Coords.create());
                }
                this._box.ofPoints(this.vertices);
                return this._box;
            }
            containsPoint(pointToCheck) {
                var face = this;
                var faceNormal = face.plane().normal;
                var displacementFromVertex0ToCollision = GameFramework.Coords.create();
                var isPosWithinAllEdgesOfFaceSoFar = true;
                var edges = face.edges();
                for (var e = 0; e < edges.length; e++) {
                    var edgeFromFace = edges[e];
                    var edgeFromFaceVertex0 = edgeFromFace.vertices[0];
                    displacementFromVertex0ToCollision.overwriteWith(pointToCheck).subtract(edgeFromFaceVertex0);
                    var edgeFromFaceTransverse = edgeFromFace.transverse(faceNormal);
                    var displacementProjectedAlongEdgeTransverse = displacementFromVertex0ToCollision.dotProduct(edgeFromFaceTransverse);
                    if (displacementProjectedAlongEdgeTransverse > 0) {
                        isPosWithinAllEdgesOfFaceSoFar = false;
                        break;
                    }
                }
                return isPosWithinAllEdgesOfFaceSoFar;
            }
            edges() {
                if (this._edges == null) {
                    this._edges = [];
                    for (var v = 0; v < this.vertices.length; v++) {
                        var vNext = GameFramework.NumberHelper.wrapToRangeMinMax(v + 1, 0, this.vertices.length);
                        var vertex = this.vertices[v];
                        var vertexNext = this.vertices[vNext];
                        var edge = new GameFramework.Edge([vertex, vertexNext]);
                        this._edges.push(edge);
                    }
                }
                return this._edges;
            }
            plane() {
                if (this._plane == null) {
                    this._plane = new GameFramework.Plane(GameFramework.Coords.create(), 0);
                }
                this._plane.fromPoints(this.vertices[0], this.vertices[1], this.vertices[2]);
                return this._plane;
            }
            // Cloneable.
            clone() {
                return new Face(GameFramework.ArrayHelper.clone(this.vertices));
            }
            overwriteWith(other) {
                GameFramework.ArrayHelper.overwriteWith(this.vertices, other.vertices);
                return this;
            }
            // Equatable
            equals(other) {
                return GameFramework.ArrayHelper.equals(this.vertices, other.vertices);
            }
            // ShapeBase.
            collider() { return null; }
            locate(loc) {
                throw new Error("Not implemented!");
            }
            normalAtPos(posToCheck, normalOut) {
                throw new Error("Not implemented!");
            }
            pointRandom(randomizer) {
                return null; // todo
            }
            surfacePointNearPos(posToCheck, surfacePointOut) { throw new Error("Not implemented!"); }
            toBox(boxOut) {
                return boxOut.ofPoints(this.vertices);
            }
            // Transformable.
            transform(transformToApply) {
                GameFramework.Transforms.applyTransformToCoordsMany(transformToApply, this.vertices);
                return this;
            }
        }
        GameFramework.Face = Face;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
