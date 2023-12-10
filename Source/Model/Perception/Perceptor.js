"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Perceptor {
            constructor(sightThreshold, hearingThreshold) {
                this.sightThreshold = sightThreshold;
                this.hearingThreshold = hearingThreshold;
            }
            // Clonable.
            clone() { throw new Error("Not yet implemented."); }
            overwriteWith(other) { throw new Error("Not yet implemented."); }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Perceptor = Perceptor;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
