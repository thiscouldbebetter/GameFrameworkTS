"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Locatable {
            constructor(loc) {
                this.loc = loc || GameFramework.Disposition.create();
            }
            static create() {
                return new Locatable(null);
            }
            static fromPos(pos) {
                return new Locatable(GameFramework.Disposition.fromPos(pos));
            }
            approachOtherWithAccelerationAndSpeedMaxAndReturnDistance(locatableToApproach, accelerationPerTick, speedMax // ,distanceMin: number
            ) {
                accelerationPerTick = accelerationPerTick || .1;
                speedMax = speedMax || 1;
                //distanceMin = distanceMin || 1;
                var targetLoc = locatableToApproach.loc;
                var targetPos = targetLoc.pos;
                var actorLoc = this.loc;
                var actorPos = actorLoc.pos;
                var actorOri = actorLoc.orientation;
                var actorVel = actorLoc.vel;
                var targetPosRelative = targetPos.clone().subtract(actorPos);
                var distanceToTarget = targetPosRelative.magnitude();
                actorVel.trimToMagnitudeMax(speedMax);
                // hack
                var ticksToApproach = Math.sqrt(2 * distanceToTarget / accelerationPerTick);
                var targetVelRelative = targetLoc.vel.clone().subtract(actorVel);
                var targetPosRelativeProjected = targetVelRelative.multiplyScalar(ticksToApproach).add(targetPosRelative);
                actorLoc.accel.overwriteWith(targetPosRelativeProjected).normalize().multiplyScalar(accelerationPerTick).clearZ();
                actorOri.forwardSet(actorLoc.accel.clone().normalize());
                return distanceToTarget;
            }
            distanceFromEntity(entity) {
                return this.distanceFromPos(entity.locatable().loc.pos);
            }
            distanceFromPos(posToCheck) {
                return this.loc.pos.clone().subtract(posToCheck).magnitude();
            }
            entitySpawnWithDefnName(uwpe, entityToSpawnDefnName) {
                var world = uwpe.world;
                var place = uwpe.place;
                var entitySpawning = uwpe.entity;
                var entityDefnToSpawn = world.defn.entityDefnByName(entityToSpawnDefnName);
                var entityToSpawn = entityDefnToSpawn.clone();
                var loc = entityToSpawn.locatable().loc;
                loc.overwriteWith(entitySpawning.locatable().loc);
                loc.accel.clear();
                loc.vel.clear();
                place.entitySpawn(uwpe);
                return entityToSpawn;
            }
            toEntity() {
                return new GameFramework.Entity(Locatable.name, [this]);
            }
            // EntityProperty.
            updateForTimerTick(uwpe) {
                var loc = this.loc;
                loc.vel.add(loc.accel);
                loc.accel.clear();
                loc.pos.add(loc.vel);
                var spin = loc.spin;
                if (spin.angleInTurns() != 0) {
                    loc.spin.transformOrientation(loc.orientation);
                }
            }
            // Clonable.
            clone() {
                return new Locatable(this.loc.clone());
            }
            overwriteWith(other) {
                this.loc.overwriteWith(other.loc);
                return this;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) {
                this.loc.placeName = uwpe.place.name;
            }
            // Equatable
            equals(other) {
                return this.loc.equals(other.loc);
            }
        }
        GameFramework.Locatable = Locatable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
