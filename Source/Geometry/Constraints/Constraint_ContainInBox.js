"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_ContainInBox extends GameFramework.ConstraintBase {
            constructor(boxToContainWithin) {
                super();
                this.boxToContainWithin = boxToContainWithin;
            }
            static fromBox(boxToContainWithin) {
                return new Constraint_ContainInBox(boxToContainWithin);
            }
            constrain(uwpe) {
                var constrainablePos = GameFramework.Locatable.of(uwpe.entity).loc.pos;
                this.boxToContainWithin.trimCoords(constrainablePos);
            }
        }
        GameFramework.Constraint_ContainInBox = Constraint_ContainInBox;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
