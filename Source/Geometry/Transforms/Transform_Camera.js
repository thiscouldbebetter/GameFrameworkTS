"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_Camera {
            constructor(camera) {
                this.camera = camera;
                this.transformTranslateInvert = new GameFramework.Transform_TranslateInvert(this.camera.loc.pos);
                this.transformOrientForCamera = new GameFramework.Transform_OrientForCamera(this.camera.loc.orientation);
                this.transformPerspective = new GameFramework.Transform_Perspective(this.camera.focalLength);
                this.transformViewCenter = new GameFramework.Transform_Translate(this.camera.viewSizeHalf);
            }
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
