"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SoundNone {
            domElement() { return new Audio(); }
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
