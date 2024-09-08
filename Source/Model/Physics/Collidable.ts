
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
	entitiesAlreadyCollidedWith: Entity[];
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
		this.entitiesAlreadyCollidedWith = new Array<Entity>();
		this.isDisabled = false;

		// Helper variables.

		this._collision = Collision.create();
		this._collisions = new Array<Collision>();
		this._uwpe = UniverseWorldPlaceEntities.create();
	}

	static create(): Collidable
	{
		return Collidable.fromCollider(new ShapeNone());
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
		collideEntities: (uwpe: UniverseWorldPlaceEntities, c: Collision)=>void
	): Collidable
	{
		return new Collidable
		(
			false, null, colliderAtRest, null, collideEntities
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

	canCollideAgainWithoutSeparatingSet(value: boolean): Collidable
	{
		this.canCollideAgainWithoutSeparating = value;
		return this;
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
	}

	collisionsFindAndHandle(uwpe: UniverseWorldPlaceEntities): void
	{
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
				var collisions = ArrayHelper.clear(this._collisions);
				collisions = this.collisionsFindForEntity
				(
					uwpe, collisions
				);

				collisions.forEach
				(
					collision => this.collisionHandle(uwpe, collision)
				);
			}
		}
	}

	collisionsFindForEntity
	(
		uwpe: UniverseWorldPlaceEntities,
		collisionsSoFar: Collision[],
	): Collision[]
	{
		var universe = uwpe.universe;
		var world = uwpe.world;
		var place = uwpe.place;
		var entity = uwpe.entity;

		var collisionTracker = (place as PlaceBase).collisionTracker(world);

		collisionTracker.entityReset(entity);

		collisionsSoFar = collisionTracker.entityCollidableAddAndFindCollisions
		(
			entity,
			universe.collisionHelper,
			collisionsSoFar
		);

		var collisionsToIgnore = collisionsSoFar.filter
		(
			collision =>
			{
				var entityThis = collision.entitiesColliding[0];
				var entityOther = collision.entitiesColliding[1];

				var collisionBetweenEntityThisAndOtherShouldBeHandled =
					this.entityPropertyNamesToCollideWith.some
					(
						propertyName =>
						{
							var collisionsBetweenEntityTypesAreTracked =
								(entityOther.propertyByName(propertyName) != null);
							return collisionsBetweenEntityTypesAreTracked;
						}
					);

				var collisionBetweenEntityOtherAndThisShouldBeHandled =
					entityOther.collidable().entityPropertyNamesToCollideWith.some
					(
						propertyName =>
						{
							var collisionsBetweenEntityTypesAreTracked =
								(entityThis.propertyByName(propertyName) != null);
							return collisionsBetweenEntityTypesAreTracked;
						}
					);

				var collisionBetweenEntityTypesShouldBeHandled =
					collisionBetweenEntityThisAndOtherShouldBeHandled
					|| collisionBetweenEntityOtherAndThisShouldBeHandled

				var collisionShouldBeIgnored = 
					(collisionBetweenEntityTypesShouldBeHandled == false);

				return collisionShouldBeIgnored;
			}
		);

		collisionsToIgnore.forEach
		(
			x =>
			{
				var i = collisionsSoFar.indexOf(x);
				collisionsSoFar.splice(i, 1);
			}
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
						var doEntitiesCollide = this.doEntitiesCollide
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

	doEntitiesCollide
	(
		entity0: Entity, entity1: Entity, collisionHelper: CollisionHelper
	): boolean
	{
		var collidable0 = entity0.collidable();
		var collidable1 = entity1.collidable();

		var collidable0EntitiesAlreadyCollidedWith =
			collidable0.entitiesAlreadyCollidedWith;
		var collidable1EntitiesAlreadyCollidedWith =
			collidable1.entitiesAlreadyCollidedWith;

		var doEntitiesCollide = false;

		var canCollidablesCollideYet =
			(
				collidable0.ticksUntilCanCollide <= 0
				&& collidable1.ticksUntilCanCollide <= 0
			);

		if (canCollidablesCollideYet)
		{
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
				var collider0 = collidable0.collider;
				var collider1 = collidable1.collider;

				doEntitiesCollide =
					collisionHelper.doCollidersCollide(collider0, collider1);
			}
		}

		var wereEntitiesAlreadyColliding =
		(
			collidable0EntitiesAlreadyCollidedWith.indexOf(entity1) >= 0
			|| collidable1EntitiesAlreadyCollidedWith.indexOf(entity0) >= 0
		);

		if (doEntitiesCollide)
		{
			if (wereEntitiesAlreadyColliding)
			{
				doEntitiesCollide =
				(
					collidable0.canCollideAgainWithoutSeparating
					|| collidable1.canCollideAgainWithoutSeparating
				);
			}
			else
			{
				this.ticksUntilCanCollide = this.ticksToWaitBetweenCollisions;
				collidable0EntitiesAlreadyCollidedWith.push(entity1);
				collidable1EntitiesAlreadyCollidedWith.push(entity0);
			}
		}
		else if (wereEntitiesAlreadyColliding)
		{
			ArrayHelper.remove(collidable0EntitiesAlreadyCollidedWith, entity1);
			ArrayHelper.remove(collidable1EntitiesAlreadyCollidedWith, entity0);
		}

		return doEntitiesCollide;
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
			this.entitiesAlreadyCollidedWith.length = 0;
		}
		else
		{
			this.colliderLocateForEntity(entity);
			this.collisionsFindAndHandle(uwpe);
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
