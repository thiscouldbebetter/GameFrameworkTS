"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_Dynamic {
            constructor(constrain) {
                this._constrain = constrain;
            }
            static fromConstrain(constrain) {
                return new Constraint_Dynamic(constrain);
            }
            constrain(uwpe) {
                this._constrain(uwpe);
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Constraint_Dynamic = Constraint_Dynamic;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
