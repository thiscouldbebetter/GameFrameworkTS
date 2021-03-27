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
            equals(other) {
                return (this.normal.equals(other.normal) && this.distanceFromOrigin == other.distanceFromOrigin);
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
            // ShapeBase.
            locate(loc) { throw ("Not implemented!"); }
            normalAtPos(posToCheck, normalOut) { throw ("Not implemented!"); }
            surfacePointNearPos(posToCheck, surfacePointOut) { throw ("Not implemented!"); }
            toBox(boxOut) { throw ("Not implemented!"); }
        }
        GameFramework.Plane = Plane;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
