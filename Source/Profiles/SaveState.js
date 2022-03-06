"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SaveStateBase {
            constructor(name, placeName, timePlayingAsString, timeSaved, imageSnapshot) {
                this.name = name;
                this.placeName = placeName;
                this.timePlayingAsString = timePlayingAsString;
                this.timeSaved = timeSaved;
                this.imageSnapshot = imageSnapshot;
            }
            fromWorld(world) {
                throw new Error("Must be implemented in subclass!");
            }
            toWorld(universe) {
                throw new Error("Must be implemented in subclass!");
            }
            // Loadable.
            load() {
                throw new Error("Must be implemented in subclass!");
            }
            unload() {
                throw new Error("Must be implemented in subclass!");
            }
        }
        GameFramework.SaveStateBase = SaveStateBase;
        class SaveStateWorld extends SaveStateBase {
            constructor(name, placeName, timePlayingAsString, timeSaved, imageSnapshot) {
                super(name, placeName, timePlayingAsString, timeSaved, imageSnapshot);
            }
            fromWorld(world) {
                this.world = world;
                return this;
            }
            toWorld(universe) {
                return this.world;
            }
            // Loadable.
            load() {
                // todo
            }
            unload() {
                this.world = null;
            }
        }
        GameFramework.SaveStateWorld = SaveStateWorld;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
