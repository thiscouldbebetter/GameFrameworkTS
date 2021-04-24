"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_StopBelowSpeedMin {
            constructor(target) {
                this.target = target;
            }
            constrain(universe, world, place, entity) {
                var targetSpeedMin = this.target;
                var entityLoc = entity.locatable().loc;
                var entityVel = entityLoc.vel;
                var speed = entityVel.magnitude();
                if (speed < targetSpeedMin) {
                    entityVel.clear();
                }
            }
        }
        GameFramework.Constraint_StopBelowSpeedMin = Constraint_StopBelowSpeedMin;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
