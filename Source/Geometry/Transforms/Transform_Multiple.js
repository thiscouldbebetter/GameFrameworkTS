"use strict";
class Transform_Multiple {
    constructor(transforms) {
        this.transforms = transforms;
    }
    overwriteWith(other) {
        return this; // todo
    }
    transform(transformable) {
        for (var i = 0; i < this.transforms.length; i++) {
            var transform = this.transforms[i];
            //transform.transform(transformable);
            transformable.transform(transform);
        }
        return transformable;
    }
    transformCoords(coordsToTransform) {
        for (var i = 0; i < this.transforms.length; i++) {
            var transform = this.transforms[i];
            transform.transformCoords(coordsToTransform);
        }
        return coordsToTransform;
    }
}
