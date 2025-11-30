"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualTransformEntityPos extends GameFramework.VisualBase {
            constructor(transformToApply, child) {
                super();
                this.transformToApply = transformToApply;
                this.child = child;
                this._entityPosSaved = Coords.create();
            }
            // Cloneable.
            clone() {
                return new VisualTransformEntityPos(this.transformToApply, this.child.clone());
            }
            overwriteWith(other) {
                this.child.overwriteWith(other.child);
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                transformToApply.transform(this.child);
                return this;
            }
            // Visual.
            initialize(uwpe) {
                this.child.initialize(uwpe);
            }
            initializeIsComplete(uwpe) {
                return this.child.initializeIsComplete(uwpe);
            }
            draw(uwpe, display) {
                var entityPos = GameFramework.Locatable.of(uwpe.entity).loc.pos;
                this._entityPosSaved.overwriteWith(entityPos);
                this.transformToApply.transformCoords(entityPos);
                this.child.draw(uwpe, display);
                entityPos.overwriteWith(this._entityPosSaved);
            }
        }
        GameFramework.VisualTransformEntityPos = VisualTransformEntityPos;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
