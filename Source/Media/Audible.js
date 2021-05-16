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
            updateForTimerTick(u, w, p, e) { }
            finalize(u, w, p, e) { }
            initialize(u, w, p, e) { }
        }
        GameFramework.Audible = Audible;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
