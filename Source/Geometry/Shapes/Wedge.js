"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Wedge {
            constructor(vertex, directionMin, angleSpannedInTurns) {
                this.vertex = vertex;
                this.directionMin = directionMin;
                this.angleSpannedInTurns = angleSpannedInTurns;
                // Helper variable.
                this.rayDirectionMinAsPolar = new GameFramework.Polar(0, 1, 0);
            }
            angleInTurnsMax() {
                var returnValue = GameFramework.NumberHelper.wrapToRangeMinMax(this.angleInTurnsMin() + this.angleSpannedInTurns, 0, 1);
                return returnValue;
            }
            angleInTurnsMin() {
                return this.rayDirectionMinAsPolar.fromCoords(this.directionMin).azimuthInTurns;
            }
            collider() {
                if (this._collider == null) {
                    this.rayDirectionMinAsPolar = new GameFramework.Polar(0, 1, 0);
                    this.rayDirectionMaxAsPolar = new GameFramework.Polar(0, 1, 0);
                    this.rayDirectionMin = GameFramework.Coords.create();
                    this.rayDirectionMax = GameFramework.Coords.create();
                    this.downFromVertex = GameFramework.Coords.create();
                    this.directionMinFromVertex = GameFramework.Coords.create();
                    this.directionMaxFromVertex = GameFramework.Coords.create();
                    this.planeForAngleMin = new GameFramework.Plane(GameFramework.Coords.create(), 0);
                    this.planeForAngleMax = new GameFramework.Plane(GameFramework.Coords.create(), 0);
                    this.hemispaces =
                        [
                            new GameFramework.Hemispace(this.planeForAngleMin),
                            new GameFramework.Hemispace(this.planeForAngleMax)
                        ];
                    this.shapeGroupAll = new GameFramework.ShapeGroupAll(this.hemispaces);
                    this.shapeGroupAny = new GameFramework.ShapeGroupAny(this.hemispaces);
                }
                var angleInTurnsMin = this.angleInTurnsMin();
                var angleInTurnsMax = this.angleInTurnsMax();
                this.rayDirectionMinAsPolar.azimuthInTurns = angleInTurnsMin;
                this.rayDirectionMinAsPolar.toCoords(this.rayDirectionMin);
                this.rayDirectionMaxAsPolar.azimuthInTurns = angleInTurnsMax;
                this.rayDirectionMaxAsPolar.toCoords(this.rayDirectionMax);
                var down = GameFramework.Coords.Instances().ZeroZeroOne;
                this.downFromVertex.overwriteWith(this.vertex).add(down);
                this.directionMinFromVertex.overwriteWith(this.vertex).add(this.rayDirectionMin);
                this.directionMaxFromVertex.overwriteWith(this.vertex).add(this.rayDirectionMax);
                this.planeForAngleMin.fromPoints(
                // Order matters!
                this.vertex, this.directionMinFromVertex, this.downFromVertex);
                this.planeForAngleMax.fromPoints(this.vertex, this.downFromVertex, this.directionMaxFromVertex);
                if (this.angleSpannedInTurns < .5) {
                    this._collider = this.shapeGroupAll;
                }
                else {
                    this._collider = this.shapeGroupAny;
                }
                return this._collider;
            }
            // Clonable.
            clone() {
                return new Wedge(this.vertex.clone(), this.directionMin.clone(), this.angleSpannedInTurns);
            }
            overwriteWith(other) {
                this.vertex.overwriteWith(other.vertex);
                this.directionMin.overwriteWith(other.directionMin);
                this.angleSpannedInTurns = other.angleSpannedInTurns;
                return this;
            }
            // ShapeBase.
            locate(loc) {
                this.vertex.overwriteWith(loc.pos);
                return this;
            }
            normalAtPos(posToCheck, normalOut) {
                throw ("Not implemented!");
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                throw ("Not implemented!");
            }
            toBox(boxOut) { throw ("Not implemented!"); }
        }
        GameFramework.Wedge = Wedge;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
