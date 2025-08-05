"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class MapCellCollidable {
            constructor() {
                this.isBlocking = false;
            }
            clone() { throw new Error("Not implemented!"); }
            overwriteWith(other) { throw new Error("Not implemented!"); }
        }
        GameFramework.MapCellCollidable = MapCellCollidable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
