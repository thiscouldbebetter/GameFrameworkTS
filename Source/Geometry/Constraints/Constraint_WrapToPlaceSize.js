"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_WrapToPlaceSize {
            constrain(universe, world, place, entity) {
                var entityLoc = entity.locatable().loc;
                entityLoc.pos.wrapToRangeMax(place.size);
            }
        }
        GameFramework.Constraint_WrapToPlaceSize = Constraint_WrapToPlaceSize;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
