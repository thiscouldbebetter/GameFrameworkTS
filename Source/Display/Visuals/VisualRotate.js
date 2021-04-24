"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualRotate {
            constructor(child) {
                this.child = child;
            }
            draw(universe, world, place, entity, display) {
                display.stateSave();
                var entityLoc = entity.locatable().loc;
                var rotationInTurns = entityLoc.orientation.forward.headingInTurns();
                display.rotateTurnsAroundCenter(rotationInTurns, entityLoc.pos);
                this.child.draw(universe, world, place, entity, display);
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
