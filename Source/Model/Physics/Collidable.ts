
class Collidable
{
	colliderAtRest: any;
	entityPropertyNamesToCollideWith: string[];
	_collideEntities: (u: Universe, w: World, p: Place, e0: Entity, e1: Entity) => void;

	collider: any;
	ticksUntilCanCollide: number;
	entitiesAlreadyCollidedWith: Entity[];
	isDisabled: boolean;

	_transformTranslate: Transform_Translate;

	constructor
	(
		colliderAtRest: any,
		entityPropertyNamesToCollideWith: string[],
		collideEntities: (u: Universe, w: World, p: Place, e0: Entity, e1: Entity) => void
	)
	{
		this.colliderAtRest = colliderAtRest;
		this.entityPropertyNamesToCollideWith = entityPropertyNamesToCollideWith || [];
		this._collideEntities = collideEntities;

		this.collider = this.colliderAtRest.clone();

		this.ticksUntilCanCollide = 0;
		this.entitiesAlreadyCollidedWith = [];
		this.isDisabled = false;

		// Helper variables.

		this._transformTranslate = new Transform_Translate(new Coords(0, 0, 0));
	}

	collideEntities(u: Universe, w: World, p: Place, e0: Entity, e1: Entity)
	{
		if (this._collideEntities != null)
		{
			this._collideEntities(u, w, p, e0, e1);
		}
	}

	colliderLocateForEntity(entity: Entity)
	{
		this.collider.overwriteWith(this.colliderAtRest);
		Transforms.applyTransformToCoordsMany
		(
			this._transformTranslate.displacementSet
			(
				entity.locatable().loc.pos
			),
			this.collider.coordsGroupToTranslate()
		);
	};

	initialize(universe: Universe, world: World, place: Place, entity: Entity)
	{
		this.colliderLocateForEntity(entity);
	};

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		if (this.isDisabled)
		{
			return;
		}

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
							var doEntitiesCollide = universe.collisionHelper.doEntitiesCollide
							(
								entity, entityOther
							);
							if (doEntitiesCollide)
							{
								this.collideEntities
								(
									universe, world, place, entity, entityOther
								);

								entityOther.collidable().collideEntities
								(
									universe, world, place, entityOther, entity
								);
							}
						}
					}
				}
			}
		}
	};

	// cloneable

	clone()
	{
		return new Collidable
		(
			this.colliderAtRest.clone(),
			this.entityPropertyNamesToCollideWith,
			this._collideEntities
		);
	};
}
