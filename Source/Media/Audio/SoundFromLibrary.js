"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SoundFromLibrary {
            constructor(name) {
                this.name = name;
            }
            static fromName(name) {
                return new SoundFromLibrary(name);
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
            domElement(universe) {
                var soundInner = this.soundInner(universe);
                return soundInner.domElement(universe);
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
