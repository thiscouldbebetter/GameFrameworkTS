"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Hemispace extends GameFramework.ShapeBase {
            constructor(plane) {
                super();
                this.plane = plane;
                this._displacement = GameFramework.Coords.create();
            }
            static fromPlane(plane) {
                return new Hemispace(plane);
            }
            containsPoint(pointToCheck) {
                var distanceOfPointAbovePlane = pointToCheck.dotProduct(this.plane.normal)
                    - this.plane.distanceFromOrigin;
                var returnValue = (distanceOfPointAbovePlane <= 0);
                return returnValue;
            }
            trimCoords(coordsToTrim) {
                var distanceOfPointAbovePlane = this.plane.distanceToPointAlongNormal(coordsToTrim);
                var areCoordsOutsideHemispace = (distanceOfPointAbovePlane > 0);
                if (areCoordsOutsideHemispace) {
                    var displacementToClosestPointOnPlane = this._displacement.overwriteWith(this.plane.normal).multiplyScalar(0 - distanceOfPointAbovePlane);
                    coordsToTrim.add(displacementToClosestPointOnPlane);
                }
                return coordsToTrim;
            }
            // Clonable.
            clone() {
                return new Hemispace(this.plane.clone());
            }
            overwriteWith(other) {
                this.plane.overwriteWith(other.plane);
                return this;
            }
            // Equatable.
            equals(other) {
                return this.plane.equals(other.plane);
            }
            // ShapeBase.
            normalAtPos(posToCheck, normalOut) {
                return this.plane.normal;
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return surfacePointOut.overwriteWith(this.plane.pointOnPlaneNearestPos(posToCheck));
            }
            // Transformable.
            transform(transformToApply) {
                this.plane.transform(transformToApply);
                return this;
            }
        }
        GameFramework.Hemispace = Hemispace;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
