
namespace ThisCouldBeBetter.GameFramework
{

export class Collidable implements EntityProperty<Collidable>
{
	canCollideAgainWithoutSeparating: boolean;
	ticksToWaitBetweenCollisions: number;
	colliderAtRest: ShapeBase;
	entityPropertyNamesToCollideWith: string[];
	_collideEntitiesForUniverseWorldPlaceEntitiesAndCollision:
		(uwpe: UniverseWorldPlaceEntities, c: Collision) => void;

	collider: ShapeBase;
	locPrev: Disposition;
	ticksUntilCanCollide: number;
	_entitiesAlreadyCollidedWith: Entity[];
	isDisabled: boolean;

	_collisionTrackerCollidableData: CollisionTrackerCollidableData;
	private _collision: Collision;
	private _collisions: Collision[];
	private _uwpe: UniverseWorldPlaceEntities;

	constructor
	(
		canCollideAgainWithoutSeparating: boolean,
		ticksToWaitBetweenCollisions: number,
		colliderAtRest: ShapeBase,
		entityPropertyNamesToCollideWith: string[],
		collideEntitiesForUniverseWorldPlaceEntitiesAndCollision:
			(uwpe: UniverseWorldPlaceEntities, c: Collision) => void
	)
	{
		this.canCollideAgainWithoutSeparating =
			canCollideAgainWithoutSeparating || false;
		this.ticksToWaitBetweenCollisions =
			ticksToWaitBetweenCollisions || 0;
		this.colliderAtRest = colliderAtRest;
		this.entityPropertyNamesToCollideWith =
			entityPropertyNamesToCollideWith || [ Collidable.name ];
		this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision =
			collideEntitiesForUniverseWorldPlaceEntitiesAndCollision;

		this.collider = this.colliderAtRest.clone();
		this.locPrev = Disposition.create();
		this.ticksUntilCanCollide = 0;
		this._entitiesAlreadyCollidedWith = new Array<Entity>();
		this.isDisabled = false;

		// Helper variables.

		this._collision = Collision.create();
		this._collisions = new Array<Collision>();
		this._uwpe = UniverseWorldPlaceEntities.create();
	}

	static create(): Collidable
	{
		return Collidable.fromCollider(ShapeNone.Instance() );
	}

	static default(): Collidable
	{
		var collider = Box.fromSize
		(
			Coords.ones().multiplyScalar(10)
		);

		return Collidable.fromColliderAndCollideEntities
		(
			collider,
			Collidable.collideEntitiesForUniverseWorldPlaceEntitiesAndCollisionLog
		);
	}

	static fromCollider(colliderAtRest: ShapeBase): Collidable
	{
		return Collidable.fromColliderAndCollideEntities
		(
			colliderAtRest, null
		);
	}

	static fromColliderAndCollideEntities
	(
		colliderAtRest: ShapeBase,
		collideEntities: (uwpe: UniverseWorldPlaceEntities, c: Collision) => void
	): Collidable
	{
		return new Collidable
		(
			false, // canCollideAgainWithoutSeparating
			null, // ticksToWaitBetweenCollisions
			colliderAtRest,
			null, // entityPropertyNamesToCollideWith
			collideEntities
		);
	}

	static from3
	(
		colliderAtRest: ShapeBase,
		entityPropertyNamesToCollideWith: string[],
		collideEntities: (uwpe: UniverseWorldPlaceEntities, c: Collision)=>void
	): Collidable
	{
		return new Collidable
		(
			false, null, colliderAtRest, entityPropertyNamesToCollideWith, collideEntities
		);
	}

	static fromShape(shapeAtRest: ShapeBase): Collidable
	{
		return Collidable.fromColliderAndCollideEntities
		(
			shapeAtRest, null
		);
	}

