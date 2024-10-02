"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeInverse {
            constructor(shape) {
                this.shape = shape;
            }
            // Clonable.
            clone() {
                return new ShapeInverse(this.shape.clone());
            }
            overwriteWith(other) {
                this.shape.overwriteWith(other.shape);
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
            // ShapeBase.
            collider() { return null; }
            containsPoint(pointToCheck) {
                return (this.shape.containsPoint(pointToCheck) == false);
            }
            locate(loc) {
                this.shape.locate(loc);
                return this;
            }
            normalAtPos(posToCheck, normalOut) {
                return this.shape.normalAtPos(posToCheck, normalOut).invert();
            }
            pointRandom(randomizer) {
                return null; // todo
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return this.shape.surfacePointNearPos(posToCheck, surfacePointOut);
            }
            toBox(boxOut) { throw new Error("Not implemented!"); }
            // Transformable.
            transform(transformToApply) { throw new Error("Not implemented!"); }
        }
        GameFramework.ShapeInverse = ShapeInverse;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
