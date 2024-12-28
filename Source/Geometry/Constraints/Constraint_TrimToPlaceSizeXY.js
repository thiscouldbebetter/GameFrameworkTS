"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_TrimToPlaceSizeXY {
            constrain(uwpe) {
                var entityLoc = GameFramework.Locatable.of(uwpe.entity).loc;
                var entityPos = entityLoc.pos;
                var placeSize = uwpe.place.size();
                entityPos.trimToRangeMaxXY(placeSize);
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
