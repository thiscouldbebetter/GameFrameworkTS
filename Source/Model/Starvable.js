"use strict";
class Starvable {
    constructor(satietyMax, satietyLostPerTick, starve) {
        this.satietyMax = satietyMax;
        this.satietyLostPerTick = satietyLostPerTick;
        this._starve = starve;
        this.satiety = this.satietyMax;
    }
    starve(u, w, p, e) {
        if (this._starve != null) {
            this._starve(u, w, p, e);
        }
    }
    satietyAdd(amountToAdd) {
        this.satiety += amountToAdd;
        this.satiety = NumberHelper.trimToRangeMax(this.satiety, this.satietyMax);
    }
    satietySubtract(amountToSubtract) {
        this.satietyAdd(0 - amountToSubtract);
    }
    isStarving() {
        return (this.satiety > 0);
    }
    ;
    updateForTimerTick(universe, world, place, entityStarvable) {
        if (this.isStarving()) {
            this.satiety -= this.satietyLostPerTick;
        }
        else {
            this.starve(universe, world, place, entityStarvable);
        }
    }
    ;
    // cloneable
    clone() {
        return new Starvable(this.satietyMax, this.satietyLostPerTick, this._starve);
    }
    ;
}
