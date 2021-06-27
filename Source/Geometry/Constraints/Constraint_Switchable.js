"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_Switchable {
            constructor(isActive, child) {
                this.isActive = isActive;
                this.child = child;
            }
            constrain(uwpe) {
                if (this.isActive) {
                    this.child.constrain(uwpe);
                }
            }
            // Clonable.
            clone() {
                return new Constraint_Switchable(this.isActive, this.child.clone());
            }
            overwriteWith(other) {
                this.isActive = other.isActive;
                this.child.overwriteWith(other.child);
                return this;
            }
        }
        GameFramework.Constraint_Switchable = Constraint_Switchable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
