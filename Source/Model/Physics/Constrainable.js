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
            clear() {
                this.constraints.length = 0;
                return this;
            }
            constrain(uwpe) {
                var entity = uwpe.entity;
                var constrainable = entity.constrainable();
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
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) {
                this.updateForTimerTick(uwpe);
            }
            updateForTimerTick(uwpe) {
                this.constrain(uwpe);
            }
        }
        GameFramework.Constrainable = Constrainable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
