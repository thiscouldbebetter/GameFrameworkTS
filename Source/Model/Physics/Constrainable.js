"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constrainable extends GameFramework.EntityPropertyBase {
            constructor(constraints) {
                super();
                this.constraints = constraints || [];
            }
            static create() {
                return new Constrainable([]);
            }
            static fromConstraint(constraint) {
                return new Constrainable([constraint]);
            }
            static fromConstraints(constraints) {
                return new Constrainable(constraints);
            }
            static of(entity) {
                return entity.propertyByName(Constrainable.name);
            }
            clear() {
                this.constraints.length = 0;
                return this;
            }
            constrain(uwpe) {
                var entity = uwpe.entity;
                var constrainable = Constrainable.of(entity);
                var constraints = constrainable.constraints;
                for (var i = 0; i < constraints.length; i++) {
                    var constraint = constraints[i];
                    constraint.constrain(uwpe);
                }
            }
            constraintAdd(constraintToAdd) {
                this.constraints.push(constraintToAdd);
                return this;
            }
            constraintByClassName(constraintClassName) {
                var constraint = this.constraints.find(x => x.constructor.name == constraintClassName);
                return constraint;
            }
            constraintByName(constraintName) {
                var constraint = this.constraints.find(x => x.name == constraintName);
                return constraint;
            }
            constraintRemove(constraintToRemove) {
                var constraintIndex = this.constraints.indexOf(constraintToRemove);
                this.constraints.splice(constraintIndex, 1);
                return this;
            }
            constraintRemoveByName(constraintToRemoveName) {
                var constraintToRemove = this.constraints.find(x => x.name == constraintToRemoveName);
                return this.constraintRemove(constraintToRemove);
            }
            // EntityProperty.
            initialize(uwpe) {
                this.updateForTimerTick(uwpe);
            }
            updateForTimerTick(uwpe) {
                this.constrain(uwpe);
            }
            // Clonable.
            clone() {
                return new Constrainable(GameFramework.ArrayHelper.clone(this.constraints));
            }
            overwriteWith(other) {
                GameFramework.ArrayHelper.overwriteWith(this.constraints, other.constraints);
                return this;
            }
        }
        GameFramework.Constrainable = Constrainable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
