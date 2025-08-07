"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Movable extends GameFramework.EntityPropertyBase {
            constructor(accelerationPerTickInDirection, speedMax, canAccelerateInDirection) {
                super();
                this._accelerationPerTickInDirection =
                    accelerationPerTickInDirection == null
                        ? (uwpe2, direction) => .1
                        : accelerationPerTickInDirection;
                this._speedMax =
                    (speedMax == null
                        ? (uwpe2) => 3
                        : speedMax);
                this._canAccelerateInDirection = canAccelerateInDirection;
            }
            static default() {
                return new Movable(null, null, null);
            }
            static entitiesFromPlace(place) {
                return place.entitiesByPropertyName(Movable.name);
            }
            static fromAccelerationPerTickAndSpeedMax(accelerationPerTick, speedMax) {
                return new Movable((uwpe, direction) => accelerationPerTick, (uwpe) => speedMax, null);
            }
            static fromAccelerationPerTickInDirectionAndSpeedMax(accelerationPerTickInDirection, speedMax) {
                return new Movable(accelerationPerTickInDirection, (uwpe) => speedMax, null);
            }
            static fromAccelerationPerTickInDirectionSpeedMaxAndCanAccelerateInDirection(accelerationPerTickInDirection, speedMax, canAccelerateInDirection) {
                return new Movable(accelerationPerTickInDirection, (uwpe) => speedMax, canAccelerateInDirection);
            }
            static fromSpeedMax(speedMax) {
                var speedMaxGet = (uwpe) => speedMax;
                return new Movable(speedMaxGet, speedMaxGet, null);
            }
            static of(entity) {
                return entity.propertyByName(Movable.name);
            }
            accelerationPerTickInDirection(uwpe, direction) {
                return this._accelerationPerTickInDirection(uwpe, direction);
            }
            accelerateAndFaceForwardIfAble(uwpe) {
                var forward = GameFramework.Locatable.of(uwpe.entity).loc.orientation.forward;
                this.accelerateInDirectionIfAble(uwpe, forward, true);
            }
            accelerateInDirectionIfAble(uwpe, directionToAccelerateIn, orientationMatchesAcceleration) {
                var entity = uwpe.entity;
                var entityLoc = GameFramework.Locatable.of(entity).loc;
                var canAccelerate = this.canAccelerateInDirection(uwpe, directionToAccelerateIn);
                if (canAccelerate) {
                    var accel = this.accelerationPerTickInDirection(uwpe, directionToAccelerateIn);
                    entityLoc
                        .accel
                        .overwriteWith(directionToAccelerateIn)
                        .multiplyScalar(accel);
                    if (orientationMatchesAcceleration) {
                        entityLoc.orientation.forwardSet(directionToAccelerateIn);
                    }
                }
            }
            canAccelerateInDirection(uwpe, direction) {
                var returnValue = (this._canAccelerateInDirection == null
                    ? true
                    : this._canAccelerateInDirection(uwpe, direction));
                return returnValue;
            }
            moveInDirectionIfAble(uwpe, directionToMoveIn, orientationMatchesMoveDirection) {
                var entity = uwpe.entity;
                var entityLoc = GameFramework.Locatable.of(entity).loc;
                var canMove = this.canAccelerateInDirection(uwpe, directionToMoveIn); // hack
                if (canMove) {
                    var speed = this.accelerationPerTickInDirection(uwpe, directionToMoveIn); // hack
                    var displacement = directionToMoveIn
                        .clone()
                        .multiplyScalar(speed);
                    entityLoc
                        .pos
                        .add(displacement);
                    if (orientationMatchesMoveDirection) {
                        entityLoc.orientation.forwardSet(directionToMoveIn);
                    }
                }
            }
            speedMax(uwpe) {
                return this._speedMax(uwpe);
            }
            // Clonable.
            clone() {
                return new Movable(this._accelerationPerTickInDirection, this._speedMax, this._canAccelerateInDirection);
            }
            overwriteWith(other) {
                this._accelerationPerTickInDirection = other._accelerationPerTickInDirection;
                this._speedMax = other._speedMax;
                this._canAccelerateInDirection = other._canAccelerateInDirection;
                return this;
            }
            // EntityProperty.
            initialize(uwpe) {
                var entity = uwpe.entity;
                var constrainable = GameFramework.Constrainable.of(entity);
                if (constrainable != null) {
                    var constraintMovable = constrainable.constraintByClassName(GameFramework.Constraint_Movable.name);
                    if (constraintMovable == null) {
                        constraintMovable = GameFramework.Constraint_Movable.create();
                        constrainable.constraintAdd(constraintMovable);
                    }
                }
            }
            // Actions.
            static actionAccelerate_Perform(uwpe, direction, orientationMatchesAcceleration) {
                var actor = uwpe.entity;
                var movable = Movable.of(actor);
                movable.accelerateInDirectionIfAble(uwpe, direction, orientationMatchesAcceleration);
            }
            static actionAccelerateAndFaceDown() {
                return GameFramework.Action.fromNameAndPerform("Accelerate and Face Down", uwpe => this.actionAccelerate_Perform(uwpe, GameFramework.Coords.Instances().ZeroOneZero, true // orientationMatchesAcceleration
                ));
            }
            static actionAccelerateAndFaceLeft() {
                return GameFramework.Action.fromNameAndPerform("Accelerate and Face Left", uwpe => this.actionAccelerate_Perform(uwpe, GameFramework.Coords.Instances().MinusOneZeroZero, true // orientationMatchesAcceleration
                ));
            }
            static actionAccelerateAndFaceRight() {
                return GameFramework.Action.fromNameAndPerform("Accelerate and Face Right", uwpe => this.actionAccelerate_Perform(uwpe, GameFramework.Coords.Instances().OneZeroZero, true // orientationMatchesAcceleration
                ));
            }
            static actionAccelerateAndFaceUp() {
                return GameFramework.Action.fromNameAndPerform("Accelerate and Face Up", uwpe => this.actionAccelerate_Perform(uwpe, GameFramework.Coords.Instances().ZeroMinusOneZero, true // orientationMatchesAcceleration
                ));
            }
            static actionAccelerateWithoutFacingDown() {
                return GameFramework.Action.fromNameAndPerform("Accelerate Down", uwpe => this.actionAccelerate_Perform(uwpe, GameFramework.Coords.Instances().ZeroOneZero, false // orientationMatchesAcceleration
                ));
            }
            static actionAccelerateWithoutFacingLeft() {
                return GameFramework.Action.fromNameAndPerform("Accelerate Left", uwpe => this.actionAccelerate_Perform(uwpe, GameFramework.Coords.Instances().MinusOneZeroZero, false // orientationMatchesAcceleration
                ));
            }
            static actionAccelerateWithoutFacingRight() {
                return GameFramework.Action.fromNameAndPerform("Accelerate Right", uwpe => this.actionAccelerate_Perform(uwpe, GameFramework.Coords.Instances().OneZeroZero, false // orientationMatchesAcceleration
                ));
            }
            static actionAccelerateWithoutFacingUp() {
                return GameFramework.Action.fromNameAndPerform("Accelerate Up", uwpe => this.actionAccelerate_Perform(uwpe, GameFramework.Coords.Instances().ZeroMinusOneZero, false // orientationMatchesAcceleration
                ));
            }
            static actionMove_Perform(uwpe, direction, orientationMatchesMoveDirection) {
                var actor = uwpe.entity;
                var movable = Movable.of(actor);
                movable.moveInDirectionIfAble(uwpe, direction, orientationMatchesMoveDirection);
            }
            static actionMoveWithoutFacingDown() {
                return GameFramework.Action.fromNameAndPerform("Move Down", uwpe => this.actionMove_Perform(uwpe, GameFramework.Coords.Instances().ZeroOneZero, false // orientationMatchesMove
                ));
            }
            static actionMoveWithoutFacingUp() {
                return GameFramework.Action.fromNameAndPerform("Accelerate Up", uwpe => this.actionMove_Perform(uwpe, GameFramework.Coords.Instances().ZeroMinusOneZero, false // orientationMatchesMove
                ));
            }
            // Activities.
            static activityDefnWanderBuild() {
                var returnValue = GameFramework.ActivityDefn.fromNameAndPerform("Wander", uwpe => this.activityDefnWander_Perform(uwpe));
                return returnValue;
            }
            static activityDefnWander_Perform(uwpe) {
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
                var actorPos = actorLocatable.pos();
                var targetPos = targetLocatable.pos();
                var displacementFromActorToTarget = targetPos
                    .clone()
                    .subtract(actorPos);
                var directionToTarget = displacementFromActorToTarget.normalize();
                var accelerationPerTick = movable.accelerationPerTickInDirection(uwpe, directionToTarget);
                var speedMax = movable.speedMax(uwpe);
                var distanceToTarget = actorLocatable.approachOtherWithAccelerationAndSpeedMaxAndReturnDistance(targetLocatable, accelerationPerTick, speedMax);
                if (distanceToTarget < speedMax) {
                    activity.targetEntityClear();
                }
            }
        }
        GameFramework.Movable = Movable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
