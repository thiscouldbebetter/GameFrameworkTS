"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Collidable extends GameFramework.EntityPropertyBase {
            constructor(canCollideAgainWithoutSeparating, exemptFromCollisionEffectsOfOther, ticksToWaitBetweenCollisions, colliderAtRest, collidesOnlyWithEntitiesHavingPropertiesNamed, collideEntitiesForUniverseWorldPlaceEntitiesAndCollision) {
                super();
                this.canCollideAgainWithoutSeparating =
                    canCollideAgainWithoutSeparating || false;
                this.exemptFromCollisionEffectsOfOther =
                    exemptFromCollisionEffectsOfOther || false;
                this.ticksToWaitBetweenCollisions =
                    ticksToWaitBetweenCollisions || 0;
                this.colliderAtRestSet(colliderAtRest);
                this.collidesOnlyWithEntitiesHavingPropertiesNamed =
                    collidesOnlyWithEntitiesHavingPropertiesNamed || [Collidable.name];
                this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision =
                    collideEntitiesForUniverseWorldPlaceEntitiesAndCollision;
                this.locPrev = GameFramework.Disposition.create();
                this.ticksUntilCanCollide = 0;
                this._entitiesAlreadyCollidedWith = new Array();
                this.isDisabled = false;
                // Helper variables.
                this._collision = GameFramework.Collision.create();
                this._collisions = new Array();
                this._transformLocate = GameFramework.Transform_Locate.create();
                this._uwpe = GameFramework.UniverseWorldPlaceEntities.create();
            }
            static create() {
                return Collidable.fromCollider(GameFramework.ShapeNone.Instance());
            }
            static default() {
                var collider = GameFramework.BoxAxisAligned.fromSize(GameFramework.Coords.ones().multiplyScalar(10));
                return Collidable.fromColliderAndCollideEntities(collider, Collidable.collideEntitiesForUniverseWorldPlaceEntitiesAndCollisionLog);
            }
            static entitiesFromPlace(place) {
                return place.entitiesByPropertyName(Collidable.name);
            }
            static fromCollider(colliderAtRest) {
                return Collidable.fromColliderAndCollideEntities(colliderAtRest, null);
            }
            static fromColliderAndCollideEntities(colliderAtRest, collideEntities) {
                return new Collidable(false, // canCollideAgainWithoutSeparating
                false, // exemptFromCollisionEffectsOfOther
                0, // ticksToWaitBetweenCollisions
                colliderAtRest, null, // collidesOnlyWithEntitiesHavingPropertiesNamed
                collideEntities);
            }
            static fromColliderAndCollidesOnlyWithEntitiesHavingPropertyNamed(colliderAtRest, collidesOnlyWithEntitiesHavingPropertyNamed) {
                return Collidable.fromColliderCollidesOnlyWithEntitiesHavingPropertyNamedAndCollide(colliderAtRest, collidesOnlyWithEntitiesHavingPropertyNamed, null // collideEntities
                );
            }
            static fromColliderCollidesOnlyWithEntitiesHavingPropertyNamedAndCollide(colliderAtRest, collidesOnlyWithEntitiesHavingPropertyNamed, collideEntities) {
                return Collidable.fromColliderCollidesOnlyWithEntitiesHavingPropertiesNamedAndCollide(colliderAtRest, [collidesOnlyWithEntitiesHavingPropertyNamed], collideEntities);
            }
            static fromColliderCollidesOnlyWithEntitiesHavingPropertiesNamedAndCollide(colliderAtRest, collidesOnlyWithEntitiesHavingPropertiesNamed, collideEntities) {
                return new Collidable(null, // canCollideAgainWithoutSeparating
                null, // exemptFromCollisionEffectsOfOther
                null, // ticksToWaitBetweenCollisions
                colliderAtRest, collidesOnlyWithEntitiesHavingPropertiesNamed, collideEntities);
            }
            static fromColliderPropertyNameAndCollide(colliderAtRest, collidesOnlyWithEntitiesHavingPropertyNamed, collideEntities) {
                return Collidable.fromColliderCollidesOnlyWithEntitiesHavingPropertyNamedAndCollide(colliderAtRest, collidesOnlyWithEntitiesHavingPropertyNamed, collideEntities);
            }
            static fromShape(shapeAtRest) {
                return Collidable.fromColliderAndCollideEntities(shapeAtRest, null);
            }
            static of(entity) {
                return entity.propertyByName(Collidable.name);
            }
            static wereEntitiesAlreadyColliding(entity0, entity1) {
                var collidable0 = Collidable.of(entity0);
                var collidable1 = Collidable.of(entity1);
                var wereEntitiesAlreadyColliding = collidable0.wasAlreadyCollidingWithEntity(entity1)
                    || collidable1.wasAlreadyCollidingWithEntity(entity0);
                return wereEntitiesAlreadyColliding;
            }
            canCollideAgainWithoutSeparatingSet(value) {
                this.canCollideAgainWithoutSeparating = value;
                return this;
            }
            canCollideWithTypeOfEntity(entityOther) {
                var returnValue = this.collidesOnlyWithEntitiesHavingPropertiesNamed.some(propertyName => {
                    var collisionsBetweenEntityTypesAreTracked = (entityOther.propertyByName(propertyName) != null);
                    return collisionsBetweenEntityTypesAreTracked;
                });
                return returnValue;
            }
            collideEntities(entityColliding, entityCollidedWith) {
                var uwpe = this._uwpe.clear().entitySet(entityColliding).entity2Set(entityCollidedWith);
                var collision = this._collision.clear().entityCollidingAdd(entityColliding).entityCollidingAdd(entityCollidedWith);
                var returnValue = this.collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, collision);
                return returnValue;
            }
            collideEntitiesForUniverseWorldPlaceEntities(uwpe) {
                return this.collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, null);
            }
            collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, collision) {
                if (this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision != null) {
                    this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, collision);
                }
                return collision;
            }
            collideEntitiesForUniverseWorldPlaceEntitiesAndCollisionSet(value) {
                this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision = value;
                return this;
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
            colliderAtRestSet(value) {
                this.colliderAtRest = value.clone();
                this.collider = this.colliderAtRest.clone();
                return this;
            }
            colliderLocateForEntity(entity) {
                this.colliderResetToRestPosition();
                var entityLoc = GameFramework.Locatable.of(entity).loc;
                var transform = this._transformLocate;
                transform.loc.overwriteWith(entityLoc);
                this.collider.transform(transform);
            }
            collidesOnlyWithEntitiesHavingPropertyNamedSet(value) {
                this.collidesOnlyWithEntitiesHavingPropertiesNamed = [value];
                return this;
            }
            colliderResetToRestPosition() {
                this.collider.overwriteWith(this.colliderAtRest);
            }
            collisionHandle(uwpe, collision) {
                var collisionShouldBeIgnored = this.collisionShouldBeIgnored(collision);
                if (collisionShouldBeIgnored == false) {
                    var entitiesColliding = collision.entitiesColliding;
                    var entity = entitiesColliding[0];
                    var entityOther = entitiesColliding[1];
                    uwpe.entitySet(entity).entity2Set(entityOther);
                    this.collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, collision);
                    if (this.exemptFromCollisionEffectsOfOther == false) {
                        var entityOtherCollidable = Collidable.of(entityOther);
                        uwpe.entitiesSwap();
                        entityOtherCollidable.collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, collision);
                        uwpe.entitiesSwap();
                    }
                    Collidable.of(entity).entityAlreadyCollidedWithAddIfNotPresent(entityOther);
                    Collidable.of(entityOther).entityAlreadyCollidedWithAddIfNotPresent(entity);
                }
            }
            collisionShouldBeIgnored(collision) {
                var collisionShouldBeIgnored;
                var entityThis = collision.entitiesColliding[0];
                var entityOther = collision.entitiesColliding[1];
                var collidableThis = Collidable.of(entityThis);
                var collidableOther = Collidable.of(entityOther);
                var eitherCollidableIsDisabled = collidableThis.isDisabled
                    || collidableOther.isDisabled;
                if (eitherCollidableIsDisabled) {
                    collisionShouldBeIgnored = true;
                }
                else {
                    var entityThisAndOtherCanEverCollide = collidableThis.canCollideWithTypeOfEntity(entityOther);
                    var entityOtherAndThisCanEverCollide = collidableOther.canCollideWithTypeOfEntity(entityThis);
                    var collisionBetweenEntityTypesCanEverOccur = entityThisAndOtherCanEverCollide
                        || entityOtherAndThisCanEverCollide;
                    if (collisionBetweenEntityTypesCanEverOccur == false) {
                        collisionShouldBeIgnored = true;
                    }
                    else {
                        var eitherCollidableMustCoolDownBeforeCollidingAgain = collidableThis.mustCoolDownBeforeCollidingAgain()
                            || collidableOther.mustCoolDownBeforeCollidingAgain();
                        if (eitherCollidableMustCoolDownBeforeCollidingAgain) {
                            collisionShouldBeIgnored = true;
                        }
                        else {
                            var additionalResponseRequired = this.ongoingCollisionOfCollidablesRequiresAdditionalResponse(entityThis, entityOther);
                            collisionShouldBeIgnored =
                                (additionalResponseRequired == false);
                        }
                    }
                }
                return collisionShouldBeIgnored;
            }
            collisionsFind(uwpe) {
                var collisions = GameFramework.ArrayHelper.clear(this._collisions);
                if (this.isDisabled == false) {
                    var entity = uwpe.entity;
                    var entityLoc = GameFramework.Locatable.of(entity).loc;
                    this.locPrev.overwriteWith(entityLoc);
                    this.colliderLocateForEntity(entity);
                    if (this.ticksUntilCanCollide > 0) {
                        this.ticksUntilCanCollide--;
                    }
                    else {
                        collisions = this.collisionsFindForEntity(uwpe, collisions);
                    }
                }
                return collisions;
            }
            collisionsFindAndHandle(uwpe) {
                var collisions = this.collisionsFind(uwpe);
                this.collisionsHandle(uwpe, collisions);
            }
            collisionsFindForEntity(uwpe, collisionsSoFar) {
                return this.collisionsFindForEntityWithTracker(uwpe, collisionsSoFar);
            }
            collisionsFindForEntityWithTracker(uwpe, collisionsSoFar) {
                var universe = uwpe.universe;
                var entity = uwpe.entity;
                var collisionTracker = GameFramework.CollisionTrackerBase.fromPlace(uwpe);
                collisionTracker.entityReset(entity);
                collisionsSoFar = collisionTracker.entityCollidableAddAndFindCollisions(uwpe, entity, universe.collisionHelper, collisionsSoFar // Sometimes ignored.
                );
                return collisionsSoFar;
            }
            collisionsFindForEntity_WithoutTracker(uwpe, collisionsSoFar) {
                var universe = uwpe.universe;
                var place = uwpe.place;
                var entity = uwpe.entity;
                var collisionHelper = universe.collisionHelper;
                var propertyNames = this.collidesOnlyWithEntitiesHavingPropertiesNamed;
                for (var p = 0; p < propertyNames.length; p++) {
                    var entityPropertyName = propertyNames[p];
                    var entitiesWithProperty = place.entitiesByPropertyName(entityPropertyName);
                    if (entitiesWithProperty != null) {
                        for (var e = 0; e < entitiesWithProperty.length; e++) {
                            var entityOther = entitiesWithProperty[e];
                            if (entityOther != entity) {
                                var doEntitiesCollide = Collidable.doEntitiesCollide(entity, entityOther, collisionHelper);
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
            collisionsHandle(uwpe, collisions) {
                for (var i = 0; i < collisions.length; i++) {
                    var collision = collisions[i];
                    this.collisionHandle(uwpe, collision);
                }
            }
            collisionTrackerCollidableData(collisionTracker) {
                if (this._collisionTrackerCollidableData == null) {
                    this._collisionTrackerCollidableData =
                        collisionTracker.collidableDataCreate();
                }
                return this._collisionTrackerCollidableData;
            }
            disable() {
                this.isDisabled = true;
                return this;
            }
            static doEntitiesCollide(entity0, entity1, collisionHelper) {
                var doEntitiesCollide = false;
                var collidable0Boundable = GameFramework.Boundable.of(entity0);
                var collidable1Boundable = GameFramework.Boundable.of(entity1);
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
                    var collidable0 = Collidable.of(entity0);
                    var collidable1 = Collidable.of(entity1);
                    var collider0 = collidable0.collider;
                    var collider1 = collidable1.collider;
                    doEntitiesCollide =
                        collisionHelper.doCollidersCollide(collider0, collider1);
                }
                return doEntitiesCollide;
            }
            enable() {
                this.isDisabled = false;
                return this;
            }
            entitiesAlreadyCollidedWithClear() {
                this._entitiesAlreadyCollidedWith.length = 0;
            }
            entitiesAlreadyCollidedWithRemoveIfNotInvolvedInAnyCollisions(collisionsToCheck) {
                var entitiesPreviouslyCollidedWith = this._entitiesAlreadyCollidedWith;
                var entitiesNoLongerCollidedWith = new Array();
                for (var i = 0; i < entitiesPreviouslyCollidedWith.length; i++) {
                    var entityPreviouslyCollidedWith = entitiesPreviouslyCollidedWith[i];
                    var entityPreviouslyCollidedWithIsStillBeingCollidedWith = collisionsToCheck.some(x => x.entityIsInvolved(entityPreviouslyCollidedWith));
                    if (entityPreviouslyCollidedWithIsStillBeingCollidedWith == false) {
                        entitiesNoLongerCollidedWith.push(entityPreviouslyCollidedWith);
                    }
                }
                entitiesNoLongerCollidedWith.forEach(x => entitiesPreviouslyCollidedWith.splice(entitiesPreviouslyCollidedWith.indexOf(x), 1));
            }
            entityAlreadyCollidedWithAddIfNotPresent(entityCollidedWith) {
                if (this._entitiesAlreadyCollidedWith.indexOf(entityCollidedWith) == -1) {
                    this._entitiesAlreadyCollidedWith.push(entityCollidedWith);
                }
            }
            entityAlreadyCollidedWithRemove(entityCollidedWith) {
                var index = this._entitiesAlreadyCollidedWith.indexOf(entityCollidedWith);
                if (index >= 0) {
                    this._entitiesAlreadyCollidedWith.splice(index, 1);
                }
            }
            exemptFromCollisionEffectsOfOtherSet(value) {
                this.exemptFromCollisionEffectsOfOther = value;
                return this;
            }
            isEntityStationary(entity) {
                // This way would be better, but it causes strange glitches.
                // In the demo game, when you walk into view of three
                // of the four corners of the 'Battlefield' rooms,
                // the walls shift inward suddenly!
                //return (Locatable.of(entity).loc.equals(this.locPrev));
                return (GameFramework.Movable.of(entity) == null);
            }
            mustCoolDownBeforeCollidingAgain() {
                return (this.ticksUntilCanCollide > 0);
            }
            ongoingCollisionOfCollidablesRequiresAdditionalResponse(entityThis, entityOther) {
                var additionalResponseRequired;
                var collidableThis = Collidable.of(entityThis);
                var collidableOther = Collidable.of(entityOther);
                var eitherCollidableCanCollideAgainWithoutSeparating = collidableThis.canCollideAgainWithoutSeparating
                    || collidableOther.canCollideAgainWithoutSeparating;
                if (eitherCollidableCanCollideAgainWithoutSeparating) {
                    additionalResponseRequired = true;
                }
                else {
                    var ongoingCollisionOfCollidablesHasAlreadyBeenRespondedToOnce = Collidable.wereEntitiesAlreadyColliding(entityThis, entityOther);
                    if (ongoingCollisionOfCollidablesHasAlreadyBeenRespondedToOnce) {
                        additionalResponseRequired = false;
                    }
                    else {
                        additionalResponseRequired = true;
                    }
                }
                return additionalResponseRequired;
            }
            wasAlreadyCollidingWithEntity(entityOther) {
                return (this._entitiesAlreadyCollidedWith.indexOf(entityOther) >= 0);
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) {
                var entity = uwpe.entity;
                // If this isn't done at initialization, then the colliders
                // may be in the wrong positions on the first tick,
                // which leads to false collisions or false misses.
                this.colliderLocateForEntity(entity);
                var entityIsStationary = this.isEntityStationary(entity);
                if (entityIsStationary) {
                    this.collisionsFindAndHandle(uwpe);
                }
            }
            propertyName() { return Collidable.name; }
            updateForTimerTick(uwpe) {
                var entity = uwpe.entity;
                var entityIsStationary = this.isEntityStationary(entity);
                if (entityIsStationary) {
                    this._entitiesAlreadyCollidedWith.length = 0;
                }
                else {
                    this.colliderLocateForEntity(entity);
                    var collisions = this.collisionsFind(uwpe);
                    this.collisionsHandle(uwpe, collisions);
                    this.entitiesAlreadyCollidedWithRemoveIfNotInvolvedInAnyCollisions(collisions);
                }
            }
            // cloneable
            clone() {
                return new Collidable(this.canCollideAgainWithoutSeparating, this.exemptFromCollisionEffectsOfOther, this.ticksToWaitBetweenCollisions, this.colliderAtRest.clone(), this.collidesOnlyWithEntitiesHavingPropertiesNamed, this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision);
            }
            overwriteWith(other) { return this; }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Collidable = Collidable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
