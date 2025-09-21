
namespace ThisCouldBeBetter.GameFramework
{

export class Collidable extends EntityPropertyBase<Collidable>
{
	canCollideAgainWithoutSeparating: boolean;
	exemptFromCollisionEffectsOfOther: boolean;
	ticksToWaitBetweenCollisions: number;
	colliderAtRest: Shape;
	collidesOnlyWithEntitiesHavingPropertiesNamed: string[];
	_collideEntitiesForUniverseWorldPlaceEntitiesAndCollision:
		(uwpe: UniverseWorldPlaceEntities, c: Collision) => void;

	collider: Shape;
	locPrev: Disposition;
	ticksUntilCanCollide: number;
	_entitiesAlreadyCollidedWith: Entity[];
	isDisabled: boolean;

	_collisionTrackerCollidableData: CollisionTrackerCollidableData;
	private _collision: Collision;
	private _collisions: Collision[];
	private _transformLocate: Transform_Locate;
	private _uwpe: UniverseWorldPlaceEntities;

	constructor
	(
		canCollideAgainWithoutSeparating: boolean,
		exemptFromCollisionEffectsOfOther: boolean,
		ticksToWaitBetweenCollisions: number,
		colliderAtRest: Shape,
		collidesOnlyWithEntitiesHavingPropertiesNamed: string[],
		collideEntitiesForUniverseWorldPlaceEntitiesAndCollision:
			(uwpe: UniverseWorldPlaceEntities, c: Collision) => void
	)
	{
		super();

		this.canCollideAgainWithoutSeparating =
			canCollideAgainWithoutSeparating || false;
		this.exemptFromCollisionEffectsOfOther =
			exemptFromCollisionEffectsOfOther || false;
		this.ticksToWaitBetweenCollisions =
			ticksToWaitBetweenCollisions || 0;
		this.colliderAtRestSet(colliderAtRest);
		this.collidesOnlyWithEntitiesHavingPropertiesNamed =
			collidesOnlyWithEntitiesHavingPropertiesNamed || [ Collidable.name ];
		this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision =
			collideEntitiesForUniverseWorldPlaceEntitiesAndCollision;

		this.locPrev = Disposition.create();
		this.ticksUntilCanCollide = 0;
		this._entitiesAlreadyCollidedWith = new Array<Entity>();
		this.isDisabled = false;

		// Helper variables.

		this._collision = Collision.create();
		this._collisions = new Array<Collision>();
		this._transformLocate = Transform_Locate.create();
		this._uwpe = UniverseWorldPlaceEntities.create();
	}

	static create(): Collidable
	{
		return Collidable.fromCollider(ShapeNone.Instance() );
	}

	static default(): Collidable
	{
		var collider = BoxAxisAligned.fromSize
		(
			Coords.ones().multiplyScalar(10)
		);

		return Collidable.fromColliderAndCollideEntities
		(
			collider,
			Collidable.collideEntitiesForUniverseWorldPlaceEntitiesAndCollisionLog
		);
	}

	static entitiesFromPlace(place: Place): Entity[]
	{
		return place.entitiesByPropertyName(Collidable.name);
	}

	static fromCollider(colliderAtRest: Shape): Collidable
	{
		return Collidable.fromColliderAndCollideEntities
		(
			colliderAtRest, null
		);
	}

	static fromColliderAndCollideEntities
	(
		colliderAtRest: Shape,
		collideEntities: (uwpe: UniverseWorldPlaceEntities, c: Collision) => void
	): Collidable
	{
		return new Collidable
		(
			false, // canCollideAgainWithoutSeparating
			false, // exemptFromCollisionEffectsOfOther
			0, // ticksToWaitBetweenCollisions
			colliderAtRest,
			null, // collidesOnlyWithEntitiesHavingPropertiesNamed
			collideEntities
		);
	}

	static fromColliderAndCollidesOnlyWithEntitiesHavingPropertyNamed
	(
		colliderAtRest: Shape,
		collidesOnlyWithEntitiesHavingPropertyNamed: string
	): Collidable
	{
		return Collidable.fromColliderCollidesOnlyWithEntitiesHavingPropertyNamedAndCollide
		(
			colliderAtRest,
			collidesOnlyWithEntitiesHavingPropertyNamed,
			null // collideEntities
		);
	}

	static fromColliderCollidesOnlyWithEntitiesHavingPropertyNamedAndCollide
	(
		colliderAtRest: Shape,
		collidesOnlyWithEntitiesHavingPropertyNamed: string,
		collideEntities: (uwpe: UniverseWorldPlaceEntities, c: Collision) => void
	): Collidable
	{
		return Collidable.fromColliderCollidesOnlyWithEntitiesHavingPropertiesNamedAndCollide
		(
			colliderAtRest,
			[ collidesOnlyWithEntitiesHavingPropertyNamed ],
			collideEntities
		);
	}

	static fromColliderCollidesOnlyWithEntitiesHavingPropertiesNamedAndCollide
	(
		colliderAtRest: Shape,
		collidesOnlyWithEntitiesHavingPropertiesNamed: string[],
		collideEntities: (uwpe: UniverseWorldPlaceEntities, c: Collision) => void
	): Collidable
	{
		return new Collidable
		(
			null, // canCollideAgainWithoutSeparating
			null, // exemptFromCollisionEffectsOfOther
			null, // ticksToWaitBetweenCollisions
			colliderAtRest,
			collidesOnlyWithEntitiesHavingPropertiesNamed,
			collideEntities
		);
	}

