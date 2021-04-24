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
            use(u, w, p, eUsing, eUsed) {
                if (this.isDisabled) {
                    return null;
                }
                return this._use(u, w, p, eUsing, eUsed);
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
            finalize(u, w, p, e) { }
            initialize(u, w, p, e) { }
            updateForTimerTick(u, w, p, e) { }
        }
        GameFramework.Usable = Usable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
