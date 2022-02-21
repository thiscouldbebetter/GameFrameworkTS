"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class MapCellCollidable {
            constructor() {
                this.isBlocking = false;
            }
            clone() { throw new Error("todo"); }
            overwriteWith(other) { throw new Error("todo"); }
        }
        GameFramework.MapCellCollidable = MapCellCollidable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
