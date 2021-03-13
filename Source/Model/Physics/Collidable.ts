
namespace ThisCouldBeBetter.GameFramework
{

export class Collidable extends EntityProperty
{
	ticksToWaitBetweenCollisions: number;
	colliderAtRest: any;
	entityPropertyNamesToCollideWith: string[];
	_collideEntities: (u: Universe, w: World, p: Place, e0: Entity, e1: Entity, c: Collision) => void;

	collider: any;
	locPrev: Disposition;
	ticksUntilCanCollide: number;
	entitiesAlreadyCollidedWith: Entity[];
	isDisabled: boolean;

	_transformLocate: Transform_Locate;

	constructor
	(
		ticksToWaitBetweenCollisions: number,
		colliderAtRest: any,
		entityPropertyNamesToCollideWith: string[],
		collideEntities: (u: Universe, w: World, p: Place, e0: Entity, e1: Entity, c: Collision) => void
	)
	{
		super();
		this.ticksToWaitBetweenCollisions = ticksToWaitBetweenCollisions;
		this.colliderAtRest = colliderAtRest;
		this.entityPropertyNamesToCollideWith = entityPropertyNamesToCollideWith || [];
		this._collideEntities = collideEntities;

		this.collider = this.colliderAtRest.clone();
		this.locPrev = new Disposition(null, null, null);
		this.ticksUntilCanCollide = 0;
		this.entitiesAlreadyCollidedWith = [];
		this.isDisabled = false;

		// Helper variables.

		this._transformLocate = new Transform_Locate(null);
	}

	collideEntities(u: Universe, w: World, p: Place, e0: Entity, e1: Entity, c: Collision)
	{
		if (this._collideEntities != null)
		{
			this._collideEntities(u, w, p, e0, e1, c);
		}
	}

	colliderLocateForEntity(entity: Entity)
	{
		this.collider.overwriteWith(this.colliderAtRest);
		this.collider.locate(entity.locatable().loc);
	}

	initialize(universe: Universe, world: World, place: Place, entity: Entity)
	{
		this.colliderLocateForEntity(entity);
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		if (this.isDisabled)
		{
			return;
		}

		var entityLoc = entity.locatable().loc;
		this.locPrev.overwriteWith(entityLoc);

		if (this.ticksUntilCanCollide > 0)
		{
			this.ticksUntilCanCollide--;
		}
		else
		{
			this.colliderLocateForEntity(entity);

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
							this.updateForTimerTick_Collide
							(
								universe, world, place, entity, entityOther
							);
						}
					}
				}
			}
		}
	}

	updateForTimerTick_Collide
	(
		universe: Universe, world: World, place: Place, entity0: Entity, entity1: Entity
	)
	{
		var collisionHelper = universe.collisionHelper;

		var collidable0 = entity0.collidable();
		var collidable1 = entity1.collidable();

		var collidable0EntitiesAlreadyCollidedWith = collidable0.entitiesAlreadyCollidedWith;
		var collidable1EntitiesAlreadyCollidedWith = collidable1.entitiesAlreadyCollidedWith;

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
			var doBoxesCollide =
			(
				collidable0Boundable == null
				|| collidable1Boundable == null
				|| collisionHelper.doCollidersCollide(collidable0Boundable.bounds, collidable1Boundable.bounds)
			);

			if (doBoxesCollide)
			{
				var collider0 = collidable0.collider;
				var collider1 = collidable1.collider;

				doEntitiesCollide = collisionHelper.doCollidersCollide(collider0, collider1);
			}
		}

		var wereEntitiesAlreadyColliding =
		(
			this.ticksUntilCanCollide > 0
			&&
			(
				collidable0EntitiesAlreadyCollidedWith.indexOf(entity1) >= 0
				|| collidable1EntitiesAlreadyCollidedWith.indexOf(entity0) >= 0
			)
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

		if (doEntitiesCollide)
		{
			var collision = Collision.create();
			collisionHelper.collisionOfEntities(entity0, entity1, collision);

			this.collideEntities
			(
				universe, world, place, entity0, entity1, collision
			);

			var entity1Collidable = entity1.collidable();
			entity1Collidable.collideEntities
			(
				universe, world, place, entity1, entity0, collision
			);
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
