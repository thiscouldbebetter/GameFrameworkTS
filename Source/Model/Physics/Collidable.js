"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Collidable extends GameFramework.EntityProperty {
            constructor(ticksToWaitBetweenCollisions, colliderAtRest, entityPropertyNamesToCollideWith, collideEntities) {
                super();
                this.ticksToWaitBetweenCollisions = ticksToWaitBetweenCollisions || 0;
                this.colliderAtRest = colliderAtRest;
                this.entityPropertyNamesToCollideWith = entityPropertyNamesToCollideWith || [];
                this._collideEntities = collideEntities;
                this.collider = this.colliderAtRest.clone();
                this.locPrev = GameFramework.Disposition.create();
                this.ticksUntilCanCollide = 0;
                this.entitiesAlreadyCollidedWith = new Array();
                this.isDisabled = false;
                // Helper variables.
                this._collisionTrackerMapCellsOccupied =
                    new Array();
                this._collisions = new Array();
            }
            static fromCollider(colliderAtRest) {
                return new Collidable(null, colliderAtRest, null, null);
            }
            static fromColliderAndCollideEntities(colliderAtRest, collideEntities) {
                return new Collidable(null, colliderAtRest, null, collideEntities);
            }
            collideEntities(u, w, p, e0, e1, c) {
                if (this._collideEntities != null) {
                    this._collideEntities(u, w, p, e0, e1, c);
                }
                return c;
            }
            colliderLocateForEntity(entity) {
                this.collider.overwriteWith(this.colliderAtRest);
                this.collider.locate(entity.locatable().loc);
            }
            collisionHandle(universe, world, place, collision) {
                var entitiesColliding = collision.entitiesColliding;
                var entity = entitiesColliding[0];
                var entityOther = entitiesColliding[1];
                this.collideEntities(universe, world, place, entity, entityOther, collision);
                var entityOtherCollidable = entityOther.collidable();
                entityOtherCollidable.collideEntities(universe, world, place, entityOther, entity, collision);
            }
            collisionsFindAndHandle(universe, world, place, entity) {
                if (this.isDisabled == false) {
                    var entityLoc = entity.locatable().loc;
                    this.locPrev.overwriteWith(entityLoc);
                    if (this.ticksUntilCanCollide > 0) {
                        this.ticksUntilCanCollide--;
                    }
                    else {
                        this.colliderLocateForEntity(entity);
                        var collisions = this.collisionsFindForEntity(universe, world, place, entity, GameFramework.ArrayHelper.clear(this._collisions));
                        collisions.forEach(collision => this.collisionHandle(universe, world, place, collision));
                    }
                }
            }
            collisionsFindForEntity(universe, world, place, entity, collisionsSoFar) {
                var collisionTracker = place.collisionTracker();
                var entityBoundable = entity.boundable();
                if (collisionTracker == null
                    || entityBoundable == null
                    || entityBoundable.bounds.constructor.name != GameFramework.Box.name) {
                    collisionsSoFar = this.collisionsFindForEntity_WithoutTracker(universe, world, place, entity, collisionsSoFar);
                }
                else {
                    collisionsSoFar = this.collisionsFindForEntity_WithTracker(universe, world, place, entity, collisionsSoFar, collisionTracker);
                }
                return collisionsSoFar;
            }
            collisionsFindForEntity_WithTracker(universe, world, place, entity, collisionsSoFar, collisionTracker) {
                this._collisionTrackerMapCellsOccupied.forEach(x => GameFramework.ArrayHelper.remove(x.entitiesPresent, entity));
                this._collisionTrackerMapCellsOccupied.length = 0;
                collisionsSoFar = collisionTracker.entityCollidableAddAndFindCollisions(entity, universe.collisionHelper, collisionsSoFar);
                collisionsSoFar = collisionsSoFar.filter(collision => this.entityPropertyNamesToCollideWith.some(propertyName => collision.entitiesColliding[1].propertyByName(propertyName) != null));
                return collisionsSoFar;
            }
            collisionsFindForEntity_WithoutTracker(universe, world, place, entity, collisionsSoFar) {
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
                    var isEitherUnboundableOrDoBoundsCollide = (collidable0Boundable == null
                        || collidable1Boundable == null
                        || collisionHelper.doCollidersCollide(collidable0Boundable.bounds, collidable1Boundable.bounds));
                    if (isEitherUnboundableOrDoBoundsCollide) {
                        var collider0 = collidable0.collider;
                        var collider1 = collidable1.collider;
                        doEntitiesCollide = collisionHelper.doCollidersCollide(collider0, collider1);
                    }
                }
                var wereEntitiesAlreadyColliding = (collidable0EntitiesAlreadyCollidedWith.indexOf(entity1) >= 0
                    || collidable1EntitiesAlreadyCollidedWith.indexOf(entity0) >= 0);
                if (doEntitiesCollide) {
                    if (wereEntitiesAlreadyColliding) {
                        doEntitiesCollide = false;
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
            initialize(universe, world, place, entity) {
                if (this.isEntityStationary(entity)) {
                    this.collisionsFindAndHandle(universe, world, place, entity);
                }
            }
            updateForTimerTick(universe, world, place, entity) {
                if (this.isEntityStationary(entity)) {
                    this.entitiesAlreadyCollidedWith.length = 0;
                }
                else {
                    this.collisionsFindAndHandle(universe, world, place, entity);
                }
            }
            // cloneable
            clone() {
                return new Collidable(this.ticksToWaitBetweenCollisions, this.colliderAtRest.clone(), this.entityPropertyNamesToCollideWith, this._collideEntities);
            }
        }
        GameFramework.Collidable = Collidable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
