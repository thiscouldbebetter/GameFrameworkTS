"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_Multiple extends GameFramework.ConstraintBase {
            constructor(children) {
                super();
                this.children = children;
            }
            static fromChildren(children) {
                return new Constraint_Multiple(children);
            }
            constrain(uwpe) {
                this.children.forEach(x => x.constrain(uwpe));
            }
            // Clonable.
            clone() {
                return new Constraint_Multiple(this.children.map(x => x.clone()));
            }
        }
        GameFramework.Constraint_Multiple = Constraint_Multiple;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
