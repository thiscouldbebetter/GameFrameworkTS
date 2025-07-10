"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeGroupAny {
            constructor(shapes) {
                this.shapes = shapes;
                this._displacement = GameFramework.Coords.create();
                this._surfacePointForChild = GameFramework.Coords.create();
            }
            static fromShapes(shapes) {
                return new ShapeGroupAny(shapes);
            }
            // Clonable.
            clone() {
                return new ShapeGroupAny(GameFramework.ArrayHelper.clone(this.shapes));
            }
            overwriteWith(other) {
                GameFramework.ArrayHelper.overwriteWith(this.shapes, other.shapes);
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
            // ShapeBase.
            collider() { return null; }
            containsPoint(pointToCheck) {
                throw new Error("Not yet implemented!");
            }
            locate(loc) {
                this.shapes.forEach(x => x.locate(loc));
                return this;
            }
            normalAtPos(posToCheck, normalOut) {
                throw new Error("Not implemented!");
            }
            pointRandom(randomizer) {
                return null; // todo
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                var distanceMinSoFar = Number.POSITIVE_INFINITY;
                for (var i = 0; i < this.shapes.length; i++) {
                    var shape = this.shapes[i];
                    shape.surfacePointNearPos(posToCheck, this._surfacePointForChild);
                    var distanceFromPosToCheck = this._displacement.overwriteWith(this._surfacePointForChild).subtract(posToCheck).magnitude();
                    if (distanceFromPosToCheck < distanceMinSoFar) {
                        distanceMinSoFar = distanceFromPosToCheck;
                        surfacePointOut.overwriteWith(this._surfacePointForChild);
                    }
                }
                return surfacePointOut;
            }
            toBox(boxOut) { throw new Error("Not implemented!"); }
            // Transformable.
            transform(transformToApply) {
                this.shapes.forEach((x) => x.transform(transformToApply));
                return this;
            }
        }
        GameFramework.ShapeGroupAny = ShapeGroupAny;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
