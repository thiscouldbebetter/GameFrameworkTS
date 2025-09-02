"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SoundFromFile {
            constructor(name, sourcePath, timesToPlay) {
                this.name = name;
                this.sourcePath = sourcePath;
                this.timesToPlay = timesToPlay || 1;
                this.offsetInSeconds = 0;
                //this.timesPlayedSoFar = 0;
            }
            static fromNameSourcePathAndIsRepeating(name, sourcePath, timesToPlay) {
                return new SoundFromFile(name, sourcePath, timesToPlay);
            }
            audioElement() {
                if (this._audioElement == null) {
                    this._audioElement = new Audio(this.sourcePath);
                    this._audioElement.loop = this.isRepeating();
                }
                return this._audioElement;
            }
            isRepeating() {
                return (this.timesToPlay == Number.POSITIVE_INFINITY);
            }
            pause(universe) {
                var audio = this.audioElement();
                var offsetInSeconds = audio.currentTime;
                this.stop(universe);
                this.offsetInSeconds = offsetInSeconds;
            }
            play(universe, volume) {
                var audio = this.audioElement();
                audio.volume = volume;
                audio.currentTime = this.offsetInSeconds;
                audio.preload = "auto";
                try {
                    audio.play();
                }
                catch (ex) {
                    console.log("Audio exception: " + ex);
                }
            }
            reset() {
                this.offsetInSeconds = 0;
            }
            seek(offsetInSeconds) {
                this.offsetInSeconds = offsetInSeconds;
            }
            stop(universe) {
                this.audioElement().pause();
                this.offsetInSeconds = 0;
            }
            load(uwpe, callback) {
                return this;
            }
            unload(uwpe) { throw new Error("todo"); }
            // platformable
            toDomElement() {
                return this.domElement;
            }
        }
        GameFramework.SoundFromFile = SoundFromFile;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
