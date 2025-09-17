"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_AttachToEntityWithId extends GameFramework.ConstraintBase {
            constructor(targetEntityId) {
                super();
                this.targetEntityId = targetEntityId;
            }
            static fromTargetEntityId(targetEntityId) {
                return new Constraint_AttachToEntityWithId(targetEntityId);
            }
            constrain(uwpe) {
                var targetEntity = uwpe.place.entityById(this.targetEntityId);
                if (targetEntity != null) {
                    var entityToConstrain = uwpe.entity;
                    var entityToConstrainPos = GameFramework.Locatable.of(entityToConstrain).loc.pos;
                    var targetPos = GameFramework.Locatable.of(targetEntity).loc.pos;
                    entityToConstrainPos.overwriteWith(targetPos);
                }
            }
        }
        GameFramework.Constraint_AttachToEntityWithId = Constraint_AttachToEntityWithId;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
