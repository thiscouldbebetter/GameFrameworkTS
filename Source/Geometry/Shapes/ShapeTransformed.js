"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeTransformed {
            constructor(transformToApply, child) {
                this.transformToApply = transformToApply;
                this.child = child;
            }
            static fromTransformAndChild(transformToApply, child) {
                return new ShapeTransformed(transformToApply, child);
            }
            // Clonable.
            clone() {
                return new ShapeTransformed(this.transformToApply.clone(), this.child.clone());
            }
            overwriteWith(other) {
                this.transformToApply.overwriteWith(other.transformToApply);
                this.child.overwriteWith(other.child);
                return this;
            }
            // Equatable
            equals(other) {
                throw new Error("Not yet implemented!");
            }
            // ShapeBase.
            collider() { return null; }
            containsPoint(pointToCheck) {
                throw new Error("Not yet implemented!");
            }
            normalAtPos(posToCheck, normalOut) {
                throw new Error("Not yet implemented!");
            }
            pointRandom(randomizer) {
                throw new Error("Not yet implemented!");
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                throw new Error("Not yet implemented!");
            }
            toBoxAxisAligned(boxOut) { throw new Error("Not implemented!"); }
            // Transformable.
            transform(transformToApply) {
                this.child.transform(transformToApply); // Is this correct?
                return this;
            }
        }
        GameFramework.ShapeTransformed = ShapeTransformed;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
