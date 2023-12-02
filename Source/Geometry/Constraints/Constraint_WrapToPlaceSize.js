"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_WrapToPlaceSize {
            constrain(uwpe) {
                var place = uwpe.place;
                var entity = uwpe.entity;
                var entityLoc = entity.locatable().loc;
                var placeSize = place.size();
                entityLoc.pos.wrapToRangeMax(placeSize);
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Constraint_WrapToPlaceSize = Constraint_WrapToPlaceSize;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
