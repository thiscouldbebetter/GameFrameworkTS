"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_WrapXTrimY {
            constructor(target) {
                this.target = target;
            }
            constrain(universe, world, place, entity) {
                var entityLoc = entity.locatable().loc;
                var entityPos = entityLoc.pos;
                var max = this.target;
                while (entityPos.x < 0) {
                    entityPos.x += max.x;
                }
                while (entityPos.x >= max.x) {
                    entityPos.x -= max.x;
                }
                if (entityPos.y < 0) {
                    entityPos.y = 0;
                }
                else if (entityPos.y > max.y) {
                    entityPos.y = max.y;
                }
            }
        }
        GameFramework.Constraint_WrapXTrimY = Constraint_WrapXTrimY;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
