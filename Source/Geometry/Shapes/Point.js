"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Point {
            constructor(pos) {
                this.pos = pos;
            }
            static default() {
                return new Point(GameFramework.Coords.create());
            }
            static fromPos(pos) {
                return new Point(pos);
            }
            containsOther(other) {
                return this.equals(other);
            }
            containsPoint(pointToCheck) {
                return this.pos.equals(pointToCheck);
            }
            pointRandom(randomizer) {
                return this.pos.clone();
            }
            // Clonable.
            clone() {
                return new Point(this.pos.clone());
            }
            overwriteWith(other) {
                this.pos.overwriteWith(other.pos);
                return this;
            }
            // Equatable.
            equals(other) {
                return this.pos.equals(other.pos);
            }
            // ShapeBase.
            collider() { return null; }
            normalAtPos(posToCheck, normalOut) {
                throw new Error("Not implemented!");
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return this.pos.clone();
            }
            toBox(boxOut) {
                boxOut.size.clear(); // Will this work?
                return boxOut;
            }
            // Transformable.
            coordsGroupToTransform() {
                return [this.pos];
            }
            transform(transformToApply) {
                transformToApply.transformCoords(this.pos);
                return this;
            }
        }
        GameFramework.Point = Point;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
