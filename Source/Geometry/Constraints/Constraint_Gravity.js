"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_Gravity extends GameFramework.ConstraintBase {
            constructor(accelerationPerTick) {
                super();
                this.accelerationPerTick = accelerationPerTick;
            }
            static fromAccelerationPerTick(accelerationPerTick) {
                return new Constraint_Gravity(accelerationPerTick);
            }
            constrain(uwpe) {
                var entity = uwpe.entity;
                var loc = GameFramework.Locatable.of(entity).loc;
                loc.accel.add(this.accelerationPerTick);
            }
        }
        GameFramework.Constraint_Gravity = Constraint_Gravity;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
