"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Plane {
            constructor(normal, distanceFromOrigin) {
                this.normal = normal;
                this.distanceFromOrigin = distanceFromOrigin;
                this._displacementFromPoint0To2 = GameFramework.Coords.create();
            }
            distanceToPointAlongNormal(point) {
                return point.dotProduct(this.normal) - this.distanceFromOrigin;
            }
            fromPoints(point0, point1, point2) {
                this.normal.overwriteWith(point1).subtract(point0).crossProduct(this._displacementFromPoint0To2.overwriteWith(point2).subtract(point0)).normalize();
                this.distanceFromOrigin = point0.dotProduct(this.normal);
                return this;
            }
            pointClosestToOrigin(point) {
                return point.overwriteWith(this.normal).multiplyScalar(this.distanceFromOrigin);
            }
            pointOnPlaneNearestPos(posToCheck) {
                var distanceToPoint = this.distanceToPointAlongNormal(posToCheck);
                return this.normal.clone().multiplyScalar(distanceToPoint).invert().add(posToCheck);
            }
            // Clonable.
            clone() {
                return new Plane(this.normal.clone(), this.distanceFromOrigin);
            }
            overwriteWith(other) {
                this.normal.overwriteWith(other.normal);
                this.distanceFromOrigin = other.distanceFromOrigin;
                return this;
            }
            pointRandom(randomizer) {
                return null; // todo
            }
            // Equatable
            equals(other) {
                var returnValue = (this.normal.equals(other.normal)
                    && this.distanceFromOrigin == other.distanceFromOrigin);
                return returnValue;
            }
            // ShapeBase.
            collider() { return null; }
            locate(loc) { throw new Error("Not implemented!"); }
            normalAtPos(posToCheck, normalOut) { throw new Error("Not implemented!"); }
            surfacePointNearPos(posToCheck, surfacePointOut) { throw new Error("Not implemented!"); }
            toBox(boxOut) { throw new Error("Not implemented!"); }
            // Transformable.
            transform(transformToApply) {
                throw new Error("Not implemented!");
            }
        }
        GameFramework.Plane = Plane;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
