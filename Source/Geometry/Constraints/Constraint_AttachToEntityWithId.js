"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_AttachToEntityWithId {
            constructor(targetEntityId) {
                this.targetEntityId = targetEntityId;
            }
            constrain(universe, world, place, entityToConstrain) {
                var targetEntity = place.entityById(this.targetEntityId);
                if (targetEntity != null) {
                    var targetPos = targetEntity.locatable().loc.pos;
                    entityToConstrain.locatable().loc.pos.overwriteWith(targetPos);
                }
            }
        }
        GameFramework.Constraint_AttachToEntityWithId = Constraint_AttachToEntityWithId;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
