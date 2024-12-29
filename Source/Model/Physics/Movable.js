"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Movable {
            constructor(accelerationPerTick, speedMax, canAccelerate) {
                this._accelerationPerTick =
                    accelerationPerTick == null
                        ? (uwpe2) => .1
                        : accelerationPerTick;
                this._speedMax =
                    (speedMax == null
                        ? (uwpe2) => 3
                        : speedMax);
                this._canAccelerate = canAccelerate;
            }
            static default() {
                return new Movable(null, null, null);
            }
            static entitiesFromPlace(place) {
                return place.entitiesByPropertyName(Movable.name);
            }
            static fromAccelerationAndSpeedMax(accelerationPerTick, speedMax) {
                return new Movable((uwpe) => accelerationPerTick, (uwpe) => speedMax, null);
            }
            static fromSpeedMax(speedMax) {
                var speedMaxGet = (uwpe) => speedMax;
                return new Movable(speedMaxGet, speedMaxGet, null);
            }
            static of(entity) {
                return entity.propertyByName(Movable.name);
            }
            accelerationPerTick(uwpe) {
                return this._accelerationPerTick(uwpe);
            }
            accelerateForward(uwpe) {
                var entityMovable = uwpe.entity;
                var entityLoc = GameFramework.Locatable.of(entityMovable).loc;
                var forward = entityLoc.orientation.forward;
                var accel = this.accelerationPerTick(uwpe);
                entityLoc.accel.overwriteWith(forward).multiplyScalar(accel);
            }
            accelerateForwardIfAble(uwpe) {
                if (this.canAccelerate(uwpe)) {
                    this.accelerateForward(uwpe);
                }
            }
            accelerateInDirectionIfAble(uwpe, directionToMove) {
                var entity = uwpe.entity;
                var entityLoc = GameFramework.Locatable.of(entity).loc;
                var canAccelerate = this.canAccelerate(uwpe);
                if (canAccelerate) {
                    entityLoc.orientation.forwardSet(directionToMove);
                    Movable.of(entity).accelerateForward(uwpe);
                }
            }
            canAccelerate(uwpe) {
                var returnValue = (this._canAccelerate == null
                    ? true
                    : this._canAccelerate(uwpe));
                return returnValue;
            }
            speedMax(uwpe) {
                return this._speedMax(uwpe);
            }
            toConstraint() {
                return new GameFramework.Constraint_SpeedMaxXY(this.speedMax(null));
            }
            // Clonable.
            clone() {
                return new Movable(this._accelerationPerTick, this._speedMax, this._canAccelerate);
            }
            overwriteWith(other) {
                this.accelerationPerTick = other.accelerationPerTick;
                this.speedMax = other.speedMax;
                this._canAccelerate = other._canAccelerate;
                return this;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Movable.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
            // Actions.
            static actionAccelerateDown() {
                return new GameFramework.Action("AccelerateDown", 
                // perform
                (uwpe) => {
                    var actor = uwpe.entity;
                    var movable = Movable.of(actor);
                    var direction = GameFramework.Coords.Instances().ZeroOneZero;
                    movable.accelerateInDirectionIfAble(uwpe, direction);
                });
            }
            static actionAccelerateLeft() {
                return new GameFramework.Action("AccelerateLeft", 
                // perform
                (uwpe) => {
                    var actor = uwpe.entity;
                    var movable = Movable.of(actor);
                    var direction = GameFramework.Coords.Instances().MinusOneZeroZero;
                    movable.accelerateInDirectionIfAble(uwpe, direction);
                });
            }
            static actionAccelerateRight() {
                return new GameFramework.Action("AccelerateRight", 
                // perform
                (uwpe) => {
                    var actor = uwpe.entity;
                    var movable = Movable.of(actor);
                    var direction = GameFramework.Coords.Instances().OneZeroZero;
                    movable.accelerateInDirectionIfAble(uwpe, direction);
                });
            }
            static actionAccelerateUp() {
                return new GameFramework.Action("AccelerateUp", 
                // perform
                (uwpe) => {
                    var actor = uwpe.entity;
                    var movable = Movable.of(actor);
                    var direction = GameFramework.Coords.Instances().ZeroMinusOneZero;
                    movable.accelerateInDirectionIfAble(uwpe, direction);
                });
            }
            // Activities.
            static activityDefnWanderBuild() {
                var returnValue = new GameFramework.ActivityDefn("Wander", (uwpe) => {
                    var entityActor = uwpe.entity;
                    var actor = GameFramework.Actor.of(entityActor);
                    var activity = actor.activity;
                    var targetEntity = activity.targetEntity();
                    if (targetEntity == null) {
                        var place = uwpe.place;
                        var randomizer = uwpe.universe.randomizer;
                        var targetPos = GameFramework.Coords.create().randomize(randomizer).multiply(place.size());
                        targetEntity = GameFramework.Locatable.fromPos(targetPos).toEntity();
                        activity.targetEntitySet(targetEntity);
                    }
                    var movable = Movable.of(entityActor);
                    var actorLocatable = GameFramework.Locatable.of(entityActor);
                    var targetLocatable = GameFramework.Locatable.of(targetEntity);
                    var accelerationPerTick = movable.accelerationPerTick(uwpe);
                    var speedMax = movable.speedMax(uwpe);
                    var distanceToTarget = actorLocatable.approachOtherWithAccelerationAndSpeedMaxAndReturnDistance(targetLocatable, accelerationPerTick, speedMax);
                    if (distanceToTarget < speedMax) {
                        activity.targetEntityClear();
                    }
                });
                return returnValue;
            }
        }
        GameFramework.Movable = Movable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
