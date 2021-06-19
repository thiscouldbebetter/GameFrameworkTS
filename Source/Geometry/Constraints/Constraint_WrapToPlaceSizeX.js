"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_WrapToPlaceSizeX {
            constrain(uwpe) {
                var place = uwpe.place;
                var entity = uwpe.entity;
                var placeSize = place.size;
                var entityLoc = entity.locatable().loc;
                var entityPos = entityLoc.pos;
                entityPos.x = GameFramework.NumberHelper.wrapToRangeMax(entityPos.x, placeSize.x);
            }
        }
        GameFramework.Constraint_WrapToPlaceSizeX = Constraint_WrapToPlaceSizeX;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
