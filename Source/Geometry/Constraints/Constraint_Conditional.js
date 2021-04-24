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
            constrain(universe, world, place, entity) {
                var willChildApply = this.shouldChildApply(universe, world, place, entity);
                if (willChildApply) {
                    this.child.constrain(universe, world, place, entity);
                }
            }
        }
        GameFramework.Constraint_Conditional = Constraint_Conditional;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
