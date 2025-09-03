"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SoundFromFile {
            constructor(name, sourcePath) {
                this.name = name;
                this.sourcePath = sourcePath;
            }
            static fromNameAndSourcePath(name, sourcePath) {
                return new SoundFromFile(name, sourcePath);
            }
            // Sound
            domElement(universe) {
                return new Audio(this.sourcePath);
            }
            load(uwpe, callback) {
                return this;
            }
            unload(uwpe) { throw new Error("todo"); }
        }
        GameFramework.SoundFromFile = SoundFromFile;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
