"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_Conditional extends GameFramework.ConstraintBase {
            constructor(shouldChildApply, child) {
                super();
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
        }
        GameFramework.Constraint_Conditional = Constraint_Conditional;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
