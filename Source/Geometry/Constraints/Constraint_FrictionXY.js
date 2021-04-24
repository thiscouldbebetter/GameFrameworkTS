"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_FrictionXY {
            constructor(target, speedBelowWhichToStop) {
                this.target = target;
                this.speedBelowWhichToStop = speedBelowWhichToStop || 0;
            }
            constrain(universe, world, place, entity) {
                var targetFrictionCoefficient = this.target;
                var entityLoc = entity.locatable().loc;
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
        }
        GameFramework.Constraint_FrictionXY = Constraint_FrictionXY;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
