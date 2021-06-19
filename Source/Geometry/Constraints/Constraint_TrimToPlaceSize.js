"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_TrimToPlaceSize {
            constrain(uwpe) {
                var entityLoc = uwpe.entity.locatable().loc;
                entityLoc.pos.trimToRangeMax(uwpe.place.size);
            }
        }
        GameFramework.Constraint_TrimToPlaceSize = Constraint_TrimToPlaceSize;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
