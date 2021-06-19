"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_AttachToEntityWithId {
            constructor(targetEntityId) {
                this.targetEntityId = targetEntityId;
            }
            constrain(uwpe) {
                var targetEntity = uwpe.place.entityById(this.targetEntityId);
                if (targetEntity != null) {
                    var targetPos = targetEntity.locatable().loc.pos;
                    uwpe.entity.locatable().loc.pos.overwriteWith(targetPos);
                }
            }
        }
        GameFramework.Constraint_AttachToEntityWithId = Constraint_AttachToEntityWithId;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
