
class Collidable
{
	constructor(colliderAtRest, entityPropertyNamesToCollideWith, collideEntities)
	{
		this.colliderAtRest = colliderAtRest;
		this.entityPropertyNamesToCollideWith = entityPropertyNamesToCollideWith;
		this.collideEntities = collideEntities;

		this.collider = this.colliderAtRest.clone();

		if (this.entityPropertyNamesToCollideWith == null)
		{
			this.entityPropertyNamesToCollideWith = [];
		}

		this.ticksUntilCanCollide = 0;
		this.entitiesAlreadyCollidedWith = [];

		// Helper variables.

		this._transformTranslate = new Transform_Translate(new Coords());
	}

	colliderLocateForEntity(entity)
	{
		this.collider.overwriteWith(this.colliderAtRest);
		Transform.applyTransformToCoordsMany
		(
			this._transformTranslate.displacementSet
			(
				entity.locatable.loc.pos
			),
			this.collider.coordsGroupToTranslate()
		);
	};

	initialize(universe, world, place, entity)
	{
		this.colliderLocateForEntity(entity);
	};

	updateForTimerTick(universe, world, place, entity)
	{
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
			this.collideEntities
		);
	};
}
