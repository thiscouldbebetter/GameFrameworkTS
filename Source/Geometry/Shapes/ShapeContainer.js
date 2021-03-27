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
            // ShapeBase.
            locate(loc) {
                this.shape.locate(loc);
                return this;
            }
            normalAtPos(posToCheck, normalOut) {
                return this.shape.normalAtPos(posToCheck, normalOut);
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return this.shape.surfacePointNearPos(posToCheck, surfacePointOut);
            }
            toBox(boxOut) {
                return this.shape.toBox(boxOut);
            }
        }
        GameFramework.ShapeContainer = ShapeContainer;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
