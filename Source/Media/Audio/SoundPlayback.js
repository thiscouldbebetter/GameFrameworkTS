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
                this.reset();
            }
            static fromSound(sound) {
                return new SoundPlayback(sound, null, null);
            }
            static fromSoundVolumeAsFractionAndTimesToPlay(sound, volumeAsFraction, timesToPlay) {
                return new SoundPlayback(sound, timesToPlay, volumeAsFraction);
            }
            pause(universe) {
                this.isPaused = true;
                var audioElement = this.domElement(universe);
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
            startIfNotStartedAlready(universe) {
                universe.soundHelper.soundPlaybackRegister(this);
                var domElement = this.domElement(universe);
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
            stop(universe) {
                this.hasBeenFinished = true;
                var audioElement = this.domElement(universe);
                audioElement.pause();
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
                    this._domElementAudio.onended =
                        () => this.toDomElement_Ended(universe);
                    this._domElementAudio.currentTime = this.offsetInSeconds;
                }
                return this._domElementAudio;
            }
            toDomElement_Ended(universe) {
                this.timesPlayedSoFar++;
                if (this.timesPlayedSoFar >= this.timesToPlay) {
                    this.stop(universe);
                }
            }
        }
        GameFramework.SoundPlayback = SoundPlayback;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
