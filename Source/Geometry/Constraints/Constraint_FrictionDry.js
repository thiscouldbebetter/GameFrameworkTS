"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_FrictionDry extends GameFramework.ConstraintBase {
            constructor(frictionCoefficient) {
                super();
                this.frictionCoefficient = frictionCoefficient;
            }
            constrain(uwpe) {
                var entity = uwpe.entity;
                var targetFrictionCoefficient = this.frictionCoefficient;
                var frictionMagnitude = targetFrictionCoefficient;
                var entityLoc = GameFramework.Locatable.of(entity).loc;
                var entityVel = entityLoc.vel;
                var entitySpeed = entityVel.magnitude();
                if (entitySpeed <= frictionMagnitude) {
                    entityVel.clear();
                }
                else {
                    var entityDirection = entityVel.clone().normalize();
                    entityVel.add(entityDirection.multiplyScalar(-frictionMagnitude));
                }
            }
        }
        GameFramework.Constraint_FrictionDry = Constraint_FrictionDry;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
