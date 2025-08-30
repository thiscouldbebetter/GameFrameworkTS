"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_TrimToPlaceSize extends GameFramework.ConstraintBase {
            constrain(uwpe) {
                var entityLoc = GameFramework.Locatable.of(uwpe.entity).loc;
                var entityPos = entityLoc.pos;
                var placeSize = uwpe.place.size();
                // Cancel any velocity that attempts to push past the boundary.
                var entityVel = entityLoc.vel;
                if (entityPos.x < 0 && entityVel.x < 0) {
                    entityVel.x = 0;
                }
                else if (entityPos.x > placeSize.x && entityVel.x > 0) {
                    entityVel.x = 0;
                }
                if (entityPos.y < 0 && entityVel.y < 0) {
                    entityVel.y = 0;
                }
                else if (entityPos.y > placeSize.y && entityVel.y > 0) {
                    entityVel.y = 0;
                }
                if (entityPos.z < 0 && entityVel.z < 0) {
                    entityVel.z = 0;
                }
                else if (entityPos.z > placeSize.z && entityVel.z > 0) {
                    entityVel.z = 0;
                }
                entityPos.trimToRangeMax(placeSize);
            }
        }
        GameFramework.Constraint_TrimToPlaceSize = Constraint_TrimToPlaceSize;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
