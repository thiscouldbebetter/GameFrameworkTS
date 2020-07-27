"use strict";
class Locatable {
    constructor(loc) {
        this.loc = loc || new Disposition(null, null, null);
    }
    distanceFromEntity(entity) {
        return this.loc.pos.clone().subtract(entity.locatable().loc.pos).magnitude();
    }
    entitySpawnWithDefnName(universe, world, place, entitySpawning, entityToSpawnDefnName) {
        var entityDefns = world.defn.entityDefnsByName();
        var entityDefnToSpawn = entityDefns.get(entityToSpawnDefnName);
        var entityToSpawn = entityDefnToSpawn.clone();
        entityToSpawn.locatable().loc.overwriteWith(entitySpawning.locatable().loc);
        entityToSpawn.locatable().loc.vel.clear();
        place.entitySpawn(universe, world, entityToSpawn);
        return entityToSpawn;
    }
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
    // cloneable
    clone() {
        return new Locatable(this.loc.clone());
    }
    ;
}
