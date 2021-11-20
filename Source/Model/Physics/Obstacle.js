"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Obstacle {
            collide(uwpe) {
                var u = uwpe.universe;
                var e = uwpe.entity;
                var eOther = uwpe.entity2;
                var collisionHelper = u.collisionHelper;
                collisionHelper.collideEntitiesBounce(e, eOther);
                collisionHelper.collideEntitiesSeparate(eOther, e);
            }
            // Clonable.
            clone() {
                return this;
            }
            overwriteWith(other) {
                return this;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Obstacle = Obstacle;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
