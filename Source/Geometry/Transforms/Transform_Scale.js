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
        var otherAsScale = other;
        this.scaleFactors.overwriteWith(otherAsScale.scaleFactors);
        return this;
    }
    transform(transformable) {
        return transformable.transform(this);
    }
    transformCoords(coordsToTransform) {
        return coordsToTransform.multiply(this.scaleFactors);
    }
    ;
}
