"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Collision //
         {
            constructor(pos, distanceToCollision, colliders, entitiesColliding) {
                this.pos = pos || Coords.create();
                this.distanceToCollision = distanceToCollision;
                this.colliders = colliders || new Array();
                this.entitiesColliding = entitiesColliding || new Array();
                this.collidersByName = new Map();
                this.normals = [Coords.create(), Coords.create()];
                this.isActive = false;
            }
            static create() {
                return new Collision(null, null, null, null);
            }
            static fromEntitiesColliding(entityColliding, entityCollidedWith) {
                var entitiesColliding = [entityColliding, entityCollidedWith];
                return new Collision(null, null, null, entitiesColliding);
            }
            static fromPosAndDistance(pos, distance) {
                return new Collision(pos, distance, null, null);
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
            entityCollidableAdd(entity) {
                return this.entityCollidingAdd(entity);
            }
            entityCollidingAdd(entity) {
                this.entitiesColliding.push(entity);
                return this;
            }
            entityIsInvolved(entityToCheck) {
                return (this.entitiesColliding.indexOf(entityToCheck) >= 0);
            }
            toString() {
                return this.entitiesColliding.map(x => x.name).join("+");
            }
            // Equatable.
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
            // Clonable.
            clone() {
                var returnValue = new Collision(this.pos.clone(), this.distanceToCollision, this.colliders.map(x => x), this.entitiesColliding.map(x => x));
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
