"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class RandomizerSystem extends GameFramework.Randomizer {
            // Uses the built-in JavaScript randomizer.
            constructor() {
                super();
            }
            static Instance() {
                if (RandomizerSystem._instance == null) {
                    RandomizerSystem._instance = new RandomizerSystem();
                }
                return RandomizerSystem._instance;
            }
            fraction() {
                return Math.random();
            }
            integerLessThan(max) {
                return Math.floor(this.fraction() * max);
            }
        }
        GameFramework.RandomizerSystem = RandomizerSystem;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