	static wereEntitiesAlreadyColliding(entity0: Entity, entity1: Entity): boolean
	{
		var collidable0 = entity0.collidable();
		var collidable1 = entity1.collidable();

		var wereEntitiesAlreadyColliding =
			collidable0.wasAlreadyCollidingWithEntity(entity1)
			|| collidable1.wasAlreadyCollidingWithEntity(entity0);

		return wereEntitiesAlreadyColliding;
	}

	canCollideAgainWithoutSeparatingSet(value: boolean): Collidable
	{
		this.canCollideAgainWithoutSeparating = value;
		return this;
	}

	canCollideWithTypeOfEntity(entityOther: Entity): boolean
	{
		var returnValue = this.entityPropertyNamesToCollideWith.some
		(
			propertyName =>
			{
				var collisionsBetweenEntityTypesAreTracked =
					(entityOther.propertyByName(propertyName) != null);
				return collisionsBetweenEntityTypesAreTracked;
			}
		);
		return returnValue;
	}

	collideEntities(entityColliding: Entity, entityCollidedWith: Entity): Collision
	{
		var uwpe = this._uwpe.clear().entitySet
		(
			entityColliding
		).entity2Set
		(
			entityCollidedWith
		);

		var collision =
			this._collision.clear().entityCollidingAdd
			(
				entityColliding
			).entityCollidingAdd
			(
				entityCollidedWith
			);

		var returnValue =
			this.collideEntitiesForUniverseWorldPlaceEntitiesAndCollision
			(
				uwpe, collision
			);

		return returnValue;
	}

	collideEntitiesForUniverseWorldPlaceEntities(uwpe: UniverseWorldPlaceEntities): Collision
	{
		return this.collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, null);
	}

