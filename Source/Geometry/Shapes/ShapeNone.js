"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeNone {
            // Clonable.
            clone() {
                return new ShapeNone();
            }
            overwriteWith(other) {
                return this;
            }
            // Equatable
            equals(other) { return false; }
            // ShapeBase.
            collider() { return null; }
            containsPoint(pointToCheck) {
                return false;
            }
            locate(loc) {
                return this;
            }
            normalAtPos(posToCheck, normalOut) {
                throw new Error("Not implemented!");
            }
            pointRandom(randomizer) {
                throw new Error("Not implemented!");
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                throw new Error("Not implemented!");
            }
            toBox(boxOut) { throw new Error("Not implemented!"); }
            // Transformable.
            transform(transformToApply) { return this; }
        }
        GameFramework.ShapeNone = ShapeNone;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
