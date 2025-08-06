"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SoundFromSoundEffectSynthesizerSequence {
            constructor(name, soundSequence) {
                this.name = name;
                this.soundSequence = soundSequence;
            }
            static fromNameAndSoundSequence(name, soundSequence) {
                return new SoundFromSoundEffectSynthesizerSequence(name, soundSequence);
            }
            load(uwpe, callback) {
                // No need to load, just call the callback.
                callback(this);
                return this;
            }
            unload(uwpe) {
                return this;
            }
            pause(universe) { throw new Error("Not yet implemented!"); }
            play(universe, volume) {
                this.soundSequence.play();
            }
            seek(offsetInSeconds) { throw new Error("Not yet implemented!"); }
            stop(universe) {
                this.soundSequence.stop();
            }
        }
        GameFramework.SoundFromSoundEffectSynthesizerSequence = SoundFromSoundEffectSynthesizerSequence;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
