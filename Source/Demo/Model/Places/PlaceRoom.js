"use strict";
class PlaceRoom extends PlaceBase {
    constructor(name, defnName, size, entities, randomizerSeed) {
        super(name, defnName, null, // parentName
        size, ArrayHelper.addMany([CollisionTracker.fromSize(size).toEntity()], // hack - Must come before collidables.
        entities));
        this.randomizerSeed = randomizerSeed;
    }
}
