"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_OrientToward {
            constructor(targetEntityName) {
                this.targetEntityName = targetEntityName;
            }
            constrain(uwpe) {
                var place = uwpe.place;
                var entity = uwpe.entity;
                var targetEntityName = this.targetEntityName;
                var constrainableLoc = entity.locatable().loc;
                var constrainablePos = constrainableLoc.pos;
                var constrainableOrientation = constrainableLoc.orientation;
                var constrainableForward = constrainableOrientation.forward;
                var target = place.entitiesByName.get(targetEntityName);
                var targetPos = target.locatable().loc.pos;
                constrainableForward.overwriteWith(targetPos).subtract(constrainablePos).normalize();
                constrainableOrientation.forwardSet(constrainableForward);
            }
        }
        GameFramework.Constraint_OrientToward = Constraint_OrientToward;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
