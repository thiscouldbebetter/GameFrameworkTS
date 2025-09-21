"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EntityPropertyBase {
            constructor() {
                // Inactivatable.
                this._inactivated = false;
            }
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return this.constructor.name; }
            updateForTimerTick(uwpe) { }
            // Clonable.
            clone() { throw new Error("Must be implemented on subclass!"); }
            overwriteWith(other) { throw new Error("Must be implemented on subclass!"); }
            equals(other) { throw new Error("Must be implemented on subclass!"); }
            activate() {
                this._inactivated = false;
                return this;
            }
            activated() { return (this._inactivated == false); }
            inactivate() {
                this._inactivated = true;
                return this;
            }
            inactivated() { return this._inactivated; }
        }
        GameFramework.EntityPropertyBase = EntityPropertyBase;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
