"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Edge {
            constructor(vertices) {
                this.vertices = vertices;
                this._direction = new GameFramework.Coords(0, 0, 0);
                this._displacement = new GameFramework.Coords(0, 0, 0);
                this._transverse = new GameFramework.Coords(0, 0, 0);
            }
            box() {
                if (this._box == null) {
                    this._box = new GameFramework.Box(new GameFramework.Coords(0, 0, 0), new GameFramework.Coords(0, 0, 0));
                }
                this._box.ofPoints(this.vertices);
                return this._box;
            }
            direction() {
                return this._direction.overwriteWith(this.displacement()).normalize();
            }
            equals(other) {
                return GameFramework.ArrayHelper.equals(this.vertices, other.vertices);
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
        }
        GameFramework.Edge = Edge;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
