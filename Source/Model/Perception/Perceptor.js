"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Perceptor extends GameFramework.EntityPropertyBase {
            constructor(sightThreshold, hearingThreshold) {
                super();
                this.sightThreshold = sightThreshold;
                this.hearingThreshold = hearingThreshold;
            }
            static fromThresholdsSightAndHearing(sightThreshold, hearingThreshold) {
                return new Perceptor(sightThreshold, hearingThreshold);
            }
            static of(entity) {
                return entity.propertyByName(Perceptor.name);
            }
            // Clonable.
            clone() { return this; }
        }
        GameFramework.Perceptor = Perceptor;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
