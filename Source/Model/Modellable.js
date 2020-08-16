"use strict";
class Modellable extends EntityProperty //<Modellable>
 {
    constructor(model) {
        super();
        this.model = model;
    }
    updateForTimerTick(universe, world, place, entity) {
        // Do nothing.
    }
    ;
}
