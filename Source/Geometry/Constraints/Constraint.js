"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ConstraintBase {
            constrain(uwpe) { throw new Error("Must be implemented in subclass."); }
            nameSet(value) {
                this.name = value;
                return this;
            }
            // Clonable.
            clone() { return this; } // hack
            overwriteWith(other) { throw new Error("Must be implemented in subclass."); }
        }
        GameFramework.ConstraintBase = ConstraintBase;
        class Constraint_None extends ConstraintBase {
            constructor() { super(); }
            constrain(uwpe) {
                // Do nothing.
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Constraint_None = Constraint_None;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
