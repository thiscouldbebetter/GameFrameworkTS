"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Edge {
            constructor(vertices) {
                this.vertices = vertices || [GameFramework.Coords.create(), GameFramework.Coords.create()];
                this._direction = GameFramework.Coords.create();
                this._displacement = GameFramework.Coords.create();
                this._transverse = GameFramework.Coords.create();
            }
            static create() {
                return new Edge(null);
            }
            static fromVertex0And1(vertex0, vertex1) {
                return new Edge([vertex0, vertex1]);
            }
            direction() {
                return this._direction.overwriteWith(this.displacement()).normalize();
            }
            displacement() {
                return this._displacement.overwriteWith(this.vertices[1]).subtract(this.vertices[0]);
            }
            length() {
                return this.displacement().magnitude();
            }
            projectOntoOther(other) {
                var otherVertices = other.vertices;
                var otherVertex0 = otherVertices[0];
                var otherDirection = other.direction();
                var otherTransverse = other.transverse(GameFramework.Coords.Instances().ZeroZeroOne);
                for (var i = 0; i < this.vertices.length; i++) {
                    var vertex = this.vertices[i];
                    vertex.subtract(otherVertex0);
                    vertex.overwriteWithDimensions(vertex.dotProduct(otherDirection), vertex.dotProduct(otherTransverse), 0);
                }
                return this;
            }
            transverse(faceNormal) {
                return this._transverse.overwriteWith(this.direction()).crossProduct(faceNormal);
            }
            // string
            toString() {
                return this.vertices.toString();
            }
            // Cloneable.
            clone() {
                return new Edge(GameFramework.ArrayHelper.clone(this.vertices));
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
            locate(loc) { throw new Error("Not implemented!"); }
            normalAtPos(posToCheck, normalOut) { throw new Error("Not implemented!"); }
            surfacePointNearPos(posToCheck, surfacePointOut) { throw new Error("Not implemented!"); }
            toBox(boxOut) {
                return boxOut.ofPoints(this.vertices);
            }
            // Transformable.
            transform(transformToApply) { throw new Error("Not implemented!"); }
        }
        GameFramework.Edge = Edge;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
