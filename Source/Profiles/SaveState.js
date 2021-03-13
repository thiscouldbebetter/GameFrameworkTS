"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SaveState {
            constructor(name, placeName, timePlayingAsString, timeSaved, imageSnapshot, world) {
                this.name = name;
                this.placeName = placeName;
                this.timePlayingAsString = timePlayingAsString;
                this.timeSaved = timeSaved;
                this.imageSnapshot = imageSnapshot;
                this.world = world;
            }
            load() {
                // todo
            }
            unload() {
                this.world = null;
            }
        }
        GameFramework.SaveState = SaveState;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
