"use strict";
class Transform_Orient {
    constructor(orientation) {
        this.orientation = orientation;
    }
    overwriteWith(other) {
        return this; // todo
    }
    transform(transformable) {
        return transformable.transform(this);
    }
    ;
    transformCoords(coordsToTransform) {
        // todo
        // Compare to Transform_OrientRDF.transformCoords().
        // Should this be doing the same thing?
        coordsToTransform.overwriteWithDimensions(this.orientation.forward.dotProduct(coordsToTransform), this.orientation.right.dotProduct(coordsToTransform), this.orientation.down.dotProduct(coordsToTransform));
        return coordsToTransform;
    }
    ;
}
