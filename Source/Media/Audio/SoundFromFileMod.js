"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SoundFromFileMod {
            constructor(name, sourceFilePath) {
                this.name = name;
                this.sourceFilePath = sourceFilePath;
                this.isLoaded = false;
            }
            // Sound implementation.
            pause(universe) {
                // todo
            }
            play(universe, volume) {
                this._soundInner.play(() => { }); // todo
            }
            seek(offsetInSeconds) {
                // todo
            }
            stop(universe) {
                if (this._soundInner != null) {
                    this._soundInner.stop(); // todo
                }
            }
            load(uwpe) {
                this._binaryFileInner = new GameFramework.BinaryFile(this.name, this.sourceFilePath);
                this._binaryFileInner.load(uwpe, this.load_binaryFileInnerLoaded.bind(this));
            }
            load_binaryFileInnerLoaded(result) {
                var soundFileAsBinaryFile = result;
                var soundFileAsBytes = soundFileAsBinaryFile.bytes;
                var modFile = ThisCouldBeBetter.MusicTracker.ModFile.fromBytes(this.name, soundFileAsBytes);
                var modFileAsSong = ThisCouldBeBetter.MusicTracker.Song.fromModFile(modFile);
                this.isLoaded = true;
                this._soundInner = modFileAsSong.toSound();
            }
            unload(uwpe) {
                // todo
            }
        }
        GameFramework.SoundFromFileMod = SoundFromFileMod;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
