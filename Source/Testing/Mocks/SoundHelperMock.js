"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SoundHelperMock {
            audioContext() { return null; }
            controlSelectOptionsVolume() { return null; }
            soundPlaybackCreateFromSound(sound) { return null; }
            soundPlaybackRegister(soundPlayback) { }
            soundPlaybacksAllStop(universe) { }
        }
        GameFramework.SoundHelperMock = SoundHelperMock;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
