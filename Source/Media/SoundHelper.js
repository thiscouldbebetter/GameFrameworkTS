"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SoundHelper {
            constructor(sounds) {
                this.sounds = sounds;
                this.soundsByName = GameFramework.ArrayHelper.addLookupsByName(this.sounds);
                this.musicVolume = 1;
                this.soundVolume = 1;
                this.soundForMusic = null;
            }
            static controlSelectOptionsVolume() {
                var returnValue = [
                    new GameFramework.ControlSelectOption(1, "100%"),
                    new GameFramework.ControlSelectOption(0, "0%"),
                    new GameFramework.ControlSelectOption(.1, "10%"),
                    new GameFramework.ControlSelectOption(.2, "20%"),
                    new GameFramework.ControlSelectOption(.3, "30%"),
                    new GameFramework.ControlSelectOption(.4, "40%"),
                    new GameFramework.ControlSelectOption(.5, "50%"),
                    new GameFramework.ControlSelectOption(.6, "60%"),
                    new GameFramework.ControlSelectOption(.7, "70%"),
                    new GameFramework.ControlSelectOption(.8, "80%"),
                    new GameFramework.ControlSelectOption(.9, "90%"),
                ];
                return returnValue;
            }
            // instance methods
            audioContext() {
                if (this._audioContext == null) {
                    this._audioContext = new AudioContext();
                }
                return this._audioContext;
            }
            reset() {
                for (var i = 0; i < this.sounds.length; i++) {
                    var sound = this.sounds[i];
                    sound.offsetInSeconds = 0;
                }
            }
            soundWithNamePlayAsEffect(universe, soundName) {
                var sound = this.soundsByName.get(soundName);
                sound.isRepeating = false;
                sound.play(universe, this.soundVolume);
            }
            soundWithNamePlayAsMusic(universe, soundToPlayName) {
                var soundToPlay = this.soundsByName.get(soundToPlayName);
                soundToPlay.isRepeating = true;
                var soundAlreadyPlaying = this.soundForMusic;
                if (soundAlreadyPlaying == null) {
                    soundToPlay.play(universe, this.musicVolume);
                }
                else if (soundAlreadyPlaying.name != soundToPlayName) {
                    soundAlreadyPlaying.stop(universe);
                    soundToPlay.play(universe, this.musicVolume);
                }
                this.soundForMusic = soundToPlay;
            }
            soundsAllStop(universe) {
                this.sounds.forEach(x => x.stop(universe));
            }
        }
        GameFramework.SoundHelper = SoundHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
