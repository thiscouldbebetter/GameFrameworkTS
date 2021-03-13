"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class RandomizerSystem {
            // Uses the built-in JavaScript randomizer.
            getNextRandom() {
                return Math.random();
            }
        }
        GameFramework.RandomizerSystem = RandomizerSystem;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
