"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Perceptor extends GameFramework.EntityProperty {
            constructor(sightThreshold, hearingThreshold) {
                super();
                this.sightThreshold = sightThreshold;
                this.hearingThreshold = hearingThreshold;
            }
        }
        GameFramework.Perceptor = Perceptor;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
