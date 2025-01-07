"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SoundFromLibrary {
            constructor(name) {
                this.name = name;
            }
            soundInner(universe) {
                if (this._soundInner == null) {
                    var mediaLibrary = universe.mediaLibrary;
                    this._soundInner =
                        mediaLibrary.soundGetByName(this.name);
                }
                return this._soundInner;
            }
            // Sound implementation.
            pause(universe) {
                this.soundInner(universe).pause(universe);
            }
            play(universe, volume) {
                this.soundInner(universe).play(universe, volume);
            }
            seek(offsetInSeconds) {
                this.soundInner(null).seek(offsetInSeconds);
            }
            stop(universe) {
                this.soundInner(universe).stop(universe);
            }
            load(uwpe, callback) {
                this.soundInner(uwpe.universe).load(uwpe, callback);
                return this;
            }
            unload(uwpe) {
                this.soundInner(uwpe.universe).unload(uwpe);
                return this;
            }
        }
        GameFramework.SoundFromLibrary = SoundFromLibrary;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
