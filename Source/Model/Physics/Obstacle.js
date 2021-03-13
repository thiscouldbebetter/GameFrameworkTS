"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Obstacle extends GameFramework.EntityProperty {
            constructor() {
                super();
            }
            collide(u, w, p, e, eOther) {
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
        }
        GameFramework.Obstacle = Obstacle;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
