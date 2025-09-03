"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Audible extends GameFramework.EntityPropertyBase {
            constructor() {
                super();
            }
            static create() {
                return new Audible();
            }
            static of(entity) {
                return entity.propertyByName(Audible.name);
            }
            soundPlaybackSet(value) {
                this.soundPlayback = value;
                return this;
            }
            updateForTimerTick(uwpe) {
                this.soundPlayback.startIfNotStartedAlready(uwpe.universe);
            }
        }
        GameFramework.Audible = Audible;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
