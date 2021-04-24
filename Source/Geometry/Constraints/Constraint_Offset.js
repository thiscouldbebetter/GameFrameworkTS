"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_Offset {
            constructor(offset) {
                this.offset = offset;
            }
            constrain(universe, world, place, entity) {
                entity.locatable().loc.pos.add(this.offset);
            }
        }
        GameFramework.Constraint_Offset = Constraint_Offset;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
