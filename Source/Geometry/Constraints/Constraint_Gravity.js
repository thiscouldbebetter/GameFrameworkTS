"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_Gravity {
            constructor(accelerationPerTick) {
                this.accelerationPerTick = accelerationPerTick;
            }
            constrain(uwpe) {
                var entity = uwpe.entity;
                var loc = entity.locatable().loc;
                loc.accel.add(this.accelerationPerTick);
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Constraint_Gravity = Constraint_Gravity;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
