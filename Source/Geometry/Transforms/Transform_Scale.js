"use strict";
class Transform_Scale {
    constructor(scaleFactors) {
        this.scaleFactors = scaleFactors;
    }
    static fromScalar(scalar) {
        return new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(scalar));
    }
    ;
    overwriteWith(other) {
        return this; // todo
    }
    transform(transformable) {
        return transformable; // todo
    }
    transformCoords(coordsToTransform) {
        return coordsToTransform.multiply(this.scaleFactors);
    }
    ;
}
