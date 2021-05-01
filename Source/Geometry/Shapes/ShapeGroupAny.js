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
            // Clonable.
            clone() {
                return new ShapeGroupAny(GameFramework.ArrayHelper.clone(this.shapes));
            }
            overwriteWith(other) {
                GameFramework.ArrayHelper.overwriteWith(this.shapes, other.shapes);
                return this;
            }
            // ShapeBase.
            locate(loc) {
                throw ("Not implemented!");
            }
            normalAtPos(posToCheck, normalOut) {
                throw ("Not implemented!");
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
            toBox(boxOut) { throw ("Not implemented!"); }
            // Transformable.
            transform(transformToApply) {
                this.shapes.forEach((x) => x.transform(transformToApply));
                return this;
            }
        }
        GameFramework.ShapeGroupAny = ShapeGroupAny;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
