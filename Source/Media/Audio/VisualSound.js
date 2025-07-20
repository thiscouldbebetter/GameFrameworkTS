"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualSound {
            constructor(soundNameToPlay, isMusic) {
                this.soundNameToPlay = soundNameToPlay;
                this.isMusic = isMusic;
            }
            static default() {
                return new VisualSound("Effects_Sound", false);
            }
            static fromSoundName(soundName) {
                return new VisualSound(soundName, false); // isMusic
            }
            static fromSoundNameAndRepeat(soundName, repeat) {
                return new VisualSound(soundName, repeat);
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
                if (audible != null) {
                    if (audible.hasBeenHeard == false) {
                        if (this.isMusic) {
                            soundHelper.soundWithNamePlayAsMusic(universe, this.soundNameToPlay);
                        }
                        else {
                            soundHelper.soundWithNamePlayAsEffect(universe, this.soundNameToPlay);
                        }
                        audible.hasBeenHeard = true;
                    }
                }
            }
            // Clonable.
            clone() {
                return new VisualSound(this.soundNameToPlay, this.isMusic);
            }
            overwriteWith(other) {
                this.soundNameToPlay = other.soundNameToPlay;
                this.isMusic = other.isMusic;
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
