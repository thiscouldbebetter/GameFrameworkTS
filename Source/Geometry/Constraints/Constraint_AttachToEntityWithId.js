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
                    var targetPos = GameFramework.Locatable.of(targetEntity).loc.pos;
                    GameFramework.Locatable.of(uwpe.entity).loc.pos.overwriteWith(targetPos);
                }
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Constraint_AttachToEntityWithId = Constraint_AttachToEntityWithId;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
