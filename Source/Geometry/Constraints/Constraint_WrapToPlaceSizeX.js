"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_WrapToPlaceSizeX {
            constrain(universe, world, place, entity) {
                var placeSize = place.size;
                var entityLoc = entity.locatable().loc;
                var entityPos = entityLoc.pos;
                entityPos.x = GameFramework.NumberHelper.wrapToRangeMax(entityPos.x, placeSize.x);
            }
        }
        GameFramework.Constraint_WrapToPlaceSizeX = Constraint_WrapToPlaceSizeX;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
