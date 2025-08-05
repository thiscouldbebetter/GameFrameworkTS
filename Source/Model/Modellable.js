"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        /*
        export interface ModellableBase extends EntityPropertyBase<ModellableBase>
        {}
        */
        class Modellable extends GameFramework.EntityPropertyBase {
            constructor(model) {
                super();
                this.model = model;
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Modellable.name; }
            updateForTimerTick(uwpe) {
                // Do nothing.
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Modellable = Modellable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
