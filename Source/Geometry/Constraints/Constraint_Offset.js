"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_Offset {
            constructor(target) {
                this.target = target;
            }
            constrain(universe, world, place, entity) {
                var targetOffset = this.target;
                entity.locatable().loc.pos.add(targetOffset);
            }
        }
        GameFramework.Constraint_Offset = Constraint_Offset;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
