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
            soundPlaybackClear() {
                return this.soundPlaybackSet(null);
            }
            soundPlaybackSet(value) {
                this.soundPlayback = value;
                return this;
            }
        }
        GameFramework.Audible = Audible;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
