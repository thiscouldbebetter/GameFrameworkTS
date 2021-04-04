"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_WrapToRange {
            constructor(target) {
                this.target = target;
            }
            constrain(universe, world, place, entity) {
                var targetRange = this.target;
                var entityLoc = entity.locatable().loc;
                entityLoc.pos.wrapToRangeMax(targetRange);
            }
        }
        GameFramework.Constraint_WrapToRange = Constraint_WrapToRange;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
