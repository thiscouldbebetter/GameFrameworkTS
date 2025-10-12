"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeInverse extends GameFramework.ShapeBase {
            constructor(child) {
                super();
                this.child = child;
            }
            static fromChild(child) {
                return new ShapeInverse(child);
            }
            // Clonable.
            clone() {
                return new ShapeInverse(this.child.clone());
            }
            overwriteWith(other) {
                this.child.overwriteWith(other.child);
                return this;
            }
            // Equatable
            equals(other) { return this.child.equals(other.child); }
            // ShapeBase.
            containsPoint(pointToCheck) {
                return (this.child.containsPoint(pointToCheck) == false);
            }
            normalAtPos(posToCheck, normalOut) {
                return this.child.normalAtPos(posToCheck, normalOut).invert();
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return this.child.surfacePointNearPos(posToCheck, surfacePointOut);
            }
            // Transformable.
            transform(transformToApply) {
                this.child.transform(transformToApply);
                return this;
            }
        }
        GameFramework.ShapeInverse = ShapeInverse;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
