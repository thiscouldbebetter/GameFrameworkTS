"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Collision //
         {
            constructor(pos, distanceToCollision, colliders, entitiesColliding) {
                this.pos = pos || GameFramework.Coords.create();
                this.distanceToCollision = distanceToCollision;
                this.colliders = colliders || new Array();
                this.entitiesColliding = entitiesColliding || new Array();
                this.collidersByName = new Map();
                this.normals = [GameFramework.Coords.create(), GameFramework.Coords.create()];
                this.isActive = false;
            }
            static create() {
                return new Collision(GameFramework.Coords.create(), 0, new Array(), new Array());
            }
            static fromPosAndDistance(pos, distance) {
                return new Collision(pos, distance, [], []);
            }
            clear() {
                this.isActive = false;
                GameFramework.ArrayHelper.clear(this.entitiesColliding);
                GameFramework.ArrayHelper.clear(this.colliders);
                this.normals.forEach(x => x.clear());
                this.collidersByName.clear();
                this.distanceToCollision = null;
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
            clone() {
                var returnValue = new Collision(this.pos.clone(), this.distanceToCollision, this.colliders, this.entitiesColliding);
                // hack
                returnValue.collidersByName = this.collidersByName;
                returnValue.normals = GameFramework.ArrayHelper.clone(this.normals);
                returnValue.isActive = this.isActive;
                return returnValue;
            }
        }
        GameFramework.Collision = Collision;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
