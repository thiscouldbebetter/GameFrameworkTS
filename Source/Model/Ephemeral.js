"use strict";
class Ephemeral extends EntityProperty {
    constructor(ticksToLive, expire) {
        super();
        this.ticksToLive = ticksToLive;
        this.expire = expire;
    }
    updateForTimerTick(universe, world, place, entityEphemeral) {
        this.ticksToLive--;
        if (this.ticksToLive <= 0) {
            place.entitiesToRemove.push(entityEphemeral);
            if (this.expire != null) {
                this.expire(universe, world, place, entityEphemeral);
            }
        }
    }
    ;
    // cloneable
    clone() {
        return new Ephemeral(this.ticksToLive, this.expire);
    }
    ;
}
