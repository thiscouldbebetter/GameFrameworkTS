"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_AttachToEntityWithName extends GameFramework.ConstraintBase {
            constructor(targetEntityName) {
                super();
                this.targetEntityName = targetEntityName;
            }
            static fromTargetEntityName(targetEntityName) {
                return new Constraint_AttachToEntityWithName(targetEntityName);
            }
            constrain(uwpe) {
                var targetEntity = uwpe.place.entityByName(this.targetEntityName);
                if (targetEntity != null) {
                    var targetPos = GameFramework.Locatable.of(targetEntity).loc.pos;
                    var entityToConstrain = uwpe.entity;
                    var entityToConstrainPos = GameFramework.Locatable.of(entityToConstrain).loc.pos;
                    entityToConstrainPos.overwriteWith(targetPos);
                }
            }
        }
        GameFramework.Constraint_AttachToEntityWithName = Constraint_AttachToEntityWithName;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
