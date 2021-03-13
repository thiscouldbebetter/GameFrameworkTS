"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Sphere {
            constructor(center, radius) {
                this.center = center;
                this.radius = radius;
                // Helper variables.
                this._displacement = new GameFramework.Coords(0, 0, 0);
            }
            containsOther(other) {
                var displacementOfOther = this._displacement.overwriteWith(other.center).subtract(this.center);
                var distanceOfOther = displacementOfOther.magnitude();
                var returnValue = (distanceOfOther + other.radius <= this.radius);
                return returnValue;
            }
            pointRandom() {
                return new GameFramework.Polar(0, this.radius, 0).random(null).toCoords(new GameFramework.Coords(0, 0, 0)).add(this.center);
            }
            // cloneable
            clone() {
                return new Sphere(this.center.clone(), this.radius);
            }
            overwriteWith(other) {
                this.center.overwriteWith(other.center);
                this.radius = other.radius;
                return this;
            }
            // transformable
            coordsGroupToTranslate() {
                return [this.center];
            }
            // ShapeBase.
            locate(loc) {
                return GameFramework.ShapeHelper.Instance().applyLocationToShapeDefault(loc, this);
            }
            normalAtPos(posToCheck, normalOut) {
                return normalOut.overwriteWith(posToCheck).subtract(this.center).normalize();
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return surfacePointOut.overwriteWith(posToCheck); // todo
            }
        }
        GameFramework.Sphere = Sphere;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
