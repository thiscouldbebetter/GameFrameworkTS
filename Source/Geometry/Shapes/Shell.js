"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Shell {
            constructor(sphereOuter, radiusInner) {
                this.sphereOuter = sphereOuter;
                this.radiusInner = radiusInner;
                this.sphereInner = GameFramework.Sphere.fromCenterAndRadius(this.sphereOuter.center, this.radiusInner);
                this._collider = new GameFramework.ShapeGroupAll([
                    this.sphereOuter,
                    new GameFramework.ShapeInverse(new GameFramework.ShapeContainer(this.sphereInner))
                ]);
            }
            static default() {
                var sphereOuter = GameFramework.Sphere.default();
                return new Shell(sphereOuter, sphereOuter.radius() / 2);
            }
            center() {
                return this.sphereOuter.center;
            }
            // cloneable
            clone() {
                return new Shell(this.sphereOuter.clone(), this.radiusInner);
            }
            containsPoint(pointToCheck) {
                var returnValue = this.sphereOuter.containsPoint(pointToCheck)
                    && (this.sphereInner.containsPoint(pointToCheck) == false);
                return returnValue;
            }
            overwriteWith(other) {
                this.sphereOuter.overwriteWith(other.sphereOuter);
                this.radiusInner = other.radiusInner;
                return this;
            }
            // Equatable
            equals(other) {
                var returnValue = (this.sphereOuter.equals(other.sphereOuter)
                    && this.radiusInner == other.radiusInner);
                return returnValue;
            }
            // ShapeBase.
            collider() {
                return this._collider;
            }
            normalAtPos(posToCheck, normalOut) {
                var displacementFromCenter = normalOut.overwriteWith(posToCheck).subtract(this.center());
                var distanceFromCenter = displacementFromCenter.magnitude();
                var distanceFromSphereOuter = Math.abs(distanceFromCenter - this.sphereOuter.radius());
                var distanceFromSphereInner = Math.abs(distanceFromCenter - this.sphereInner.radius());
                // Note that normalOut == displacementFromCenter.
                if (distanceFromSphereInner < distanceFromSphereOuter) {
                    normalOut.invert();
                }
                normalOut.normalize();
                return normalOut;
            }
            pointRandom(randomizer) {
                return null; // todo
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return surfacePointOut.overwriteWith(posToCheck); // todo
            }
            toBoxAxisAligned(boxOut) {
                return this.sphereOuter.toBoxAxisAligned(boxOut);
            }
            // Transformable.
            transform(transformToApply) {
                this.sphereOuter.transform(transformToApply);
                this.sphereInner.transform(transformToApply);
                return this;
            }
        }
        GameFramework.Shell = Shell;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
