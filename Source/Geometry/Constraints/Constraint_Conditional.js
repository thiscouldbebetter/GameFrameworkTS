"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_Conditional {
            constructor(shouldChildApply, child) {
                this.shouldChildApply = shouldChildApply;
                this.child = child;
            }
            constrain(uwpe) {
                var willChildApply = this.shouldChildApply(uwpe);
                if (willChildApply) {
                    this.child.constrain(uwpe);
                }
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Constraint_Conditional = Constraint_Conditional;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
