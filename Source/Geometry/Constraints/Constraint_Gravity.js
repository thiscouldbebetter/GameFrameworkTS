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
                if (loc.pos.z < 0) // hack
                 {
                    loc.accel.add(this.accelerationPerTick);
                }
            }
        }
        GameFramework.Constraint_Gravity = Constraint_Gravity;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
