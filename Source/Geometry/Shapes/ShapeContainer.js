"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeContainer {
            constructor(shape) {
                this.shape = shape;
            }
            // Clonable.
            clone() {
                return new ShapeContainer(this.shape.clone());
            }
            overwriteWith(other) {
                this.shape.overwriteWith(other.shape);
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
            // ShapeBase.
            collider() { return null; }
            locate(loc) {
                this.shape.locate(loc);
                return this;
            }
            normalAtPos(posToCheck, normalOut) {
                return this.shape.normalAtPos(posToCheck, normalOut);
            }
            pointRandom(randomizer) {
                return null; // todo
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return this.shape.surfacePointNearPos(posToCheck, surfacePointOut);
            }
            toBox(boxOut) {
                return this.shape.toBox(boxOut);
            }
            // Transformable.
            transform(transformToApply) { throw new Error("Not implemented!"); }
        }
        GameFramework.ShapeContainer = ShapeContainer;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
