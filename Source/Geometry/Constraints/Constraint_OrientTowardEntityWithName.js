"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_OrientTowardEntityWithName extends GameFramework.ConstraintBase {
            constructor(targetEntityName) {
                super();
                this.targetEntityName = targetEntityName;
            }
            static fromTargetEntityName(targetEntityName) {
                return new Constraint_OrientTowardEntityWithName(targetEntityName);
            }
            constrain(uwpe) {
                var place = uwpe.place;
                var entity = uwpe.entity;
                var targetEntityName = this.targetEntityName;
                var constrainableLoc = GameFramework.Locatable.of(entity).loc;
                var constrainablePos = constrainableLoc.pos;
                var constrainableOri = constrainableLoc.orientation;
                var constrainableForward = constrainableOri.forward;
                var target = place.entityByName(targetEntityName);
                if (target != null) {
                    var targetPos = GameFramework.Locatable.of(target).loc.pos;
                    constrainableForward
                        .overwriteWith(targetPos)
                        .subtract(constrainablePos)
                        .normalize();
                    constrainableOri.forwardSet(constrainableForward);
                }
            }
        }
        GameFramework.Constraint_OrientTowardEntityWithName = Constraint_OrientTowardEntityWithName;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
