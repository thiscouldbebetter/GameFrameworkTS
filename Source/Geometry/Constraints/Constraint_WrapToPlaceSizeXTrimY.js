"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_WrapToPlaceSizeXTrimY extends GameFramework.ConstraintBase {
            static create() {
                return new Constraint_WrapToPlaceSizeXTrimY();
            }
            constrain(uwpe) {
                var place = uwpe.place;
                var entity = uwpe.entity;
                var placeSize = place.size();
                var entityLoc = GameFramework.Locatable.of(entity).loc;
                var entityPos = entityLoc.pos;
                // Cancel any velocity that attempts to push past the boundary.
                var entityVel = entityLoc.vel;
                if (entityPos.y < 0 && entityVel.y < 0) {
                    entityVel.y = 0;
                }
                else if (entityPos.y > placeSize.y && entityVel.y > 0) {
                    entityVel.y = 0;
                }
                entityPos.x = GameFramework.NumberHelper.wrapToRangeMax(entityPos.x, placeSize.x);
                entityPos.y = GameFramework.NumberHelper.trimToRangeMax(entityPos.y, placeSize.y);
            }
        }
        GameFramework.Constraint_WrapToPlaceSizeXTrimY = Constraint_WrapToPlaceSizeXTrimY;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
