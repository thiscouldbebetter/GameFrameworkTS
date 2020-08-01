"use strict";
class Transform_None {
    constructor() { }
    overwriteWith(other) {
        return this;
    }
    transform(transformable) {
        return transformable;
    }
    transformCoords(coordsToTransform) {
        return coordsToTransform;
    }
}
