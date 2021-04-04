"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_ContainInBox {
            constructor(boxToContainWithin) {
                this.boxToContainWithin = boxToContainWithin;
            }
            constrain(universe, world, place, entity) {
                this.boxToContainWithin.trimCoords(entity.locatable().loc.pos);
            }
        }
        GameFramework.Constraint_ContainInBox = Constraint_ContainInBox;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
