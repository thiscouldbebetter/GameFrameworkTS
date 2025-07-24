"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Wedge extends GameFramework.ShapeBase {
            constructor(vertex, directionMin, angleSpannedInTurns) {
                super();
                this.vertex = vertex;
                this.directionMin = directionMin;
                this.angleSpannedInTurns = angleSpannedInTurns;
                // Helper variable.
                this.rayDirectionMinAsPolar = new GameFramework.Polar(0, 1, 0);
            }
            static default() {
                return new Wedge(GameFramework.Coords.create(), // vertex
                new GameFramework.Coords(1, 0, 0), // directionMin
                .5 // angleSpannedInTurns
                );
            }
            angleAsRangeExtent() {
                var angleStartInTurns = this.directionMin.headingInTurns();
                return new GameFramework.RangeExtent(angleStartInTurns, angleStartInTurns + this.angleSpannedInTurns);
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
                    this.rayDirectionMinAsPolar = GameFramework.Polar.default();
                    this.rayDirectionMaxAsPolar = GameFramework.Polar.default();
                    this.rayDirectionMin = GameFramework.Coords.create();
                    this.rayDirectionMax = GameFramework.Coords.create();
                    this.downFromVertex = GameFramework.Coords.create();
                    this.directionMinFromVertex = GameFramework.Coords.create();
                    this.directionMaxFromVertex = GameFramework.Coords.create();
                    this.planeForAngleMin = GameFramework.Plane.create();
                    this.planeForAngleMax = GameFramework.Plane.create();
                    this.hemispaces =
                        [
                            GameFramework.Hemispace.fromPlane(this.planeForAngleMin),
                            GameFramework.Hemispace.fromPlane(this.planeForAngleMax)
                        ];
                    this.shapeGroupAll = GameFramework.ShapeGroupAll.fromChildren(this.hemispaces);
                    this.shapeGroupAny = GameFramework.ShapeGroupAny.fromChildren(this.hemispaces);
                }
                var angleInTurnsMin = this.angleInTurnsMin();
                var angleInTurnsMax = this.angleInTurnsMax();
                this.rayDirectionMinAsPolar.azimuthInTurns = angleInTurnsMin;
                this.rayDirectionMinAsPolar.toCoords(this.rayDirectionMin);
                this.rayDirectionMaxAsPolar.azimuthInTurns = angleInTurnsMax;
                this.rayDirectionMaxAsPolar.toCoords(this.rayDirectionMax);
                var down = GameFramework.Coords.Instances().ZeroZeroOne;
                this.downFromVertex
                    .overwriteWith(this.vertex)
                    .add(down);
                this.directionMinFromVertex
                    .overwriteWith(this.vertex)
                    .add(this.rayDirectionMin);
                this.directionMaxFromVertex
                    .overwriteWith(this.vertex)
                    .add(this.rayDirectionMax);
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
            // Equatable.
            equals(other) {
                var returnValue = (this.vertex.equals(other.vertex)
                    && this.directionMin.equals(other.directionMin)
                    && this.angleSpannedInTurns == other.angleSpannedInTurns);
                return returnValue;
            }
            // Transformable.
            transform(transformToApply) {
                transformToApply.transformCoords(this.vertex);
                return this;
            }
        }
        GameFramework.Wedge = Wedge;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
