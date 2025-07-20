"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Controllable {
            constructor(toControl) {
                this.toControl = toControl;
            }
            static fromToControl(toControl) {
                return new Controllable(toControl);
            }
            static of(entity) {
                return entity.propertyByName(Controllable.name);
            }
            toControl(uwpe, size, controlTypeName) {
                var control = (this._toControl == null)
                    ? GameFramework.ControlNone.create()
                    : this._toControl(uwpe, size, controlTypeName);
                return control;
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Controllable.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Controllable = Controllable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
