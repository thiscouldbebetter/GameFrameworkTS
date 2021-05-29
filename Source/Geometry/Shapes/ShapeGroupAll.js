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
            // ShapeBase.
            locate(loc) {
                throw new Error("Not implemented!");
            }
            normalAtPos(posToCheck, normalOut) {
                throw new Error("Not implemented!");
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                throw new Error("Not implemented!");
            }
            toBox(boxOut) {
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
