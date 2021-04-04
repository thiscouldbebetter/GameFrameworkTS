"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_TrimToRange {
            constructor(target) {
                this.target = target;
            }
            constrain(universe, world, place, entity) {
                var targetSize = this.target;
                var entityLoc = entity.locatable().loc;
                entityLoc.pos.trimToRangeMax(targetSize);
            }
        }
        GameFramework.Constraint_TrimToRange = Constraint_TrimToRange;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
