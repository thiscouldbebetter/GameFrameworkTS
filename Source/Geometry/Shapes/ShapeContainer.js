"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeContainer extends GameFramework.ShapeBase {
            constructor(child) {
                super();
                this.child = child;
            }
            // Clonable.
            clone() {
                return new ShapeContainer(this.child.clone());
            }
            overwriteWith(other) {
                this.child.overwriteWith(other.child);
                return this;
            }
            // Equatable.
            equals(other) {
                return this.child.equals(other.child);
            }
            // ShapeBase.
            normalAtPos(posToCheck, normalOut) {
                return this.child.normalAtPos(posToCheck, normalOut);
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return this.child.surfacePointNearPos(posToCheck, surfacePointOut);
            }
            toBoxAxisAligned(boxOut) {
                return this.child.toBoxAxisAligned(boxOut);
            }
            // Transformable.
            transform(transformToApply) { throw new Error("Not implemented!"); }
        }
        GameFramework.ShapeContainer = ShapeContainer;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
