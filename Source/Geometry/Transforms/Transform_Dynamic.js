"use strict";
class Transform_Dynamic {
    constructor(transformTransformable) {
        this.transformTransformable = transformTransformable;
    }
    overwriteWith(other) {
        return this;
    }
    transform(transformable) {
        return this.transformTransformable(transformable);
    }
    transformCoords(coordsToTransform) {
        return coordsToTransform; // todo
    }
}
