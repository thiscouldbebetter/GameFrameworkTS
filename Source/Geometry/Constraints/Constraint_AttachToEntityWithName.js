"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_AttachToEntityWithName {
            constructor(targetEntityName) {
                this.targetEntityName = targetEntityName;
            }
            constrain(universe, world, place, entityToConstrain) {
                var targetEntity = place.entityByName(this.targetEntityName);
                if (targetEntity != null) {
                    var targetPos = targetEntity.locatable().loc.pos;
                    entityToConstrain.locatable().loc.pos.overwriteWith(targetPos);
                }
            }
        }
        GameFramework.Constraint_AttachToEntityWithName = Constraint_AttachToEntityWithName;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
