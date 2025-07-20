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
            accelerateAndFaceForwardIfAble(uwpe) {
                var forward = GameFramework.Locatable.of(uwpe.entity).loc.orientation.forward;
                this.accelerateInDirectionIfAble(uwpe, forward, true);
            }
            accelerateInDirectionIfAble(uwpe, directionToAccelerateIn, orientationMatchesAcceleration) {
                var entity = uwpe.entity;
                var entityLoc = GameFramework.Locatable.of(entity).loc;
                var canAccelerate = this.canAccelerate(uwpe);
                if (canAccelerate) {
                    var accel = this.accelerationPerTick(uwpe);
                    entityLoc
                        .accel
                        .overwriteWith(directionToAccelerateIn)
                        .multiplyScalar(accel);
                    if (orientationMatchesAcceleration) {
                        entityLoc.orientation.forwardSet(directionToAccelerateIn);
                    }
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
                var accelerationPerTick = movable.accelerationPerTick(uwpe);
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
