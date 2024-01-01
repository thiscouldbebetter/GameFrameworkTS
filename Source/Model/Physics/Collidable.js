"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Collidable {
            constructor(canCollideAgainWithoutSeparating, ticksToWaitBetweenCollisions, colliderAtRest, entityPropertyNamesToCollideWith, collideEntitiesForUniverseWorldPlaceEntitiesAndCollision) {
                this.canCollideAgainWithoutSeparating =
                    canCollideAgainWithoutSeparating || false;
                this.ticksToWaitBetweenCollisions =
                    ticksToWaitBetweenCollisions || 0;
                this.colliderAtRest = colliderAtRest;
                this.entityPropertyNamesToCollideWith =
                    entityPropertyNamesToCollideWith || [Collidable.name];
                this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision =
                    collideEntitiesForUniverseWorldPlaceEntitiesAndCollision;
                this.collider = this.colliderAtRest.clone();
                this.locPrev = GameFramework.Disposition.create();
                this.ticksUntilCanCollide = 0;
                this.entitiesAlreadyCollidedWith = new Array();
                this.isDisabled = false;
                // Helper variables.
                this._collisionTrackerMapCellsOccupied =
                    new Array();
                this._collision = GameFramework.Collision.create();
                this._collisions = new Array();
                this._uwpe = GameFramework.UniverseWorldPlaceEntities.create();
            }
            static create() {
                return Collidable.fromCollider(new GameFramework.ShapeNone());
            }
            static default() {
                var collider = GameFramework.Box.fromSize(GameFramework.Coords.ones().multiplyScalar(10));
                return Collidable.fromColliderAndCollideEntities(collider, Collidable.collideEntitiesForUniverseWorldPlaceEntitiesAndCollisionLog);
            }
            static fromCollider(colliderAtRest) {
                return Collidable.fromColliderAndCollideEntities(colliderAtRest, null);
            }
            static fromColliderAndCollideEntities(colliderAtRest, collideEntities) {
                return new Collidable(false, null, colliderAtRest, null, collideEntities);
            }
            static from3(colliderAtRest, entityPropertyNamesToCollideWith, collideEntities) {
                return new Collidable(false, null, colliderAtRest, entityPropertyNamesToCollideWith, collideEntities);
            }
            collideEntities(entityColliding, entityCollidedWith) {
                var uwpe = this._uwpe.clear().entitySet(entityColliding).entity2Set(entityCollidedWith);
                var collision = this._collision.clear().entityCollidableAdd(entityColliding).entityCollidableAdd(entityCollidedWith);
                return this.collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, collision);
            }
            collideEntitiesForUniverseWorldPlaceEntities(uwpe) {
                this.collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, null);
            }
            collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, collision) {
                if (this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision != null) {
                    this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, collision);
                }
                return collision;
            }
            collideEntitiesForUniverseWorldPlaceEntitiesAndCollisionWithLogging(uwpe, collision) {
                Collidable.collideEntitiesForUniverseWorldPlaceEntitiesAndCollisionLog(uwpe, collision);
                return this.collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, collision);
            }
            static collideEntitiesForUniverseWorldPlaceEntitiesAndCollisionLog(uwpe, collision) {
                var collisionAsString = collision.toString();
                var message = "Collision detected: " + collisionAsString;
                console.log(message);
            }
            colliderLocateForEntity(entity) {
                this.colliderResetToRestPosition();
                var entityLoc = entity.locatable().loc;
                this.collider.locate(entityLoc);
            }
            colliderResetToRestPosition() {
                this.collider.overwriteWith(this.colliderAtRest);
            }
            collisionHandle(uwpe, collision) {
                var entitiesColliding = collision.entitiesColliding;
                var entity = entitiesColliding[0];
                var entityOther = entitiesColliding[1];
                uwpe.entitySet(entity).entity2Set(entityOther);
                this.collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, collision);
                var entityOtherCollidable = entityOther.collidable();
                uwpe.entitiesSwap();
                entityOtherCollidable.collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, collision);
                uwpe.entitiesSwap();
            }
            collisionsFindAndHandle(uwpe) {
                if (this.isDisabled == false) {
                    var entity = uwpe.entity;
                    var entityLoc = entity.locatable().loc;
                    this.locPrev.overwriteWith(entityLoc);
                    this.colliderLocateForEntity(entity);
                    if (this.ticksUntilCanCollide > 0) {
                        this.ticksUntilCanCollide--;
                    }
                    else {
                        var collisions = GameFramework.ArrayHelper.clear(this._collisions);
                        collisions = this.collisionsFindForEntity(uwpe, collisions);
                        collisions.forEach(collision => this.collisionHandle(uwpe, collision));
                    }
                }
            }
            collisionsFindForEntity(uwpe, collisionsSoFar) {
                var place = uwpe.place;
                var entity = uwpe.entity;
                var collisionTracker = place.collisionTracker();
                var entityBoundable = entity.boundable();
                if (collisionTracker == null
                    || entityBoundable == null
                    || entityBoundable.bounds.constructor.name != GameFramework.Box.name) {
                    collisionsSoFar = this.collisionsFindForEntity_WithoutTracker(uwpe, collisionsSoFar);
                }
                else {
                    collisionsSoFar = this.collisionsFindForEntity_WithTracker(uwpe, collisionsSoFar, collisionTracker);
                }
                return collisionsSoFar;
            }
            collisionsFindForEntity_WithTracker(uwpe, collisionsSoFar, collisionTracker) {
                var universe = uwpe.universe;
                var entity = uwpe.entity;
                this._collisionTrackerMapCellsOccupied.forEach(x => GameFramework.ArrayHelper.remove(x.entitiesPresent, entity));
                this._collisionTrackerMapCellsOccupied.length = 0;
                collisionsSoFar = collisionTracker.entityCollidableAddAndFindCollisions(entity, universe.collisionHelper, collisionsSoFar);
                collisionsSoFar = collisionsSoFar.filter(collision => this.entityPropertyNamesToCollideWith.some(propertyName => collision.entitiesColliding[1].propertyByName(propertyName) != null));
                return collisionsSoFar;
            }
            collisionsFindForEntity_WithoutTracker(uwpe, collisionsSoFar) {
                var universe = uwpe.universe;
                var place = uwpe.place;
                var entity = uwpe.entity;
                var collisionHelper = universe.collisionHelper;
                for (var p = 0; p < this.entityPropertyNamesToCollideWith.length; p++) {
                    var entityPropertyName = this.entityPropertyNamesToCollideWith[p];
                    var entitiesWithProperty = place.entitiesByPropertyName(entityPropertyName);
                    if (entitiesWithProperty != null) {
                        for (var e = 0; e < entitiesWithProperty.length; e++) {
                            var entityOther = entitiesWithProperty[e];
                            if (entityOther != entity) {
                                var doEntitiesCollide = this.doEntitiesCollide(entity, entityOther, collisionHelper);
                                if (doEntitiesCollide) {
                                    var collision = collisionHelper.collisionOfEntities(entity, entityOther, GameFramework.Collision.create());
                                    collisionsSoFar.push(collision);
                                }
                            }
                        }
                    }
                }
                return collisionsSoFar;
            }
            doEntitiesCollide(entity0, entity1, collisionHelper) {
                var collidable0 = entity0.collidable();
                var collidable1 = entity1.collidable();
                var collidable0EntitiesAlreadyCollidedWith = collidable0.entitiesAlreadyCollidedWith;
                var collidable1EntitiesAlreadyCollidedWith = collidable1.entitiesAlreadyCollidedWith;
                var doEntitiesCollide = false;
                var canCollidablesCollideYet = (collidable0.ticksUntilCanCollide <= 0
                    && collidable1.ticksUntilCanCollide <= 0);
                if (canCollidablesCollideYet) {
                    var collidable0Boundable = entity0.boundable();
                    var collidable1Boundable = entity1.boundable();
                    var isEitherUnboundable = (collidable0Boundable == null
                        || collidable1Boundable == null);
                    var isEitherUnboundableOrDoBoundsCollide;
                    if (isEitherUnboundable) {
                        isEitherUnboundableOrDoBoundsCollide = true;
                    }
                    else {
                        var doBoundsCollide = collisionHelper.doCollidersCollide(collidable0Boundable.bounds, collidable1Boundable.bounds);
                        isEitherUnboundableOrDoBoundsCollide = doBoundsCollide;
                    }
                    if (isEitherUnboundableOrDoBoundsCollide) {
                        var collider0 = collidable0.collider;
                        var collider1 = collidable1.collider;
                        doEntitiesCollide =
                            collisionHelper.doCollidersCollide(collider0, collider1);
                    }
                }
                var wereEntitiesAlreadyColliding = (collidable0EntitiesAlreadyCollidedWith.indexOf(entity1) >= 0
                    || collidable1EntitiesAlreadyCollidedWith.indexOf(entity0) >= 0);
                if (doEntitiesCollide) {
                    if (wereEntitiesAlreadyColliding) {
                        doEntitiesCollide =
                            (collidable0.canCollideAgainWithoutSeparating
                                || collidable1.canCollideAgainWithoutSeparating);
                    }
                    else {
                        this.ticksUntilCanCollide = this.ticksToWaitBetweenCollisions;
                        collidable0EntitiesAlreadyCollidedWith.push(entity1);
                        collidable1EntitiesAlreadyCollidedWith.push(entity0);
                    }
                }
                else if (wereEntitiesAlreadyColliding) {
                    GameFramework.ArrayHelper.remove(collidable0EntitiesAlreadyCollidedWith, entity1);
                    GameFramework.ArrayHelper.remove(collidable1EntitiesAlreadyCollidedWith, entity0);
                }
                return doEntitiesCollide;
            }
            isEntityStationary(entity) {
                // This way would be better, but it causes strange glitches.
                // In the demo game, when you walk into view of three
                // of the four corners of the 'Battlefield' rooms,
                // the walls shift inward suddenly!
                //return (entity.locatable().loc.equals(this.locPrev));
                return (entity.movable() == null);
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) {
                // This causes problems sometimes.
                // this.collisionsFindAndHandle(uwpe);
            }
            updateForTimerTick(uwpe) {
                var entity = uwpe.entity;
                var isStationary = this.isEntityStationary(entity);
                if (isStationary) {
                    this.entitiesAlreadyCollidedWith.length = 0;
                }
                else {
                    this.colliderLocateForEntity(entity);
                    this.collisionsFindAndHandle(uwpe);
                }
            }
            // cloneable
            clone() {
                return new Collidable(this.canCollideAgainWithoutSeparating, this.ticksToWaitBetweenCollisions, this.colliderAtRest.clone(), this.entityPropertyNamesToCollideWith, this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision);
            }
            overwriteWith(other) { return this; }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Collidable = Collidable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
