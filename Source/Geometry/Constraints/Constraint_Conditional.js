"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_Conditional {
            constructor(shouldChildApply, child) {
                this._shouldChildApply = shouldChildApply;
                this.child = child;
            }
            static fromShouldChildApplyAndChild(shouldChildApply, child) {
                return new Constraint_Conditional(shouldChildApply, child);
            }
            constrain(uwpe) {
                var willChildApply = this.shouldChildApply(uwpe);
                if (willChildApply) {
                    this.child.constrain(uwpe);
                }
            }
            shouldChildApply(uwpe) {
                return this._shouldChildApply(uwpe);
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
