
namespace ThisCouldBeBetter.GameFramework
{

export class Collidable implements EntityProperty<Collidable>
{
	canCollideAgainWithoutSeparating: boolean;
	ticksToWaitBetweenCollisions: number;
	colliderAtRest: ShapeBase;
	entityPropertyNamesToCollideWith: string[];
	_collideEntities: (uwpe: UniverseWorldPlaceEntities, c: Collision) => void;

	collider: ShapeBase;
	locPrev: Disposition;
	ticksUntilCanCollide: number;
	entitiesAlreadyCollidedWith: Entity[];
	isDisabled: boolean;

	_collisionTrackerMapCellsOccupied: CollisionTrackerMapCell[];
	private _collisions: Collision[];

	constructor
	(
		canCollideAgainWithoutSeparating: boolean,
		ticksToWaitBetweenCollisions: number,
		colliderAtRest: ShapeBase,
		entityPropertyNamesToCollideWith: string[],
		collideEntities: (uwpe: UniverseWorldPlaceEntities, c: Collision) => void
	)
	{
		this.canCollideAgainWithoutSeparating =
			canCollideAgainWithoutSeparating || false;
		this.ticksToWaitBetweenCollisions =
			ticksToWaitBetweenCollisions || 0;
		this.colliderAtRest = colliderAtRest;
		this.entityPropertyNamesToCollideWith =
			entityPropertyNamesToCollideWith || [ Collidable.name ];
		this._collideEntities = collideEntities;

		this.collider = this.colliderAtRest.clone();
		this.locPrev = Disposition.create();
		this.ticksUntilCanCollide = 0;
		this.entitiesAlreadyCollidedWith = new Array<Entity>();
		this.isDisabled = false;

		// Helper variables.

		this._collisionTrackerMapCellsOccupied =
			new Array<CollisionTrackerMapCell>();
		this._collisions = new Array<Collision>();
	}

	static default(): Collidable
	{
		var collider = Box.fromSize
		(
			Coords.ones().multiplyScalar(10)
		);

		return Collidable.fromColliderAndCollideEntities
		(
			collider, Collidable.collideEntitiesInCollisionLog
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

	collideEntitiesInCollision
	(
		uwpe: UniverseWorldPlaceEntities, collision: Collision
	): Collision
	{
		if (this._collideEntities != null)
		{
			this._collideEntities(uwpe, collision);
		}
		return collision;
	}

	static collideEntitiesInCollisionLog
	(
		uwpe: UniverseWorldPlaceEntities, collision: Collision
	): Collision
	{
		var collisionAsString = collision.toString();
		var message = "Collision detected: " + collisionAsString;
		console.log(message);
		return collision;
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

		uwpe.entity = entity;
		uwpe.entity2 = entityOther;

		this.collideEntitiesInCollision
		(
			uwpe, collision
		);

		var entityOtherCollidable = entityOther.collidable();
		uwpe.entitiesSwap();
		entityOtherCollidable.collideEntitiesInCollision
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
				var collisions = this.collisionsFindForEntity
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
		uwpe: UniverseWorldPlaceEntities, collisionsSoFar: Collision[]
	): Collision[]
	{
		var place = uwpe.place;
		var entity = uwpe.entity;

		var collisionTracker = (place as PlaceBase).collisionTracker();
		var entityBoundable = entity.boundable();

		if
		(
			collisionTracker == null
			|| entityBoundable == null
			|| entityBoundable.bounds.constructor.name != Box.name
		)
		{
			collisionsSoFar = this.collisionsFindForEntity_WithoutTracker
			(
				uwpe, collisionsSoFar
			);
		}
		else
		{
			collisionsSoFar = this.collisionsFindForEntity_WithTracker
			(
				uwpe, collisionsSoFar, collisionTracker
			);
		}

		return collisionsSoFar;
	}

	collisionsFindForEntity_WithTracker
	(
		uwpe: UniverseWorldPlaceEntities,
		collisionsSoFar: Collision[], collisionTracker: CollisionTracker
	): Collision[]
	{
		var universe = uwpe.universe;
		var entity = uwpe.entity;

		this._collisionTrackerMapCellsOccupied.forEach
		(
			x => ArrayHelper.remove(x.entitiesPresent, entity)
		);
		this._collisionTrackerMapCellsOccupied.length = 0;

		collisionsSoFar = collisionTracker.entityCollidableAddAndFindCollisions
		(
			entity, universe.collisionHelper, collisionsSoFar
		);
		collisionsSoFar = collisionsSoFar.filter
		(
			collision =>
				this.entityPropertyNamesToCollideWith.some
				(
					propertyName =>
						collision.entitiesColliding[1].propertyByName(propertyName) != null
				)
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

			var isEitherUnboundableOrDoBoundsCollide =
				isEitherUnboundable;

			if (isEitherUnboundable == false)
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
		this.collisionsFindAndHandle(uwpe);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;
		var isStationary = this.isEntityStationary(entity);
		if (isStationary)
		{
			this.entitiesAlreadyCollidedWith.length = 0;
		}
		else
		{
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
			this._collideEntities
		);
	}

	// Equatable

	equals(other: Collidable): boolean { return false; } // todo

}

}
