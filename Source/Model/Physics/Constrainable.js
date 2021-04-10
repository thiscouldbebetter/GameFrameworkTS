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
            constrain(universe, world, place, entity) {
                var constrainable = entity.constrainable();
                var constraints = constrainable.constraints;
                for (var i = 0; i < constraints.length; i++) {
                    var constraint = constraints[i];
                    constraint.constrain(universe, world, place, entity);
                }
            }
            constraintAdd(constraintToAdd) {
                this.constraints.push(constraintToAdd);
                this._constraintsByClassName.set(constraintToAdd.constructor.name, constraintToAdd);
            }
            constraintByClassName(constraintClassName) {
                return this._constraintsByClassName.get(constraintClassName);
            }
            // EntityProperty.
            finalize(u, w, p, e) { }
            initialize(universe, world, place, entity) {
                this.updateForTimerTick(universe, world, place, entity);
            }
            updateForTimerTick(universe, world, place, entity) {
                this.constrain(universe, world, place, entity);
            }
        }
        GameFramework.Constrainable = Constrainable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
