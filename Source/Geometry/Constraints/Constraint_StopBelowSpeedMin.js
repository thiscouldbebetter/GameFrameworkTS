"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_StopBelowSpeedMin {
            constructor(target) {
                this.target = target;
            }
            constrain(uwpe) {
                var targetSpeedMin = this.target;
                var entityLoc = GameFramework.Locatable.of(uwpe.entity).loc;
                var entityVel = entityLoc.vel;
                var speed = entityVel.magnitude();
                if (speed < targetSpeedMin) {
                    entityVel.clear();
                }
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Constraint_StopBelowSpeedMin = Constraint_StopBelowSpeedMin;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
