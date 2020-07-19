"use strict";
class Rotation {
    constructor(axis, angleInTurnsRef) {
        this.axis = axis;
        this.angleInTurnsRef = angleInTurnsRef;
    }
    angleInTurns() {
        return this.angleInTurnsRef.value;
    }
    ;
    transformCoords(coordsToTransform) {
        // hack - Assume axis is (0, 0, 1).
        var polar = new Polar(0, 0, 0).fromCoords(coordsToTransform);
        polar.azimuthInTurns = NumberHelper.wrapToRangeMinMax(polar.azimuthInTurns + this.angleInTurns(), 0, 1);
        return polar.toCoords(coordsToTransform);
    }
    ;
    transformOrientation(orientation) {
        orientation.forwardSet(this.transformCoords(orientation.forward));
    }
    ;
}
