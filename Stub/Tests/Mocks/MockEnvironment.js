"use strict";
class MockEnvironment {
    constructor() {
        this.universe = this.universeCreate();
    }
    universeCreate() {
        var universe = Universe.default();
        universe.world = universe.worldCreate();
        universe.world.defn = new WorldDefn([
            [PlaceDefn.default()]
        ]);
        universe.initialize(() => { });
        universe.profile = Profile.anonymous();
        universe.world.initialize(UniverseWorldPlaceEntities.fromUniverse(universe));
        return universe;
    }
}
