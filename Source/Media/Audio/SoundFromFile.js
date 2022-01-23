"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SoundFromFile {
            constructor(name, sourcePath) {
                this.name = name;
                this.sourcePath = sourcePath;
                this.offsetInSeconds = 0;
            }
            domElementBuild(universe, volume) {
                this.domElement = document.createElement("audio");
                //this.domElement.sound = this;
                this.domElement.autoplay = true;
                this.domElement.onended = this.stopOrRepeat.bind(this, universe);
                this.domElement.loop = this.isRepeating;
                this.domElement.volume = volume;
                var domElementForSoundSource = document.createElement("source");
                domElementForSoundSource.src = this.sourcePath;
                this.domElement.appendChild(domElementForSoundSource);
                return this.domElement;
            }
            pause(universe) {
                var offsetInSeconds = this.domElement.currentTime;
                this.stop(universe);
                this.offsetInSeconds = offsetInSeconds;
            }
            play(universe, volume) {
                this.domElementBuild(universe, volume);
                this.domElement.currentTime = this.offsetInSeconds;
                universe.platformHelper.platformableAdd(this);
            }
            reset() {
                this.offsetInSeconds = 0;
            }
            seek(offsetInSeconds) {
                this.offsetInSeconds = offsetInSeconds;
            }
            stop(universe) {
                universe.platformHelper.platformableRemove(this);
                this.offsetInSeconds = 0;
            }
            stopOrRepeat(universe) {
                if (this.isRepeating == false) {
                    this.stop(universe);
                }
            }
            load(uwpe) { }
            unload(uwpe) { }
            // platformable
            toDomElement() {
                return this.domElement;
            }
        }
        GameFramework.SoundFromFile = SoundFromFile;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
