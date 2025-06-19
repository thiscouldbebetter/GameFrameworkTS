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
                this._centerAsArray = [this.center];
                this._displacement = GameFramework.Coords.create();
                this._pointRandom = GameFramework.Coords.create();
            }
            static default() {
                return new Sphere(GameFramework.Coords.create(), 1);
            }
            static fromCenterAndRadius(center, radius) {
                return new Sphere(center, radius);
            }
            static fromRadius(radius) {
                return new Sphere(GameFramework.Coords.create(), radius);
            }
            static fromRadiusAndCenter(radius, center) {
                return new Sphere(center, radius);
            }
            containsOther(other) {
                var displacementOfOther = this._displacement.overwriteWith(other.center).subtract(this.center);
                var distanceOfOther = displacementOfOther.magnitude();
                var returnValue = (distanceOfOther + other.radius <= this.radius);
                return returnValue;
            }
            containsPoint(pointToCheck) {
                var displacement = this._displacement
                    .overwriteWith(pointToCheck)
                    .subtract(this.center);
                var distanceFromCenter = displacement.magnitude();
                var containsPoint = (distanceFromCenter < this.radius);
                return containsPoint;
            }
            pointRandom(randomizer) {
                // todo
                // This implementation favors points near the center.
                var polar = GameFramework.Polar.fromRadius(this.radius);
                var returnValue = polar
                    .random(null)
                    .toCoords(this._pointRandom)
                    .add(this.center);
                return returnValue;
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
            // Equatable.
            equals(other) {
                return (this.center.equals(other.center) && this.radius == other.radius);
            }
            // ShapeBase.
            collider() { return null; }
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
                if (boxOut == null) {
                    boxOut = GameFramework.Box.create();
                }
                var diameter = this.radius * 2;
                boxOut.size.overwriteWithDimensions(diameter, diameter, diameter);
                return boxOut;
            }
            // Transformable.
            coordsGroupToTranslate() {
                return this._centerAsArray;
            }
            transform(transformToApply) {
                throw new Error("Not implemented!");
            }
        }
        GameFramework.Sphere = Sphere;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
