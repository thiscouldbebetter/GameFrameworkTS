"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Movable {
            constructor(accelerationPerTick, speedMax, accelerate) {
                this.accelerationPerTick = accelerationPerTick;
                this.speedMax = speedMax;
                this._accelerate = accelerate || this.accelerateForward;
            }
            static create() {
                return new Movable(null, null, null);
            }
            static fromAccelerationAndSpeedMax(accelerationPerTick, speedMax) {
                return new Movable(accelerationPerTick, speedMax, null);
            }
            accelerate(uwpe) {
                this._accelerate(uwpe, this.accelerationPerTick);
            }
            accelerateForward(uwpe) {
                var entityMovable = uwpe.entity;
                var entityLoc = entityMovable.locatable().loc;
                entityLoc.accel.overwriteWith(entityLoc.orientation.forward).multiplyScalar(this.accelerationPerTick);
            }
            accelerateInDirection(uwpe, directionToMove) {
                var entity = uwpe.entity;
                var entityLoc = entity.locatable().loc;
                var isEntityStandingOnGround = (entityLoc.pos.z >= 0 && entityLoc.vel.z >= 0);
                if (isEntityStandingOnGround) {
                    entityLoc.orientation.forwardSet(directionToMove);
                    entity.movable().accelerate(uwpe);
                }
            }
            // Clonable.
            clone() {
                return this;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
            // Actions.
            static actionAccelerateDown() {
                return new GameFramework.Action("AccelerateDown", 
                // perform
                (uwpe) => {
                    var actor = uwpe.entity;
                    actor.movable().accelerateInDirection(uwpe, GameFramework.Coords.Instances().ZeroOneZero);
                });
            }
            static actionAccelerateLeft() {
                return new GameFramework.Action("AccelerateLeft", 
                // perform
                (uwpe) => {
                    var actor = uwpe.entity;
                    actor.movable().accelerateInDirection(uwpe, GameFramework.Coords.Instances().MinusOneZeroZero);
                });
            }
            static actionAccelerateRight() {
                return new GameFramework.Action("AccelerateRight", 
                // perform
                (uwpe) => {
                    var actor = uwpe.entity;
                    actor.movable().accelerateInDirection(uwpe, GameFramework.Coords.Instances().OneZeroZero);
                });
            }
            static actionAccelerateUp() {
                return new GameFramework.Action("AccelerateUp", 
                // perform
                (uwpe) => {
                    var actor = uwpe.entity;
                    actor.movable().accelerateInDirection(uwpe, GameFramework.Coords.Instances().ZeroMinusOneZero);
                });
            }
        }
        GameFramework.Movable = Movable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
