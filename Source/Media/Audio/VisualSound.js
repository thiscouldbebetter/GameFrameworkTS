"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualSound {
            constructor(soundPlayback) {
                this.soundPlayback = soundPlayback;
            }
            static fromSoundName(soundName) {
                var sound = GameFramework.SoundFromLibrary.fromName(soundName);
                var soundPlayback = GameFramework.SoundPlayback.fromSoundAndCallbackForStop(sound, this.soundPlaybackCallbackForStop);
                return new VisualSound(soundPlayback);
            }
            static fromSoundNameRepeating(soundName) {
                var sound = GameFramework.SoundFromLibrary.fromName(soundName);
                var soundPlayback = GameFramework.SoundPlayback.fromSound(sound).repeatsForever();
                return new VisualSound(soundPlayback);
            }
            static silence() {
                return new VisualSound(null);
            }
            // Visual.
            initialize(uwpe) {
                // todo - Initialize the sound.
            }
            initializeIsComplete(uwpe) {
                return true; // todo
            }
            draw(uwpe, display) {
                var entity = uwpe.entity;
                var audible = GameFramework.Audible.of(entity);
                if (audible == null) {
                    throw new Error("The entity has no Audible property!");
                }
                else {
                    if (audible.soundPlayback == null) {
                        if (this.soundPlayback != null) {
                            var soundPlayback = this.soundPlayback.clone();
                            audible.soundPlaybackSet(soundPlayback);
                            soundPlayback.startIfNotStartedYet(uwpe);
                        }
                    }
                    else {
                        if (this.soundPlayback == null) {
                            // Silence the previous sound.
                            audible.soundPlaybackClear();
                        }
                    }
                }
            }
            static soundPlaybackCallbackForStop(uwpe) {
                // This may result in the sound being played continuously while the VisualSound is being drawn.
                /*
                var entity = uwpe.entity;
                var audible = Audible.of(entity);
                audible.soundPlaybackClear();
                */
            }
            // Clonable.
            clone() {
                return new VisualSound(this.soundPlayback.clone());
            }
            overwriteWith(other) {
                this.soundPlayback.overwriteWith(other.soundPlayback);
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
