"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_WrapXTrimY {
            constrain(universe, world, place, entity) {
                var min = GameFramework.Coords.Instances().Zeroes;
                var max = place.size;
                var entityLoc = entity.locatable().loc;
                var entityPos = entityLoc.pos;
                while (entityPos.x < min.x) {
                    entityPos.x += max.x;
                }
                while (entityPos.x >= max.x) {
                    entityPos.x -= max.x;
                }
                if (entityPos.y < min.y) {
                    entityPos.y = min.y;
                }
                else if (entityPos.y > max.y) {
                    entityPos.y = max.y;
                }
            }
        }
        GameFramework.Constraint_WrapXTrimY = Constraint_WrapXTrimY;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
