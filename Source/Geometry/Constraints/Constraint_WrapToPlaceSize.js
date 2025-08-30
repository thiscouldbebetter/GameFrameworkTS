"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_WrapToPlaceSize extends GameFramework.ConstraintBase {
            static create() {
                return new Constraint_WrapToPlaceSize();
            }
            constrain(uwpe) {
                var place = uwpe.place;
                var entity = uwpe.entity;
                var entityLoc = GameFramework.Locatable.of(entity).loc;
                var placeSize = place.size();
                entityLoc.pos.wrapToRangeMax(placeSize);
            }
        }
        GameFramework.Constraint_WrapToPlaceSize = Constraint_WrapToPlaceSize;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
