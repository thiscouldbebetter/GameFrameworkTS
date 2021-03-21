"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constrainable extends GameFramework.EntityProperty {
            constructor(constraints) {
                super();
                this.constraints = constraints;
                this._constraintsByClassName =
                    GameFramework.ArrayHelper.addLookups(this.constraints, x => x.constructor.name);
            }
            static constrain(universe, world, place, entity) {
                var constrainable = entity.constrainable();
                var constraints = constrainable.constraints;
                for (var i = 0; i < constraints.length; i++) {
                    var constraint = constraints[i];
                    constraint.constrain(universe, world, place, entity);
                }
            }
            constraintByClassName(constraintClassName) {
                return this._constraintsByClassName.get(constraintClassName);
            }
            initialize(universe, world, place, entity) {
                this.updateForTimerTick(universe, world, place, entity);
            }
            updateForTimerTick(universe, world, place, entity) {
                Constrainable.constrain(universe, world, place, entity);
            }
        }
        GameFramework.Constrainable = Constrainable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
