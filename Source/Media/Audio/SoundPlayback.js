"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SoundPlayback {
            constructor(sound, volumeAsFraction, timesToPlay) {
                this.sound = sound;
                this.volumeAsFraction = volumeAsFraction || 1;
                this.timesToPlay = timesToPlay || 1;
                this.isStarted = false;
                this.offsetInSeconds = 0;
                this.timesPlayedSoFar = 0;
            }
            static fromSound(sound) {
                return new SoundPlayback(sound, null, null);
            }
            static fromSoundVolumeAsFractionAndTimesToPlay(sound, volumeAsFraction, timesToPlay) {
                return new SoundPlayback(sound, timesToPlay, volumeAsFraction);
            }
            repeatsForever() {
                this.timesToPlay = Number.POSITIVE_INFINITY;
                return this;
            }
            startIfNotStartedAlready(universe) {
                if (this.isStarted == false) {
                    this.isStarted = true;
                    this.timesPlayedSoFar = 0;
                    var domElement = this.domElement(universe);
                    domElement.play();
                }
            }
            stop(universe) {
                this.isStarted = false;
                this.domElement(universe).muted = true;
            }
            volumeAsFractionSet(value) {
                this.volumeAsFraction = value;
                return this;
            }
            // Clonable.
            clone() {
                return new SoundPlayback(this.sound, this.volumeAsFraction, this.timesToPlay);
            }
            overwriteWith(other) {
                this.volumeAsFraction = other.volumeAsFraction;
                this.timesToPlay = other.timesToPlay;
                return this;
            }
            domElement(universe) {
                if (this._domElementAudio == null) {
                    this._domElementAudio = this.sound.domElement(universe);
                    this._domElementAudio.onended = this.toDomElement_Ended;
                }
                return this._domElementAudio;
            }
            toDomElement_Ended(event) {
                console.log("ended");
            }
        }
        GameFramework.SoundPlayback = SoundPlayback;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
