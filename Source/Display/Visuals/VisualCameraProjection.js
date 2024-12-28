"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualCameraProjection {
            constructor(cameraGet, child) {
                this.cameraGet = cameraGet;
                this.child = child;
                this._posBeforeProjection = GameFramework.Coords.create();
            }
            reset() {
                this._transformCamera = null;
            }
            transformCamera(uwpe) {
                var camera = this.cameraGet(uwpe);
                if (camera != this._cameraCached) {
                    this._cameraCached = camera;
                    this._transformCamera = new GameFramework.Transform_Camera(camera);
                }
                return this._transformCamera;
            }
            // Visual.
            draw(uwpe, display) {
                var entity = uwpe.entity;
                var entityPos = GameFramework.Locatable.of(entity).loc.pos;
                var posBeforeProjection = this._posBeforeProjection.overwriteWith(entityPos);
                var transform = this.transformCamera(uwpe);
                transform.transformCoords(entityPos);
                this.child.draw(uwpe, display);
                entityPos.overwriteWith(posBeforeProjection);
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
            // Transformable.
            transform(transformToApply) {
                return this; // todo
            }
        }
        GameFramework.VisualCameraProjection = VisualCameraProjection;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
