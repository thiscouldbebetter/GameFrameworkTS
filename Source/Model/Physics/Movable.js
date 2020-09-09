"use strict";
class Movable extends EntityProperty {
    constructor(accelerationPerTick, speedMax, accelerate) {
        super();
        this.accelerationPerTick = accelerationPerTick;
        this.speedMax = speedMax;
        this._accelerate = accelerate || this.accelerateForward;
    }
    accelerate(universe, world, place, entityMovable) {
        this._accelerate(universe, world, place, entityMovable, this.accelerationPerTick);
    }
    accelerateForward(universe, world, place, entityMovable, accelerationPerTick) {
        var entityLoc = entityMovable.locatable().loc;
        entityLoc.accel.overwriteWith(entityLoc.orientation.forward).multiplyScalar(entityMovable.movable().accelerationPerTick);
    }
    ;
    accelerateInDirection(universe, world, place, entity, directionToMove) {
        var entityLoc = entity.locatable().loc;
        var isEntityStandingOnGround = (entityLoc.pos.z >= 0 && entityLoc.vel.z >= 0);
        if (isEntityStandingOnGround) {
            entityLoc.orientation.forwardSet(directionToMove);
            entity.movable().accelerate(universe, world, place, entity);
        }
    }
    // cloneable
    clone() {
        return this;
    }
    ;
}
