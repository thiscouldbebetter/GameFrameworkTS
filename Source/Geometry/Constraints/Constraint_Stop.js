"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_Stop extends GameFramework.ConstraintBase {
            constrain(uwpe) {
                var entity = uwpe.entity;
                var entityLoc = GameFramework.Locatable.of(entity).loc;
                var entityVel = entityLoc.vel;
                entityVel.clear();
            }
        }
        GameFramework.Constraint_Stop = Constraint_Stop;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
