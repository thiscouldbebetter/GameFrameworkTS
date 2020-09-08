
class Collidable extends EntityProperty
{
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
		colliderAtRest: any,
		entityPropertyNamesToCollideWith: string[],
		collideEntities: (u: Universe, w: World, p: Place, e0: Entity, e1: Entity, c: Collision) => void
	)
	{
		super();
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
		this._transformLocate.loc = entity.locatable().loc;

		Transforms.applyTransformToCoordsMany
		(
			this._transformLocate,
			this.collider.coordsGroupToTranslate()
		);
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

		this.locPrev.overwriteWith(entity.locatable().loc);

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
							var collisionHelper = universe.collisionHelper;
							var doEntitiesCollide = collisionHelper.doEntitiesCollide
							(
								entity, entityOther
							);
							if (doEntitiesCollide)
							{
								var collision = Collision.create();
								collisionHelper.collisionOfEntities(entity, entityOther, collision);

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
						}
					}
				}
			}
		}
	}

	// cloneable

	clone()
	{
		return new Collidable
		(
			this.colliderAtRest.clone(),
			this.entityPropertyNamesToCollideWith,
			this._collideEntities
		);
	}
}
