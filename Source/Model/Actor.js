"use strict";
class Actor extends EntityProperty {
    constructor(activity, target) {
        super();
        this.activity = activity;
        this.target = target;
        this.actions = [];
    }
    updateForTimerTick(universe, world, place, entity) {
        this.activity(universe, world, place, entity, this.target);
    }
}
