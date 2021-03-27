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
                this._displacement = GameFramework.Coords.create();
            }
            containsOther(other) {
                var displacementOfOther = this._displacement.overwriteWith(other.center).subtract(this.center);
                var distanceOfOther = displacementOfOther.magnitude();
                var returnValue = (distanceOfOther + other.radius <= this.radius);
                return returnValue;
            }
            pointRandom() {
                return new GameFramework.Polar(0, this.radius, 0).random(null).toCoords(GameFramework.Coords.create()).add(this.center);
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
                this.center.overwriteWith(loc.pos);
                return this;
            }
            normalAtPos(posToCheck, normalOut) {
                return normalOut.overwriteWith(posToCheck).subtract(this.center).normalize();
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return surfacePointOut.overwriteWith(posToCheck); // todo
            }
            toBox(boxOut) {
                var diameter = this.radius * 2;
                boxOut.size.overwriteWithDimensions(diameter, diameter, diameter);
                return boxOut;
            }
        }
        GameFramework.Sphere = Sphere;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
