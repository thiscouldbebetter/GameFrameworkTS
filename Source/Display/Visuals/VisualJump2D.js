"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualJump2D {
            constructor(visualJumper, visualShadow, cameraFactory) {
                this.visualJumper = visualJumper;
                this.visualShadow = visualShadow;
                this._posSaved = GameFramework.Coords.create();
            }
            // Transformable.
            transform(transformToApply) {
                transformToApply.transform(this.visualJumper);
                transformToApply.transform(this.visualShadow);
                return this;
            }
            // Visual.
            draw(uwpe, display) {
                var world = uwpe.world;
                var entity = uwpe.entity;
                var entityPos = entity.locatable().loc.pos;
                var entityPosZ = entityPos.z;
                var camera = world.placeCurrent.camera().camera(); // hack
                entityPosZ -= camera.focalLength;
                var height = 0 - entityPosZ;
                if (height <= 0) {
                    this.visualJumper.draw(uwpe, display);
                }
                else {
                    this.visualShadow.draw(uwpe, display);
                    this._posSaved.overwriteWith(entityPos);
                    entityPos.y -= height;
                    this.visualJumper.draw(uwpe, display);
                    entityPos.overwriteWith(this._posSaved);
                }
            }
            // Cloneable.
            clone() {
                return new VisualJump2D(this.visualJumper.clone(), this.visualShadow.clone(), this.cameraFactory);
            }
            overwriteWith(other) {
                this.visualJumper.overwriteWith(other.visualJumper);
                this.visualShadow.overwriteWith(other.visualShadow);
                return this;
            }
        }
        GameFramework.VisualJump2D = VisualJump2D;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
