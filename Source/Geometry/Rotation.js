"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Rotation {
            constructor(axis, angleInTurnsAsReference) {
                this.axis = axis;
                this.angleInTurnsAsReference = angleInTurnsAsReference;
            }
            static fromAxisAndAngleInTurns(axis, angleInTurns) {
                return new Rotation(axis, new GameFramework.Reference(angleInTurns));
            }
            angleInTurns() {
                return this.angleInTurnsAsReference.value;
            }
            angleInTurnsSet(value) {
                this.angleInTurnsAsReference.set(value);
                return this;
            }
            transformCoords(coordsToTransform) {
                // hack - Assume axis is (0, 0, 1).
                var polar = GameFramework.Polar.create().fromCoords(coordsToTransform);
                polar.azimuthInTurns = GameFramework.NumberHelper.wrapToRangeMinMax(polar.azimuthInTurns + this.angleInTurns(), 0, 1);
                return polar.overwriteCoords(coordsToTransform);
            }
            transformOrientation(orientation) {
                return orientation.forwardSet(this.transformCoords(orientation.forward));
            }
            // Clonable.
            clone() {
                return new Rotation(this.axis.clone(), this.angleInTurnsAsReference.clone());
            }
            overwriteWith(other) {
                this.axis.overwriteWith(other.axis);
                this.angleInTurnsAsReference.overwriteWith(other.angleInTurnsAsReference);
                return this;
            }
        }
        GameFramework.Rotation = Rotation;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
