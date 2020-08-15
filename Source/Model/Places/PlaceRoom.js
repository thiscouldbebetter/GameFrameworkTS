"use strict";
class PlaceRoom extends Place {
    constructor(name, defnName, size, entities, randomizerSeed) {
        super(name, defnName, size, entities);
        this.randomizerSeed = randomizerSeed;
    }
}
