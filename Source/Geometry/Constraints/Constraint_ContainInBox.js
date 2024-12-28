"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_ContainInBox {
            constructor(boxToContainWithin) {
                this.boxToContainWithin = boxToContainWithin;
            }
            constrain(uwpe) {
                this.boxToContainWithin.trimCoords(GameFramework.Locatable.of(uwpe.entity).loc.pos);
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Constraint_ContainInBox = Constraint_ContainInBox;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
