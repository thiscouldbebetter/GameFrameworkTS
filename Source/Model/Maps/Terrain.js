"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Terrain {
            constructor(name, code, level, traversable, visual) {
                this.name = name;
                this.code = code;
                this.level = level;
                this.traversable = traversable;
                this.visual = visual;
            }
        }
        GameFramework.Terrain = Terrain;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
