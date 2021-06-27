"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_SpeedMaxXY {
            constructor(targetSpeedMax) {
                this.targetSpeedMax = targetSpeedMax;
            }
            constrain(uwpe) {
                var targetSpeedMax = this.targetSpeedMax;
                var entityLoc = uwpe.entity.locatable().loc;
                var entityVel = entityLoc.vel;
                var zSaved = entityVel.z;
                entityVel.z = 0;
                var speed = entityVel.magnitude();
                if (speed > targetSpeedMax) {
                    entityVel.normalize().multiplyScalar(targetSpeedMax);
                }
                entityVel.z = zSaved;
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Constraint_SpeedMaxXY = Constraint_SpeedMaxXY;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
