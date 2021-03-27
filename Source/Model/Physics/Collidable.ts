
namespace ThisCouldBeBetter.GameFramework
{

export class Collidable extends EntityProperty
{
	ticksToWaitBetweenCollisions: number;
	colliderAtRest: any;
	entityPropertyNamesToCollideWith: string[];
	_collideEntities: (u: Universe, w: World, p: Place, e0: Entity, e1: Entity, c: Collision) => void;

	collider: ShapeBase;
	locPrev: Disposition;
	ticksUntilCanCollide: number;
	entitiesAlreadyCollidedWith: Entity[];
	isDisabled: boolean;

	private _collisions: Collision[];

	constructor
	(
		ticksToWaitBetweenCollisions: number,
		colliderAtRest: ShapeBase,
		entityPropertyNamesToCollideWith: string[],
		collideEntities: (u: Universe, w: World, p: Place, e0: Entity, e1: Entity, c: Collision) => void
	)
	{
		super();
		this.ticksToWaitBetweenCollisions = ticksToWaitBetweenCollisions || 0;
		this.colliderAtRest = colliderAtRest;
		this.entityPropertyNamesToCollideWith = entityPropertyNamesToCollideWith || [];
		this._collideEntities = collideEntities;

		this.collider = this.colliderAtRest.clone();
		this.locPrev = Disposition.create();
		this.ticksUntilCanCollide = 0;
		this.entitiesAlreadyCollidedWith = new Array<Entity>();
		this.isDisabled = false;

		// Helper variables.

		this._collisions = new Array<Collision>();
	}

	static fromCollider(colliderAtRest: ShapeBase): Collidable
	{
		return new Collidable(null, colliderAtRest, null, null);
	}

	collideEntities(u: Universe, w: World, p: Place, e0: Entity, e1: Entity, c: Collision): Collision
	{
		if (this._collideEntities != null)
		{
			this._collideEntities(u, w, p, e0, e1, c);
		}
		return c;
	}

	colliderLocateForEntity(entity: Entity): void
	{
		this.collider.overwriteWith(this.colliderAtRest);
		this.collider.locate(entity.locatable().loc);
	}

	collisionsFindForEntity
	(
		universe: Universe, world: World, place: Place, entity: Entity,
		collisionsSoFar: Collision[]
	): Collision[]
	{
		var collisionTracker = place.collisionTracker();
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
				universe, world, place, entity, collisionsSoFar
			);
		}
		else
		{
			collisionsSoFar = this.collisionsFindForEntity_WithTracker
			(
				universe, world, place, entity, collisionsSoFar, collisionTracker
			);
		}

		return collisionsSoFar;
	}

	collisionsFindForEntity_WithTracker
	(
		universe: Universe, world: World, place: Place, entity: Entity,
		collisionsSoFar: Collision[], collisionTracker: CollisionTracker
	): Collision[]
	{
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
		universe: Universe, world: World, place: Place, entity: Entity,
		collisionsSoFar: Collision[]
	): Collision[]
	{
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

	collisionHandle(universe: Universe, world: World, place: Place, collision: Collision): void
	{
		var entitiesColliding = collision.entitiesColliding;
		var entity = entitiesColliding[0];
		var entityOther = entitiesColliding[1];

		this.collideEntities
		(
			universe, world, place, entity, entityOther, collision
		);

		var entityOtherCollidable = entityOther.collidable();
		entityOtherCollidable.collideEntities
		(
			universe, world, place, entityOther, entity, collision
		);
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
			var isEitherUnboundableOrDoBoundsCollide =
			(
				collidable0Boundable == null
				|| collidable1Boundable == null
				|| collisionHelper.doCollidersCollide(collidable0Boundable.bounds, collidable1Boundable.bounds)
			);

			if (isEitherUnboundableOrDoBoundsCollide)
			{
				var collider0 = collidable0.collider;
				var collider1 = collidable1.collider;

				doEntitiesCollide = collisionHelper.doCollidersCollide(collider0, collider1);
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
				doEntitiesCollide = false;
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

	initialize(universe: Universe, world: World, place: Place, entity: Entity)
	{
		this.colliderLocateForEntity(entity);
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		if (this.isDisabled == false)
		{
			var entityLoc = entity.locatable().loc;
			this.locPrev.overwriteWith(entityLoc);

			if (this.ticksUntilCanCollide > 0)
			{
				this.ticksUntilCanCollide--;
			}
			else
			{
				this.colliderLocateForEntity(entity);

				var collisions = this.collisionsFindForEntity
				(
					universe, world, place, entity, ArrayHelper.clear(this._collisions)
				);

				collisions.forEach
				(
					collision => this.collisionHandle(universe, world, place, collision)
				);
			}
		}
	}

	// cloneable

	clone()
	{
		return new Collidable
		(
			this.ticksToWaitBetweenCollisions,
			this.colliderAtRest.clone(),
			this.entityPropertyNamesToCollideWith,
			this._collideEntities
		);
	}
}

}
