"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_Perspective {
            constructor(focalLength) {
                this.focalLength = focalLength;
            }
            // Clonable.
            clone() {
                return new Transform_Perspective(this.focalLength);
            }
            overwriteWith(other) {
                this.focalLength = other.focalLength;
                return this;
            }
            transform(transformable) {
                return transformable; // todo
            }
            transformCoords(coordsToTransform) {
                var distanceAlongCameraForward = coordsToTransform.z;
                coordsToTransform.multiplyScalar(this.focalLength);
                if (distanceAlongCameraForward != 0) {
                    coordsToTransform.divideScalar(distanceAlongCameraForward);
                }
                coordsToTransform.z = distanceAlongCameraForward;
                return coordsToTransform;
            }
        }
        GameFramework.Transform_Perspective = Transform_Perspective;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
