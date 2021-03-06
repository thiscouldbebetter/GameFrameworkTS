"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Rotation {
            constructor(axis, angleInTurnsRef) {
                this.axis = axis;
                this.angleInTurnsRef = angleInTurnsRef;
            }
            angleInTurns() {
                return this.angleInTurnsRef.value;
            }
            transformCoords(coordsToTransform) {
                // hack - Assume axis is (0, 0, 1).
                var polar = new GameFramework.Polar(0, 0, 0).fromCoords(coordsToTransform);
                polar.azimuthInTurns = GameFramework.NumberHelper.wrapToRangeMinMax(polar.azimuthInTurns + this.angleInTurns(), 0, 1);
                return polar.toCoords(coordsToTransform);
            }
            transformOrientation(orientation) {
                orientation.forwardSet(this.transformCoords(orientation.forward));
            }
        }
        GameFramework.Rotation = Rotation;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
