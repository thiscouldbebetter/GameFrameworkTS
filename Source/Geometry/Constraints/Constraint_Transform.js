"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_Transform {
            constructor(transformToApply) {
                this.transformToApply = transformToApply;
            }
            static fromTransform(transformToApply) {
                return new Constraint_Transform(transformToApply);
            }
            constrain(uwpe) {
                var constrainablePos = GameFramework.Locatable.of(uwpe.entity).loc.pos;
                this.transformToApply.transformCoords(constrainablePos);
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Constraint_Transform = Constraint_Transform;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
