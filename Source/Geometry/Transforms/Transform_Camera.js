"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_Camera {
            constructor(camera) {
                this._camera = camera;
                this.transformTranslateInvert = new Transform_TranslateInvert(camera.loc.pos);
                this.transformOrientForCamera = new Transform_OrientForCamera(camera.loc.orientation);
                this.transformPerspective = new Transform_Perspective(camera.focalLength);
                this.transformViewCenter = new Transform_Translate(camera.viewSizeHalf);
            }
            clone() { return this; } // todo
            overwriteWith(other) {
                return this; // todo
            }
            transform(transformable) {
                return transformable; // todo
            }
            transformCoords(coordsToTransform) {
                this.transformTranslateInvert.transformCoords(coordsToTransform);
                this.transformOrientForCamera.transformCoords(coordsToTransform);
                this.transformPerspective.transformCoords(coordsToTransform);
                this.transformViewCenter.transformCoords(coordsToTransform);
                return coordsToTransform;
            }
        }
        GameFramework.Transform_Camera = Transform_Camera;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
