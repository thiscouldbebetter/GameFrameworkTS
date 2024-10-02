"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class BoxRotated {
            constructor(box, angleInTurns) {
                this.box = box;
                this.angleInTurns = angleInTurns;
            }
            sphereSwept() {
                return new GameFramework.Sphere(this.box.center, this.box.sizeHalf().magnitude());
            }
            // ShapeBase.
            collider() { return null; }
            containsPoint(pointToCheck) {
                throw new Error("Not yet implemented!");
            }
            locate(loc) {
                return GameFramework.ShapeHelper.Instance().applyLocationToShapeDefault(loc, this);
            }
            normalAtPos(posToCheck, normalOut) {
                // todo - Adapt or call Box.normalAtPos() instead.
                var plane = new GameFramework.Plane(GameFramework.Coords.create(), 0);
                var polar = new GameFramework.Polar(0, 1, 0);
                var box = this.box;
                var center = box.center;
                var sizeHalf = box.sizeHalf();
                var displacementToSurface = GameFramework.Coords.create();
                var distanceMinSoFar = Number.POSITIVE_INFINITY;
                for (var d = 0; d < 2; d++) {
                    polar.azimuthInTurns = this.angleInTurns + (d * .25);
                    var dimensionHalf = sizeHalf.dimensionGet(d);
                    for (var m = 0; m < 2; m++) {
                        var directionToSurface = polar.toCoords(plane.normal);
                        displacementToSurface.overwriteWith(directionToSurface).multiplyScalar(dimensionHalf);
                        var pointOnSurface = displacementToSurface.add(center);
                        plane.distanceFromOrigin = pointOnSurface.dotProduct(plane.normal);
                        var distanceOfPosToCheckFromPlane = Math.abs(plane.distanceToPointAlongNormal(posToCheck));
                        if (distanceOfPosToCheckFromPlane < distanceMinSoFar) {
                            distanceMinSoFar = distanceOfPosToCheckFromPlane;
                            normalOut.overwriteWith(plane.normal);
                        }
                        polar.azimuthInTurns += .5;
                        polar.azimuthInTurns = GameFramework.NumberHelper.wrapToRangeZeroOne(polar.azimuthInTurns);
                    }
                }
                return normalOut;
            }
            pointRandom(randomizer) {
                return null; // todo
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return surfacePointOut.overwriteWith(posToCheck); // todo
            }
            toBox(boxOut) { throw new Error("Not implemented!"); }
            // Clonable.
            clone() {
                return new BoxRotated(this.box.clone(), this.angleInTurns);
            }
            overwriteWith(other) {
                this.box.overwriteWith(other.box);
                this.angleInTurns = other.angleInTurns;
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
            // Transformable.
            coordsGroupToTranslate() {
                return [this.box.center];
            }
            transform(transformToApply) { throw new Error("Not implemented!"); }
        }
        GameFramework.BoxRotated = BoxRotated;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
