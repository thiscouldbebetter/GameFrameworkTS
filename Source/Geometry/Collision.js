"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Collision {
            constructor(pos, distanceToCollision, colliders) {
                this.pos = pos || new GameFramework.Coords(0, 0, 0);
                this.distanceToCollision = distanceToCollision;
                this.collidables = [];
                this.colliders = colliders || [];
                this.collidersByName = new Map();
                this.normals = [new GameFramework.Coords(0, 0, 0), new GameFramework.Coords(0, 0, 0)];
                this.isActive = false;
            }
            static create() {
                return new Collision(new GameFramework.Coords(0, 0, 0), null, []);
            }
            clear() {
                this.isActive = false;
                GameFramework.ArrayHelper.clear(this.collidables);
                GameFramework.ArrayHelper.clear(this.colliders);
                this.collidersByName.clear();
                return this;
            }
            equals(other) {
                var returnValue = (this.isActive == other.isActive
                    &&
                        (this.isActive == false
                            ||
                                (this.pos.equals(other.pos)
                                    && this.distanceToCollision == other.distanceToCollision
                                    && GameFramework.ArrayHelper.equals(this.colliders, other.colliders))));
                return returnValue;
            }
        }
        GameFramework.Collision = Collision;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
