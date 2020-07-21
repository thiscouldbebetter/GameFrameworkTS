"use strict";
class Movable {
    constructor(accelerationPerTick, accelerate) {
        this.accelerationPerTick = accelerationPerTick;
        this._accelerate = accelerate || this.accelerateForward;
    }
    accelerate(universe, world, place, entityMovable) {
        this._accelerate(universe, world, place, entityMovable, this.accelerationPerTick);
    }
    accelerateForward(universe, world, place, entityMovable, accelerationPertick) {
        var entityLoc = entityMovable.locatable().loc;
        entityLoc.accel.overwriteWith(entityLoc.orientation.forward).multiplyScalar(entityMovable.movable().accelerationPerTick);
    }
    ;
    // cloneable
    clone() {
        return this;
    }
    ;
}
