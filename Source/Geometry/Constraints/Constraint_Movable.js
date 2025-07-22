"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_Movable {
            static create() {
                return new Constraint_Movable();
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
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Constraint_Movable = Constraint_Movable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
