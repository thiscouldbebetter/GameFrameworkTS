"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Hemispace {
            constructor(plane) {
                this.plane = plane;
                this._displacement = new GameFramework.Coords(0, 0, 0);
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
        }
        GameFramework.Hemispace = Hemispace;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
