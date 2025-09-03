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
            // Sound.
            domElement() {
                throw new Error("todo");
            }
        }
        GameFramework.SoundFromSoundEffectSynthesizerSequence = SoundFromSoundEffectSynthesizerSequence;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
