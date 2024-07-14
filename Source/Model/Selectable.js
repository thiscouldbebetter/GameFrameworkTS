"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Selectable {
            constructor(select, deselect) {
                this._select = select;
                this._deselect = deselect;
            }
            deselect(uwpe) {
                if (this._deselect != null) {
                    this._deselect(uwpe);
                }
            }
            select(uwpe) {
                if (this._select != null) {
                    this._select(uwpe);
                }
            }
            // Clonable.
            clone() {
                return new Selectable(this._select, this._deselect);
            }
            overwriteWith(other) {
                this._select = other._select;
                this._deselect = other._deselect;
                return this;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Selectable.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Selectable = Selectable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
