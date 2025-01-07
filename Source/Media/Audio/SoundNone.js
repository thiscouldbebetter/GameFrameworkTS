"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SoundNone {
            pause(universe) { }
            play(universe, volume) { }
            seek(offsetInSeconds) { }
            stop(universe) { }
            load(uwpe) {
                this.isLoaded = true;
                return this;
            }
            unload(uwpe) {
                this.isLoaded = false;
                return this;
            }
        }
        GameFramework.SoundNone = SoundNone;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
