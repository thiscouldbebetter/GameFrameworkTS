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
            finalize(universe) {
                /*
                var soundForMusic = universe.soundHelper.soundForMusic;
                if (soundForMusic != null)
                {
                    soundForMusic.pause(universe);
                }
                */
            }
            initialize(universe) {
                universe.worldSet(this.world);
                var uwpe = GameFramework.UniverseWorldPlaceEntities.fromUniverseAndWorld(universe, this.world);
                this.world.initialize(uwpe);
                /*
                var soundHelper = universe.soundHelper;
                soundHelper.soundWithNamePlayAsMusic(universe, "Music_Music");
                */
                this.venueControls = new GameFramework.VenueControls(this.world.toControl(universe), true // ignoreKeyboardAndGamepadInputs
                );
            }
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
