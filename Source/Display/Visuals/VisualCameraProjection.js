"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualCameraProjection {
            constructor(child, cameraFactory) {
                this.child = child;
                this.cameraFactory = cameraFactory;
                // Helper variables.
                this._posSaved = GameFramework.Coords.create();
            }
            draw(universe, world, place, entity, display) {
                var drawablePos = entity.locatable().loc.pos;
                this._posSaved.overwriteWith(drawablePos);
                var camera = this.cameraFactory(universe, world);
                camera.coordsTransformWorldToView(drawablePos);
                var isEntityInView = false;
                var boundable = entity.boundable();
                if (boundable == null) {
                    isEntityInView = true;
                }
                else {
                    var drawableCollider = boundable.bounds;
                    var cameraViewCollider = camera.viewCollider;
                    var collisionHelper = universe.collisionHelper;
                    isEntityInView = collisionHelper.doCollidersCollide(drawableCollider, cameraViewCollider);
                }
                if (isEntityInView) {
                    camera.entitiesInView.push(entity);
                }
                drawablePos.overwriteWith(this._posSaved);
            }
            ;
            drawImmediate(universe, world, place, entity, display) {
                var drawablePos = entity.locatable().loc.pos;
                this._posSaved.overwriteWith(drawablePos);
                var camera = this.cameraFactory(universe, world);
                camera.coordsTransformWorldToView(drawablePos);
                this.child.draw(universe, world, place, entity, display);
                drawablePos.overwriteWith(this._posSaved);
            }
            ;
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
