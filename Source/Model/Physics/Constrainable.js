"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constrainable {
            constructor(constraints) {
                this.constraints = constraints || [];
                this._constraintsByClassName =
                    GameFramework.ArrayHelper.addLookups(this.constraints, x => x.constructor.name);
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
                this._constraintsByClassName.clear();
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
                this._constraintsByClassName.set(constraintToAdd.constructor.name, constraintToAdd);
                return this;
            }
            constraintByClassName(constraintClassName) {
                return this._constraintsByClassName.get(constraintClassName);
            }
            constraintRemove(constraintToRemove) {
                var constraintIndex = this.constraints.indexOf(constraintToRemove);
                this.constraints.splice(constraintIndex, 1);
                var constraintClassName = constraintToRemove.constructor.name;
                this._constraintsByClassName.delete(constraintClassName);
                return this;
            }
            constraintRemoveFinal() {
                var constraintToRemove = this.constraints[this.constraints.length - 1];
                return this.constraintRemove(constraintToRemove);
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) {
                this.updateForTimerTick(uwpe);
            }
            propertyName() { return Constrainable.name; }
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
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Constrainable = Constrainable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
