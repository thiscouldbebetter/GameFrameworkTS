"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_TrimToPlaceSize {
            constrain(uwpe) {
                var entityLoc = GameFramework.Locatable.of(uwpe.entity).loc;
                var placeSize = uwpe.place.size();
                entityLoc.pos.trimToRangeMax(placeSize);
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Constraint_TrimToPlaceSize = Constraint_TrimToPlaceSize;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
