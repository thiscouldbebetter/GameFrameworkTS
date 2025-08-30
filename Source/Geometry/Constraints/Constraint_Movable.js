"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_Movable extends GameFramework.ConstraintBase {
            static create() {
                return new Constraint_Movable().nameSet(Constraint_Movable.name);
            }
            constrain(uwpe) {
                var entity = uwpe.entity;
                var entityLoc = GameFramework.Locatable.of(entity).loc;
                var entityVel = entityLoc.vel;
                var speed = entityVel.magnitude();
                var entityMovable = GameFramework.Movable.of(entity);
                var speedMax = entityMovable.speedMax(uwpe);
                if (speed > speedMax) {
                    entityVel
                        .normalize()
                        .multiplyScalar(speedMax);
                }
            }
        }
        GameFramework.Constraint_Movable = Constraint_Movable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
