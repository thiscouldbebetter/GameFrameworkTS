"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_TrimToPlaceSizeXY {
            constrain(uwpe) {
                var entityLoc = uwpe.entity.locatable().loc;
                var entityPos = entityLoc.pos;
                entityPos.trimToRangeMaxXY(uwpe.place.size);
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Constraint_TrimToPlaceSizeXY = Constraint_TrimToPlaceSizeXY;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
