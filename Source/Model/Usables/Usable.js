"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Usable {
            constructor(use) {
                this._use = use;
                this.isDisabled = false;
            }
            use(uwpe) {
                this._use(uwpe);
            }
            // Clonable.
            clone() {
                return new Usable(this._use);
            }
            overwriteWith(other) {
                this._use = other._use;
                return this;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Usable = Usable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
