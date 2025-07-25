"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VenueWorld {
            constructor(world) {
                this.name = "World";
                this.world = world;
            }
            draw(universe) {
                this.world.draw(universe);
            }
            finalize(universe) { }
            finalizeIsComplete() { return true; }
            initialize(universe) {
                universe.worldSet(this.world);
                var uwpe = GameFramework.UniverseWorldPlaceEntities.fromUniverseAndWorld(universe, this.world);
                this.world.initialize(uwpe);
                this.venueControls = new GameFramework.VenueControls(this.world.toControl(universe), true // ignoreKeyboardAndGamepadInputs
                );
            }
            initializeIsComplete() { return true; }
            updateForTimerTick(universe) {
                var uwpe = GameFramework.UniverseWorldPlaceEntities.fromUniverseAndWorld(universe, this.world);
                this.world.updateForTimerTick(uwpe);
                this.draw(uwpe.universe);
                this.venueControls.updateForTimerTick(universe);
            }
        }
        GameFramework.VenueWorld = VenueWorld;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
