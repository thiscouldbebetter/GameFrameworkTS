"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Usable extends GameFramework.EntityProperty {
            constructor(use) {
                super();
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
        }
        GameFramework.Usable = Usable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
