"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Controllable extends GameFramework.EntityPropertyBase {
            constructor(toControl) {
                super();
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
        }
        GameFramework.Controllable = Controllable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
