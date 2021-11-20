"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Boundable {
            constructor(bounds) {
                this.bounds = bounds;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) {
                this.updateForTimerTick(uwpe);
            }
            updateForTimerTick(uwpe) {
                var e = uwpe.entity;
                this.bounds.locate(e.locatable().loc);
            }
            // Clonable.
            clone() {
                return new Boundable(this.bounds.clone());
            }
            overwriteWith(other) {
                this.bounds.overwriteWith(other.bounds);
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Boundable = Boundable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
