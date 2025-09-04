"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SoundHelperLive {
            constructor() {
                this.effectVolume = 1;
                this.musicVolume = 1;
                this.soundPlaybacks = [];
                this.soundPlaybackForMusic = null;
            }
            controlSelectOptionsVolume() {
                var cso = (a, b) => new GameFramework.ControlSelectOption(a, b);
                if (this._controlSelectOptionsVolume == null) {
                    this._controlSelectOptionsVolume =
                        [
                            cso(1, "100%"),
                            cso(0, "0%"),
                            cso(.1, "10%"),
                            cso(.2, "20%"),
                            cso(.3, "30%"),
                            cso(.4, "40%"),
                            cso(.5, "50%"),
                            cso(.6, "60%"),
                            cso(.7, "70%"),
                            cso(.8, "80%"),
                            cso(.9, "90%"),
                        ];
                }
                ;
                return this._controlSelectOptionsVolume;
            }
            // instance methods
            audioContext() {
                if (this._audioContext == null) {
                    this._audioContext = new AudioContext();
                }
                return this._audioContext;
            }
            soundPlaybackRegister(soundPlayback) {
                if (this.soundPlaybacks.indexOf(soundPlayback) == -1) {
                    this.soundPlaybacks.push(soundPlayback);
                }
            }
            soundPlaybackCreateFromSound(sound) {
                var soundPlayback = GameFramework.SoundPlayback.fromSound(sound);
                this.soundPlaybackRegister(soundPlayback);
                return soundPlayback;
            }
            soundPlaybacksAllStop(universe) {
                var uwpe = GameFramework.UniverseWorldPlaceEntities.fromUniverse(universe);
                this.soundPlaybacks.forEach(x => x.stop(uwpe));
            }
        }
        GameFramework.SoundHelperLive = SoundHelperLive;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
