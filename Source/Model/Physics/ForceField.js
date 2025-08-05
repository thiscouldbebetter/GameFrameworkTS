"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ForceField extends GameFramework.EntityPropertyBase {
            constructor(accelerationToApply, velocityToApply) {
                super();
                this.accelerationToApply = accelerationToApply;
                this.velocityToApply = velocityToApply;
            }
            static of(entity) {
                return entity.propertyByName(ForceField.name);
            }
            applyToEntity(entityToApplyTo) {
                var entityLoc = GameFramework.Locatable.of(entityToApplyTo).loc;
                if (this.accelerationToApply != null) {
                    entityLoc.accel.add(this.accelerationToApply);
                }
                if (this.velocityToApply != null) {
                    entityLoc.vel.overwriteWith(this.velocityToApply);
                }
            }
            // Clonable.
            clone() {
                return new ForceField(this.accelerationToApply == null ? null : this.accelerationToApply.clone(), this.velocityToApply = null ? null : this.velocityToApply.clone());
            }
            overwriteWith(other) {
                if (this.accelerationToApply != null) {
                    this.accelerationToApply.overwriteWith(other.accelerationToApply);
                }
                if (this.velocityToApply != null) {
                    this.velocityToApply.overwriteWith(other.velocityToApply);
                }
                return this;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return ForceField.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.ForceField = ForceField;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
