"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Terrain {
            constructor(name, codeChar, level, traversable, visuals) {
                this.name = name;
                this.codeChar = codeChar;
                this.level = level;
                this.traversable = traversable;
                this.visuals = visuals;
            }
        }
        GameFramework.Terrain = Terrain;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
