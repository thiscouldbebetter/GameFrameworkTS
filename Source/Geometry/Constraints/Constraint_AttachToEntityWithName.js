"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_AttachToEntityWithName {
            constructor(targetEntityName) {
                this.targetEntityName = targetEntityName;
            }
            constrain(uwpe) {
                var place = uwpe.place;
                var entity = uwpe.entity;
                var targetEntity = place.entityByName(this.targetEntityName);
                if (targetEntity != null) {
                    var targetPos = targetEntity.locatable().loc.pos;
                    entity.locatable().loc.pos.overwriteWith(targetPos);
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
        GameFramework.Constraint_AttachToEntityWithName = Constraint_AttachToEntityWithName;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
