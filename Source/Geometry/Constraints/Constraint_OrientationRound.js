"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_OrientationRound extends GameFramework.ConstraintBase {
            constructor(headingsCount) {
                super();
                this.headingsCount = headingsCount;
            }
            static fromHeadingsCount(headingsCount) {
                return new Constraint_OrientationRound(headingsCount);
            }
            constrain(uwpe) {
                var constrainableEntity = uwpe.entity;
                var constrainableLoc = GameFramework.Locatable.of(constrainableEntity).loc;
                var constrainableOri = constrainableLoc.orientation;
                var constrainableForward = constrainableOri.forward;
                var headingInTurns = constrainableForward.headingInTurns();
                var headingIndex = Math.round(headingInTurns * this.headingsCount) % this.headingsCount;
                headingInTurns = headingIndex / this.headingsCount;
                var headingAsCoords = Coords.create().fromHeadingInTurns(headingInTurns);
                constrainableOri
                    .forwardSet(headingAsCoords)
                    .normalize();
            }
        }
        GameFramework.Constraint_OrientationRound = Constraint_OrientationRound;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