	collideEntitiesForUniverseWorldPlaceEntitiesAndCollision
	(
		uwpe: UniverseWorldPlaceEntities,
		collision: Collision
	): Collision
	{
		if (this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision != null)
		{
			this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, collision);
		}
		return collision;
	}

	collideEntitiesForUniverseWorldPlaceEntitiesAndCollisionSet
	(
		value: (uwpe: UniverseWorldPlaceEntities, c: Collision) => void
	): Collidable
	{
		this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision = value;
		return this;
	}

	collideEntitiesForUniverseWorldPlaceEntitiesAndCollisionWithLogging
	(
		uwpe: UniverseWorldPlaceEntities,
		collision: Collision
	): Collision
	{
		Collidable.collideEntitiesForUniverseWorldPlaceEntitiesAndCollisionLog(uwpe, collision);
		return this.collideEntitiesForUniverseWorldPlaceEntitiesAndCollision(uwpe, collision);
	}

	static collideEntitiesForUniverseWorldPlaceEntitiesAndCollisionLog
	(
		uwpe: UniverseWorldPlaceEntities,
		collision: Collision
	): void
	{
		var collisionAsString = collision.toString();
		var message = "Collision detected: " + collisionAsString;
		console.log(message);
	}

	colliderLocateForEntity(entity: Entity): void
	{
		this.colliderResetToRestPosition();
		var entityLoc = entity.locatable().loc;
		this.collider.locate(entityLoc);
	}

	colliderResetToRestPosition(): void
	{
		this.collider.overwriteWith(this.colliderAtRest);
	}

	collisionHandle(uwpe: UniverseWorldPlaceEntities, collision: Collision): void
	{
		var collisionShouldBeIgnored = this.collisionShouldBeIgnored(collision);

		if (collisionShouldBeIgnored == false)
		{
			var entitiesColliding = collision.entitiesColliding;
			var entity = entitiesColliding[0];
			var entityOther = entitiesColliding[1];

			uwpe.entitySet(entity).entity2Set(entityOther);
			this.collideEntitiesForUniverseWorldPlaceEntitiesAndCollision
			(
				uwpe, collision
			);

			var entityOtherCollidable = entityOther.collidable();
			uwpe.entitiesSwap();
			entityOtherCollidable.collideEntitiesForUniverseWorldPlaceEntitiesAndCollision
			(
				uwpe, collision
			);
			uwpe.entitiesSwap();

			entity.collidable().entityAlreadyCollidedWithAddIfNotPresent(entityOther);
			entityOther.collidable().entityAlreadyCollidedWithAddIfNotPresent(entity);
		}
	}

	collisionShouldBeIgnored(collision: Collision): boolean
	{
		var collisionShouldBeIgnored: boolean;

		var entityThis = collision.entitiesColliding[0];
		var entityOther = collision.entitiesColliding[1];

		var collidableThis = entityThis.collidable();
		var collidableOther = entityOther.collidable();

		var eitherCollidableIsDisabled =
			collidableThis.isDisabled
			|| collidableOther.isDisabled;

		if (eitherCollidableIsDisabled)
		{
			collisionShouldBeIgnored = true;
		}
		else
		{
			var entityThisAndOtherCanEverCollide =
				collidableThis.canCollideWithTypeOfEntity(entityOther);

			var entityOtherAndThisCanEverCollide =
				collidableOther.canCollideWithTypeOfEntity(entityThis);

			var collisionBetweenEntityTypesCanEverOccur =
				entityThisAndOtherCanEverCollide
				|| entityOtherAndThisCanEverCollide;

			if (collisionBetweenEntityTypesCanEverOccur == false)
			{
				collisionShouldBeIgnored = true;
			}
			else
			{
				var eitherCollidableMustCoolDownBeforeCollidingAgain =
					collidableThis.mustCoolDownBeforeCollidingAgain()
					|| collidableOther.mustCoolDownBeforeCollidingAgain();

				if (eitherCollidableMustCoolDownBeforeCollidingAgain)
				{
					collisionShouldBeIgnored = true;
				}
				else
				{
					var additionalResponseRequired =
						this.ongoingCollisionOfCollidablesRequiresAdditionalResponse(entityThis, entityOther);

					collisionShouldBeIgnored =
						(additionalResponseRequired == false);
				}
			}
		}

		return collisionShouldBeIgnored;
	}

	collisionsFind(uwpe: UniverseWorldPlaceEntities): Collision[]
	{
		var collisions = ArrayHelper.clear(this._collisions);

		if (this.isDisabled == false)
		{
			var entity = uwpe.entity;
			var entityLoc = entity.locatable().loc;
			this.locPrev.overwriteWith(entityLoc);

			this.colliderLocateForEntity(entity);

			if (this.ticksUntilCanCollide > 0)
			{
				this.ticksUntilCanCollide--;
			}
			else
			{
				collisions = this.collisionsFindForEntity
				(
					uwpe, collisions
				);
			}
		}

		return collisions;
	}

	collisionsFindAndHandle(uwpe: UniverseWorldPlaceEntities): void
	{
		var collisions = this.collisionsFind(uwpe);
		this.collisionsHandle(uwpe, collisions);
	}

	collisionsFindForEntity
	(
		uwpe: UniverseWorldPlaceEntities,
		collisionsSoFar: Collision[]
	): Collision[]
	{
		return this.collisionsFindForEntityWithTracker(uwpe, collisionsSoFar);
	}

	collisionsFindForEntityWithTracker
	(
		uwpe: UniverseWorldPlaceEntities,
		collisionsSoFar: Collision[]
	): Collision[]
	{
		var universe = uwpe.universe;
		var place = uwpe.place;
		var entity = uwpe.entity;

		var collisionTracker = (place as PlaceBase).collisionTracker(uwpe);

		collisionTracker.entityReset(entity);

		collisionsSoFar = collisionTracker.entityCollidableAddAndFindCollisions
		(
			uwpe,
			entity,
			universe.collisionHelper,
			collisionsSoFar // Sometimes ignored.
		);

		return collisionsSoFar;
	}

	collisionsFindForEntity_WithoutTracker
	(
		uwpe: UniverseWorldPlaceEntities,
		collisionsSoFar: Collision[]
	): Collision[]
	{
		var universe = uwpe.universe;
		var place = uwpe.place;
		var entity = uwpe.entity;

		var collisionHelper = universe.collisionHelper;

		for (var p = 0; p < this.entityPropertyNamesToCollideWith.length; p++)
		{
			var entityPropertyName = this.entityPropertyNamesToCollideWith[p];
			var entitiesWithProperty = place.entitiesByPropertyName(entityPropertyName);
			if (entitiesWithProperty != null)
			{
				for (var e = 0; e < entitiesWithProperty.length; e++)
				{
					var entityOther = entitiesWithProperty[e];
					if (entityOther != entity)
					{
						var doEntitiesCollide = Collidable.doEntitiesCollide
						(
							entity, entityOther, collisionHelper
						);

						if (doEntitiesCollide)
						{
							var collision = collisionHelper.collisionOfEntities
							(
								entity, entityOther, Collision.create()
							);
							collisionsSoFar.push(collision);
						}
					}
				}
			}
		}

		return collisionsSoFar;
	}

	collisionsHandle(uwpe: UniverseWorldPlaceEntities, collisions: Collision[]): void
	{
		collisions.forEach
		(
			collision => this.collisionHandle(uwpe, collision)
		);
	}

	collisionTrackerCollidableData
	(
		collisionTracker: CollisionTracker
	): CollisionTrackerCollidableData
	{
		if (this._collisionTrackerCollidableData == null)
		{
			this._collisionTrackerCollidableData =
				collisionTracker.collidableDataCreate();
		}
		return this._collisionTrackerCollidableData;
	}

	static doEntitiesCollide
	(
		entity0: Entity, entity1: Entity, collisionHelper: CollisionHelper
	): boolean
	{
		var doEntitiesCollide = false;

		var collidable0Boundable = entity0.boundable();
		var collidable1Boundable = entity1.boundable();

		var isEitherUnboundable =
		(
			collidable0Boundable == null
			|| collidable1Boundable == null
		);

		var isEitherUnboundableOrDoBoundsCollide: boolean;

		if (isEitherUnboundable)
		{
			isEitherUnboundableOrDoBoundsCollide = true;
		}
		else
		{
			var doBoundsCollide = collisionHelper.doCollidersCollide
			(
				collidable0Boundable.bounds,
				collidable1Boundable.bounds
			);
			isEitherUnboundableOrDoBoundsCollide = doBoundsCollide;
		}

		if (isEitherUnboundableOrDoBoundsCollide)
		{
			var collidable0 = entity0.collidable();
			var collidable1 = entity1.collidable();

			var collider0 = collidable0.collider;
			var collider1 = collidable1.collider;

			doEntitiesCollide =
				collisionHelper.doCollidersCollide(collider0, collider1);
		}

		return doEntitiesCollide;
	}

	entitiesAlreadyCollidedWithClear(): void
	{
		this._entitiesAlreadyCollidedWith.length = 0;
	}

	entitiesAlreadyCollidedWithRemoveIfNotInvolvedInAnyCollisions(collisionsToCheck: Collision[]): void
	{
		var entitiesPreviouslyCollidedWith = this._entitiesAlreadyCollidedWith;
		var entitiesNoLongerCollidedWith = new Array<Entity>();

		for (var i = 0; i < entitiesPreviouslyCollidedWith.length; i++)
		{
			var entityPreviouslyCollidedWith = entitiesPreviouslyCollidedWith[i];
			var entityPreviouslyCollidedWithIsStillBeingCollidedWith =
				collisionsToCheck.some(x => x.entityIsInvolved(entityPreviouslyCollidedWith) );
			if (entityPreviouslyCollidedWithIsStillBeingCollidedWith == false)
			{
				entitiesNoLongerCollidedWith.push(entityPreviouslyCollidedWith);
			}
		}

		entitiesNoLongerCollidedWith.forEach
		(
			x => entitiesPreviouslyCollidedWith.splice(entitiesPreviouslyCollidedWith.indexOf(x), 1)
		);
	}

	entityAlreadyCollidedWithAddIfNotPresent(entityCollidedWith: Entity): void
	{
		if (this._entitiesAlreadyCollidedWith.indexOf(entityCollidedWith) == -1)
		{
			this._entitiesAlreadyCollidedWith.push(entityCollidedWith);
		}
	}

	entityAlreadyCollidedWithRemove(entityCollidedWith: Entity): void
	{
		var index = this._entitiesAlreadyCollidedWith.indexOf(entityCollidedWith);
		if (index >= 0)
		{
			this._entitiesAlreadyCollidedWith.splice(index, 1);
		}
	}

	isEntityStationary(entity: Entity): boolean
	{
		// This way would be better, but it causes strange glitches.
		// In the demo game, when you walk into view of three
		// of the four corners of the 'Battlefield' rooms,
		// the walls shift inward suddenly!
		//return (entity.locatable().loc.equals(this.locPrev));

		return (entity.movable() == null);
	}

	mustCoolDownBeforeCollidingAgain(): boolean
	{
		return (this.ticksUntilCanCollide > 0);
	}

	ongoingCollisionOfCollidablesRequiresAdditionalResponse
	(
		entityThis: Entity, entityOther: Entity
	): boolean
	{
		var additionalResponseRequired: boolean;

		var collidableThis = entityThis.collidable();
		var collidableOther = entityOther.collidable();

		var eitherCollidableCanCollideAgainWithoutSeparating =
			collidableThis.canCollideAgainWithoutSeparating
			|| collidableOther.canCollideAgainWithoutSeparating;

		if (eitherCollidableCanCollideAgainWithoutSeparating)
		{
			additionalResponseRequired = true;
		}
		else
		{
			var ongoingCollisionOfCollidablesHasAlreadyBeenRespondedToOnce =
				Collidable.wereEntitiesAlreadyColliding(entityThis, entityOther);

			if (ongoingCollisionOfCollidablesHasAlreadyBeenRespondedToOnce)
			{
				additionalResponseRequired = false;
			}
			else
			{
				additionalResponseRequired = true;
			}
		}

		return additionalResponseRequired;
	}

	wasAlreadyCollidingWithEntity(entityOther: Entity): boolean
	{
		return (this._entitiesAlreadyCollidedWith.indexOf(entityOther) >= 0);
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// If this isn't done at initialization, then the colliders
		// may be in the wrong positions on the first tick,
		// which leads to false collisions or false misses.
		this.colliderLocateForEntity(uwpe.entity);

		var entity = uwpe.entity;
		var entityIsStationary = this.isEntityStationary(entity);
		if (entityIsStationary)
		{
			this.collisionsFindAndHandle(uwpe);
		}
	}

	propertyName(): string { return Collidable.name; }

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;
		var entityIsStationary = this.isEntityStationary(entity);
		if (entityIsStationary)
		{
			this._entitiesAlreadyCollidedWith.length = 0;
		}
		else
		{
			this.colliderLocateForEntity(entity);
			var collisions = this.collisionsFind(uwpe);
			this.collisionsHandle(uwpe, collisions);

			this.entitiesAlreadyCollidedWithRemoveIfNotInvolvedInAnyCollisions(collisions);
		}
	}

	// cloneable

	clone(): Collidable
	{
		return new Collidable
		(
			this.canCollideAgainWithoutSeparating,
			this.ticksToWaitBetweenCollisions,
			this.colliderAtRest.clone(),
			this.entityPropertyNamesToCollideWith,
			this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision
		);
	}

	overwriteWith(other: Collidable): Collidable { return this; }

	// Equatable

	equals(other: Collidable): boolean { return false; } // todo

}

}
