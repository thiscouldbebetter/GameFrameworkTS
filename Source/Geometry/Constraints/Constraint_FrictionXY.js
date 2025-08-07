"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_FrictionXY {
            constructor(frictionCofficient, speedBelowWhichToStop) {
                this.frictionCofficient = frictionCofficient;
                this.speedBelowWhichToStop = speedBelowWhichToStop || 0;
            }
            static fromCoefficientAndSpeedBelowWhichToStop(frictionCofficient, speedBelowWhichToStop) {
                return new Constraint_FrictionXY(frictionCofficient, speedBelowWhichToStop);
            }
            constrain(uwpe) {
                var entity = uwpe.entity;
                var targetFrictionCoefficient = this.frictionCofficient;
                var entityLoc = GameFramework.Locatable.of(entity).loc;
                var entityVel = entityLoc.vel;
                var entityVelZSaved = entityVel.z;
                entityVel.z = 0;
                var speed = entityVel.magnitude();
                if (speed < this.speedBelowWhichToStop) {
                    entityVel.clear();
                }
                else {
                    var frictionMagnitude = speed * targetFrictionCoefficient;
                    entityVel.add(entityVel.clone().multiplyScalar(-frictionMagnitude));
                }
                entityVel.z = entityVelZSaved;
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Constraint_FrictionXY = Constraint_FrictionXY;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
