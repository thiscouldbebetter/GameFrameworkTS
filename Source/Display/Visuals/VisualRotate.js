"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualRotate {
            constructor(child, rotationInTurnsGet) {
                this.child = child;
                this._rotationInTurnsGet = rotationInTurnsGet;
            }
            static fromChild(child) {
                return new VisualRotate(child, null);
            }
            rotationInTurnsGet(uwpe) {
                var rotationInTurns = 0;
                if (this._rotationInTurnsGet == null) {
                    var entity = uwpe.entity;
                    var entityLoc = entity.locatable().loc;
                    rotationInTurns = entityLoc.orientation.forward.headingInTurns();
                }
                else {
                    rotationInTurns = this._rotationInTurnsGet(uwpe);
                }
                return rotationInTurns;
            }
            // Visual.
            draw(uwpe, display) {
                var entity = uwpe.entity;
                var entityLoc = entity.locatable().loc;
                var rotationInTurns = this.rotationInTurnsGet(uwpe);
                display.stateSave();
                display.rotateTurnsAroundCenter(rotationInTurns, entityLoc.pos);
                this.child.draw(uwpe, display);
                display.stateRestore();
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
        GameFramework.VisualRotate = VisualRotate;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
