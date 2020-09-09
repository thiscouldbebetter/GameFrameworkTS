"use strict";
class Weapon {
    constructor(ticksToRecharge, entityProjectile) {
        this.ticksToRecharge = ticksToRecharge;
        this.entityProjectile = entityProjectile;
        var speedMax = this.entityProjectile.movable().speedMax;
        var ticksToLive = this.entityProjectile.ephemeral().ticksToLive;
        this.range = speedMax * ticksToLive;
        this.tickLastFired = 0 - this.ticksToRecharge;
    }
}
