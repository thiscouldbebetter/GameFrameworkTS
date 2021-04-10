"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_WrapToPlaceSizeXTrimY {
            constrain(universe, world, place, entity) {
                var placeSize = place.size;
                var entityLoc = entity.locatable().loc;
                var entityPos = entityLoc.pos;
                entityPos.x = GameFramework.NumberHelper.wrapToRangeMax(entityPos.x, placeSize.x);
                entityPos.y = GameFramework.NumberHelper.trimToRangeMax(entityPos.y, placeSize.y);
            }
        }
        GameFramework.Constraint_WrapToPlaceSizeXTrimY = Constraint_WrapToPlaceSizeXTrimY;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
