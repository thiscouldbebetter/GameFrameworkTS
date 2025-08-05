"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Obstacle extends GameFramework.EntityPropertyBase {
            constructor() {
                super();
            }
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
        }
        GameFramework.Obstacle = Obstacle;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
