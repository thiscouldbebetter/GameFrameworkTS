"use strict";
class Locatable extends EntityProperty {
    constructor(loc) {
        super();
        this.loc = loc || new Disposition(null, null, null);
    }
    approachOtherWithAccelerationAndSpeedMax(locatableToApproach, accelerationPerTick, speedMax // ,distanceMin: number
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
        /*
        if (distanceToTarget <= distanceMin)
        {
            distanceToTarget = 0;
            actorPos.overwriteWith(targetPos);
        }
        else
        {
        */
        actorVel.trimToMagnitudeMax(speedMax);
        // hack
        var ticksToApproach = Math.sqrt(2 * distanceToTarget / accelerationPerTick);
        var targetVelRelative = targetLoc.vel.clone().subtract(actorVel);
        var targetPosRelativeProjected = targetVelRelative.multiplyScalar(ticksToApproach).add(targetPosRelative);
        actorLoc.accel.overwriteWith(targetPosRelativeProjected).normalize().multiplyScalar(accelerationPerTick).clearZ();
        actorOri.forwardSet(actorLoc.accel.clone().normalize());
        //}
        return distanceToTarget;
    }
    distanceFromEntity(entity) {
        return this.loc.pos.clone().subtract(entity.locatable().loc.pos).magnitude();
    }
    entitySpawnWithDefnName(universe, world, place, entitySpawning, entityToSpawnDefnName) {
        var entityDefns = world.defn.entityDefnsByName();
        var entityDefnToSpawn = entityDefns.get(entityToSpawnDefnName);
        var entityToSpawn = entityDefnToSpawn.clone();
        var loc = entityToSpawn.locatable().loc;
        loc.overwriteWith(entitySpawning.locatable().loc);
        loc.accel.clear();
        loc.vel.clear();
        place.entitySpawn(universe, world, entityToSpawn);
        return entityToSpawn;
    }
    // EntityProperty.
    updateForTimerTick(universe, world, place, entity) {
        var loc = this.loc;
        loc.vel.add(loc.accel);
        loc.accel.clear();
        loc.pos.add(loc.vel);
        var spin = loc.spin;
        if (spin.angleInTurns() != 0) {
            loc.spin.transformOrientation(loc.orientation);
        }
    }
    ;
    // Clonable.
    clone() {
        return new Locatable(this.loc.clone());
    }
    ;
}
