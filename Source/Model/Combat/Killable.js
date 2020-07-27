"use strict";
class Killable {
    constructor(integrityMax, damageApply, die) {
        this.integrityMax = integrityMax;
        this._damageApply = damageApply;
        this._die = die;
        this.integrity = this.integrityMax;
    }
    damageApply(universe, world, place, entityDamager, entityKillable, damageToApply) {
        var damageApplied;
        if (this._damageApply == null) {
            damageApplied = (damageToApply == null ? entityDamager.damager().damagePerHit : damageToApply);
            entityKillable.killable().integrityAdd(0 - damageApplied);
        }
        else {
            damageApplied = this._damageApply(universe, world, place, entityDamager, entityKillable, damageToApply);
        }
        return damageApplied;
    }
    ;
    die(u, w, p, e) {
        if (this._die != null) {
            this._die(u, w, p, e);
        }
    }
    integrityAdd(amountToAdd) {
        this.integrity += amountToAdd;
        this.integrity = NumberHelper.trimToRangeMax(this.integrity, this.integrityMax);
    }
    ;
    isAlive() {
        return (this.integrity > 0);
    }
    ;
    updateForTimerTick(universe, world, place, entityKillable) {
        if (this.isAlive() == false) {
            place.entitiesToRemove.push(entityKillable);
            this.die(universe, world, place, entityKillable);
        }
    }
    ;
    // cloneable
    clone() {
        return new Killable(this.integrityMax, this._damageApply, this._die);
    }
    ;
}
