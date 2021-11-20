"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_OrientForCamera {
            constructor(orientation) {
                this.orientation = orientation;
            }
            clone() {
                return new Transform_OrientForCamera(this.orientation.clone());
            }
            overwriteWith(other) {
                this.orientation.overwriteWith(other.orientation);
                return this; // todo
            }
            transform(transformable) {
                return transformable; // todo
            }
            transformCoords(coordsToTransform) {
                coordsToTransform.overwriteWithDimensions(this.orientation.right.dotProduct(coordsToTransform), this.orientation.down.dotProduct(coordsToTransform), this.orientation.forward.dotProduct(coordsToTransform));
                return coordsToTransform;
            }
        }
        GameFramework.Transform_OrientForCamera = Transform_OrientForCamera;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
