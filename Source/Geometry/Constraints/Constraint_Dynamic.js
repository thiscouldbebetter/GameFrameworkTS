"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_Dynamic extends GameFramework.ConstraintBase {
            constructor(constrain) {
                super();
                this._constrain = constrain;
            }
            static fromConstrain(constrain) {
                return new Constraint_Dynamic(constrain);
            }
            constrain(uwpe) {
                this._constrain(uwpe);
            }
        }
        GameFramework.Constraint_Dynamic = Constraint_Dynamic;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
