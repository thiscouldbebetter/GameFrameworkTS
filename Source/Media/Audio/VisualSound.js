"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualSound {
            constructor(soundToPlayName, repeats) {
                this.soundToPlayName = soundToPlayName;
                this.repeats = repeats;
            }
            static default() {
                return new VisualSound("Effects__Default", false); // repeats
            }
            static fromSoundName(soundName) {
                return new VisualSound(soundName, false); // repeats
            }
            static fromSoundNameAndRepeat(soundName, repeats) {
                return new VisualSound(soundName, repeats);
            }
            // Visual.
            initialize(uwpe) {
                // todo - Initialize the sound.
            }
            initializeIsComplete(uwpe) {
                return true; // todo
            }
            draw(uwpe, display) {
                var universe = uwpe.universe;
                var entity = uwpe.entity;
                var soundHelper = universe.soundHelper;
                var audible = GameFramework.Audible.of(entity);
                if (audible == null) {
                    throw new Error("The entity has no Audible property!");
                }
                else {
                    if (audible.hasBeenHeard == false) {
                        var sound = soundHelper.soundWithName(universe, this.soundToPlayName);
                        var volume = soundHelper.effectVolume; // todo
                        sound.play(universe, volume);
                        audible.hasBeenHeardSet(true);
                    }
                }
            }
            // Clonable.
            clone() {
                return new VisualSound(this.soundToPlayName, this.repeats);
            }
            overwriteWith(other) {
                this.soundToPlayName = other.soundToPlayName;
                this.repeats = other.repeats;
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                return this; // todo
            }
        }
        GameFramework.VisualSound = VisualSound;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
