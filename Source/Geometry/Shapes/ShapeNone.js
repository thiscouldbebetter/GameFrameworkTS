"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeNone {
            static Instance() {
                if (this._instance == null) {
                    this._instance = new ShapeNone();
                }
                return this._instance;
            }
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
            normalAtPos(posToCheck, normalOut) {
                throw new Error("Not implemented!");
            }
            pointRandom(randomizer) {
                throw new Error("Not implemented!");
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                throw new Error("Not implemented!");
            }
            toBoxAxisAligned(boxOut) { throw new Error("Not implemented!"); }
            // Transformable.
            transform(transformToApply) { return this; }
        }
        GameFramework.ShapeNone = ShapeNone;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
