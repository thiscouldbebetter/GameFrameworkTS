"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeGroupAll {
            constructor(shapes) {
                this.shapes = shapes;
            }
            // Clonable.
            clone() {
                return new ShapeGroupAll(GameFramework.ArrayHelper.clone(this.shapes));
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
                var doAnyChildShapesNotContainPoint = this.shapes.some(x => x.containsPoint(pointToCheck) == false);
                var doAllChildShapesContainPoint = (doAnyChildShapesNotContainPoint == false);
                return doAllChildShapesContainPoint;
            }
            normalAtPos(posToCheck, normalOut) {
                throw new Error("Not implemented!");
            }
            pointRandom(randomizer) {
                return null; // todo
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                throw new Error("Not implemented!");
            }
            toBoxAxisAligned(boxOut) {
                throw new Error("Not implemented!");
            }
            // Transformable.
            transform(transformToApply) {
                this.shapes.forEach((x) => x.transform(transformToApply));
                return this;
            }
        }
        GameFramework.ShapeGroupAll = ShapeGroupAll;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
