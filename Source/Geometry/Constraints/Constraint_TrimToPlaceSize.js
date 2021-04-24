"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_TrimToPlaceSize {
            constrain(universe, world, place, entity) {
                var entityLoc = entity.locatable().loc;
                entityLoc.pos.trimToRangeMax(place.size);
            }
        }
        GameFramework.Constraint_TrimToPlaceSize = Constraint_TrimToPlaceSize;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
