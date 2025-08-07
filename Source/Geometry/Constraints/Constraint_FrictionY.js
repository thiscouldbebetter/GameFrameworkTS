"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_FrictionY {
            constructor(frictionCofficient) {
                this.frictionCofficient = frictionCofficient;
            }
            static fromCoefficient(frictionCofficient) {
                return new Constraint_FrictionY(frictionCofficient);
            }
            constrain(uwpe) {
                var disp = GameFramework.Locatable.of(uwpe.entity).loc;
                var vel = disp.vel;
                var accel = disp.accel;
                var fraction = 0.1;
                var accelerationToApply = 0 - vel.y * fraction;
                accel.y += accelerationToApply;
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Constraint_FrictionY = Constraint_FrictionY;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
