"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Audible {
            constructor() {
                this.hasBeenHeard = false;
            }
            // Cloneable
            clone() {
                return new Audible();
            }
            overwriteWith(other) {
                this.hasBeenHeard = other.hasBeenHeard;
                return this;
            }
            // EntityProperty.
            updateForTimerTick(uwpe) { }
            finalize(uwpe) { }
            initialize(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Audible = Audible;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
