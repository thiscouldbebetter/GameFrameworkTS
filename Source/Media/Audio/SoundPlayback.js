"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SoundPlayback {
            constructor(sound, volumeAsFraction, timesToPlay, callbackForStop) {
                this.sound = sound;
                this.volumeAsFraction = volumeAsFraction || 1;
                this.timesToPlay = timesToPlay || 1;
                this._callbackForStop = callbackForStop;
                this.reset();
            }
            static fromSound(sound) {
                return new SoundPlayback(sound, null, null, null);
            }
            static fromSoundAndCallbackForStop(sound, callbackForStop) {
                return new SoundPlayback(sound, null, null, callbackForStop);
            }
            static fromSoundVolumeAsFractionTimesToPlayAndCallbackForStop(sound, volumeAsFraction, timesToPlay, callbackForStop) {
                return new SoundPlayback(sound, timesToPlay, volumeAsFraction, callbackForStop);
            }
            callbackForStop(uwpe) {
                if (this._callbackForStop != null) {
                    this._callbackForStop(uwpe);
                }
            }
            pause(uwpe) {
                this.isPaused = true;
                var audioElement = this.domElement(uwpe);
                audioElement.pause();
                this.offsetInSeconds = audioElement.currentTime;
            }
            repeatsForever() {
                this.timesToPlay = Number.POSITIVE_INFINITY;
                return this;
            }
            reset() {
                this.hasBeenStarted = false;
                this.hasBeenFinished = false;
                this.isPaused = false;
                this.offsetInSeconds = 0;
                this.timesPlayedSoFar = 0;
                return this;
            }
            startIfNotStartedYet(uwpe) {
                var universe = uwpe.universe;
                universe.soundHelper.soundPlaybackRegister(this);
                var domElement = this.domElement(uwpe);
                if (this.hasBeenStarted == false) {
                    this.hasBeenStarted = true;
                    this.hasBeenFinished = false;
                    this.timesPlayedSoFar = 0;
                    if (this.timesToPlay > 1) {
                        domElement.loop = true;
                    }
                    domElement.play();
                }
                else if (this.isPaused) {
                    this.isPaused = false;
                    domElement.play();
                }
            }
            soundName() {
                return this.sound.name;
            }
            stop(uwpe) {
                this.hasBeenFinished = true;
                var audioElement = this.domElement(uwpe);
                audioElement.pause();
                this._domElementAudio = null;
                this.callbackForStop(uwpe);
            }
            volumeAsFractionSet(value) {
                this.volumeAsFraction = value;
                return this;
            }
            // Clonable.
            clone() {
                return new SoundPlayback(this.sound, this.volumeAsFraction, this.timesToPlay, this._callbackForStop);
            }
            overwriteWith(other) {
                this.volumeAsFraction = other.volumeAsFraction;
                this.timesToPlay = other.timesToPlay;
                this._callbackForStop = other._callbackForStop;
                return this;
            }
            domElement(uwpe) {
                if (this._domElementAudio == null) {
                    this._domElementAudio = this.sound.domElement(uwpe.universe);
                    uwpe = uwpe.clone();
                    this._domElementAudio.onended =
                        () => this.domElement_Ended(uwpe);
                    this._domElementAudio.currentTime = this.offsetInSeconds;
                }
                return this._domElementAudio;
            }
            domElement_Ended(uwpe) {
                this.timesPlayedSoFar++;
                if (this.timesPlayedSoFar >= this.timesToPlay) {
                    this.stop(uwpe);
                }
            }
        }
        GameFramework.SoundPlayback = SoundPlayback;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
