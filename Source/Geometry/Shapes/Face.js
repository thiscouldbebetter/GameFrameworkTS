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
                    this._box = new GameFramework.Box(new GameFramework.Coords(0, 0, 0), new GameFramework.Coords(0, 0, 0));
                }
                this._box.ofPoints(this.vertices);
                return this._box;
            }
            containsPoint(pointToCheck) {
                var face = this;
                var faceNormal = face.plane().normal;
                var displacementFromVertex0ToCollision = new GameFramework.Coords(0, 0, 0);
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
            equals(other) {
                return GameFramework.ArrayHelper.equals(this.vertices, other.vertices);
            }
            plane() {
                if (this._plane == null) {
                    this._plane = new GameFramework.Plane(new GameFramework.Coords(0, 0, 0), 0);
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
            // Transformable.
            transform(transformToApply) {
                GameFramework.Transforms.applyTransformToCoordsMany(transformToApply, this.vertices);
                return this;
            }
        }
        GameFramework.Face = Face;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
