"use strict";
class Transform_Rotate2D {
    constructor(turnsToRotate) {
        this.turnsToRotate = turnsToRotate;
        this._polar = new Polar(0, 1, 0);
    }
    overwriteWith(other) {
        return this; // todo
    }
    transform(transformable) {
        return transformable; // todo
    }
    transformCoords(coordsToTransform) {
        this._polar.fromCoords(coordsToTransform).addToAzimuthInTurns(this.turnsToRotate).wrap().toCoords(coordsToTransform);
        return coordsToTransform;
    }
    ;
}
