"use strict";
class Transform_OrientForCamera {
    constructor(orientation) {
        this.orientation = orientation;
    }
    overwriteWith(other) {
        return this; // todo
    }
    transform(transformable) {
        return transformable; // todo
    }
    transformCoords(coordsToTransform) {
        coordsToTransform.overwriteWithDimensions(this.orientation.right.dotProduct(coordsToTransform), this.orientation.down.dotProduct(coordsToTransform), this.orientation.forward.dotProduct(coordsToTransform));
        return coordsToTransform;
    }
    ;
}
