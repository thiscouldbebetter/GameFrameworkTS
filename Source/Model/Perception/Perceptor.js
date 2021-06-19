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
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
        }
        GameFramework.Perceptor = Perceptor;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
