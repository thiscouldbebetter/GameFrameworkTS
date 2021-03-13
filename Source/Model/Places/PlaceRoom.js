"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class PlaceRoom extends GameFramework.Place {
            constructor(name, defnName, size, entities, randomizerSeed) {
                super(name, defnName, size, entities);
                this.randomizerSeed = randomizerSeed;
            }
        }
        GameFramework.PlaceRoom = PlaceRoom;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
