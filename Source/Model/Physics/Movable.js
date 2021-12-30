"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Movable {
            constructor(accelerationPerTick, speedMax, accelerate) {
                this.accelerationPerTick = accelerationPerTick || .1;
                this.speedMax = speedMax || 3;
                this._accelerate = accelerate || this.accelerateForward;
            }
            static default() {
                return new Movable(null, null, null);
            }
            static fromAccelerationAndSpeedMax(accelerationPerTick, speedMax) {
                return new Movable(accelerationPerTick, speedMax, null);
            }
            static fromSpeedMax(speedMax) {
                return new Movable(speedMax, speedMax, null);
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
                return new Movable(this.accelerationPerTick, this.speedMax, this._accelerate);
            }
            overwriteWith(other) {
                this.accelerationPerTick = other.accelerationPerTick;
                this.speedMax = other.speedMax;
                this._accelerate = other._accelerate;
                return this;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
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
            // Activities.
            static activityDefnWanderBuild() {
                var returnValue = new GameFramework.ActivityDefn("Wander", (uwpe) => {
                    var entityActor = uwpe.entity;
                    var actor = entityActor.actor();
                    var activity = actor.activity;
                    var targetEntity = activity.targetEntity();
                    if (targetEntity == null) {
                        var place = uwpe.place;
                        var randomizer = uwpe.universe.randomizer;
                        var targetPos = GameFramework.Coords.create().randomize(randomizer).multiply(place.size);
                        targetEntity = GameFramework.Locatable.fromPos(targetPos).toEntity();
                        activity.targetEntitySet(targetEntity);
                    }
                    var movable = entityActor.movable();
                    var actorLocatable = entityActor.locatable();
                    var targetLocatable = targetEntity.locatable();
                    var distanceToTarget = actorLocatable.approachOtherWithAccelerationAndSpeedMax(targetLocatable, movable.accelerationPerTick, movable.speedMax);
                    if (distanceToTarget < movable.speedMax) {
                        activity.targetEntityClear();
                    }
                });
                return returnValue;
            }
        }
        GameFramework.Movable = Movable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
