"use strict";
class PlaceRoom extends Place {
    constructor(name, defnName, size, entities, randomizerSeed) {
        super(name, defnName, size, ArrayHelper.addMany([CollisionTracker.fromSize(size).toEntity()], // hack - Must come before collidables.
        entities));
        this.randomizerSeed = randomizerSeed;
    }
}
