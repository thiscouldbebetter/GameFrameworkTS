"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Triggerable {
            constructor(triggers) {
                this.triggers = triggers;
            }
            // Clonable.
            clone() {
                return new Triggerable(this.triggers.map(x => x.clone()));
            }
            overwriteWith(other) {
                return this; // todo
            }
            // Equatable
            equals(other) { return false; } // todo
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Triggerable.name; }
            updateForTimerTick(uwpe) {
                for (var i = 0; i < this.triggers.length; i++) {
                    var trigger = this.triggers[i];
                    trigger.updateForTimerTick(uwpe);
                }
            }
        }
        GameFramework.Triggerable = Triggerable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
