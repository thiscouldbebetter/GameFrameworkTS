"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class RandomizerSystem {
            static Instance() {
                if (RandomizerSystem._instance == null) {
                    RandomizerSystem._instance = new RandomizerSystem();
                }
                return RandomizerSystem._instance;
            }
            getNextRandom() {
                return Math.random();
            }
        }
        GameFramework.RandomizerSystem = RandomizerSystem;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