	static fromColliderPropertyNameAndCollide
	(
		colliderAtRest: Shape,
		collidesOnlyWithEntitiesHavingPropertyNamed: string,
		collideEntities: (uwpe: UniverseWorldPlaceEntities, c: Collision) => void
	): Collidable
	{
		return Collidable.fromColliderCollidesOnlyWithEntitiesHavingPropertyNamedAndCollide
		(
			colliderAtRest,
			collidesOnlyWithEntitiesHavingPropertyNamed,
			collideEntities
		);
	}

	static fromColliderPropertyNamesAndCollide
	(
		colliderAtRest: Shape,
		collidesOnlyWithEntitiesHavingPropertiesNamed: string[],
		collideEntities: (uwpe: UniverseWorldPlaceEntities, c: Collision) => void
	): Collidable
	{
		return this.fromColliderCollidesOnlyWithEntitiesHavingPropertiesNamedAndCollide
		(
			colliderAtRest,
			collidesOnlyWithEntitiesHavingPropertiesNamed,
			collideEntities
		);
	}

	static fromShape(shapeAtRest: Shape): Collidable
	{
		return Collidable.fromColliderAndCollideEntities
		(
			shapeAtRest, null
		);
	}

	static of(entity: Entity): Collidable
	{
		return entity.propertyByName(Collidable.name) as Collidable;
	}

	static wereEntitiesAlreadyColliding(entity0: Entity, entity1: Entity): boolean
	{
		var collidable0 = Collidable.of(entity0);
		var collidable1 = Collidable.of(entity1);

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
		var returnValue = this.collidesOnlyWithEntitiesHavingPropertiesNamed.some
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

	colliderAtRestSet(value: Shape): Collidable
	{
		this.colliderAtRest = value.clone();
		this.collider = this.colliderAtRest.clone();
		return this;
	}

	colliderLocateForEntity(entity: Entity): void
	{
		this.colliderResetToRestPosition();
		var entityLoc = Locatable.of(entity).loc;
		var transform = this._transformLocate;
		transform.loc.overwriteWith(entityLoc);
		this.collider.transform(transform);
	}

	collidesOnlyWithEntitiesHavingPropertyNamedSet(value: string): Collidable
	{
		this.collidesOnlyWithEntitiesHavingPropertiesNamed = [value];
		return this;
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

			if (this.exemptFromCollisionEffectsOfOther == false)
			{
				var entityOtherCollidable = Collidable.of(entityOther);
				uwpe.entitiesSwap();
				entityOtherCollidable.collideEntitiesForUniverseWorldPlaceEntitiesAndCollision
				(
					uwpe, collision
				);
				uwpe.entitiesSwap();
			}

			Collidable.of(entity).entityAlreadyCollidedWithAddIfNotPresent(entityOther);
			Collidable.of(entityOther).entityAlreadyCollidedWithAddIfNotPresent(entity);
		}
	}

	collisionShouldBeIgnored(collision: Collision): boolean
	{
		var collisionShouldBeIgnored: boolean;

		var entityThis = collision.entitiesColliding[0];
		var entityOther = collision.entitiesColliding[1];

		var collidableThis = Collidable.of(entityThis);
		var collidableOther = Collidable.of(entityOther);

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
			var entityLoc = Locatable.of(entity).loc;
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
		var entity = uwpe.entity;

		var collisionTracker = CollisionTrackerBase.fromPlace(uwpe);

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

		var propertyNames = this.collidesOnlyWithEntitiesHavingPropertiesNamed;
		for (var p = 0; p < propertyNames.length; p++)
		{
			var entityPropertyName = propertyNames[p];

			var entitiesWithProperty =
				place.entitiesByPropertyName(entityPropertyName);

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
		for (var i = 0; i < collisions.length; i++)
		{
			var collision = collisions[i];
			this.collisionHandle(uwpe, collision);
		}
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

	disable(): Collidable
	{
		this.isDisabled = true;
		return this;
	}

	static doEntitiesCollide
	(
		entity0: Entity, entity1: Entity, collisionHelper: CollisionHelper
	): boolean
	{
		var doEntitiesCollide = false;

		var collidable0Boundable = Boundable.of(entity0);
		var collidable1Boundable = Boundable.of(entity1);

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
			var collidable0 = Collidable.of(entity0);
			var collidable1 = Collidable.of(entity1);

			var collider0 = collidable0.collider;
			var collider1 = collidable1.collider;

			doEntitiesCollide =
				collisionHelper.doCollidersCollide(collider0, collider1);
		}

		return doEntitiesCollide;
	}

	enable(): Collidable
	{
		this.isDisabled = false;
		return this;
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

	exemptFromCollisionEffectsOfOtherSet(value: boolean): Collidable
	{
		this.exemptFromCollisionEffectsOfOther = value;
		return this;
	}

	isEntityStationary(entity: Entity): boolean
	{
		// This way would be better, but it causes strange glitches.
		// In the demo game, when you walk into view of three
		// of the four corners of the 'Battlefield' rooms,
		// the walls shift inward suddenly!
		//return (Locatable.of(entity).loc.equals(this.locPrev));

		return (Movable.of(entity) == null);
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

		var collidableThis = Collidable.of(entityThis);
		var collidableOther = Collidable.of(entityOther);

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

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;

		// If this isn't done at initialization, then the colliders
		// may be in the wrong positions on the first tick,
		// which leads to false collisions or false misses.
		this.colliderLocateForEntity(entity);

		var entityIsStationary = this.isEntityStationary(entity);
		if (entityIsStationary)
		{
			this.collisionsFindAndHandle(uwpe);
		}
	}

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
			this.exemptFromCollisionEffectsOfOther,
			this.ticksToWaitBetweenCollisions,
			this.colliderAtRest.clone(),
			this.collidesOnlyWithEntitiesHavingPropertiesNamed,
			this._collideEntitiesForUniverseWorldPlaceEntitiesAndCollision
		);
	}

}

}
