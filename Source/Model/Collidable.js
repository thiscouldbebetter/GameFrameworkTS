
function Collidable(colliderAtRest, entityPropertyNamesToCollideWith, collideEntities)
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
	this.entityAlreadyCollidedWith = null;

	// Helper variables.

	this._transformTranslate = new Transform_Translate(new Coords());
}

{
	Collidable.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		if (this.ticksUntilCanCollide > 0)
		{
			this.ticksUntilCanCollide--;
		}
		else
		{
			this.collider.overwriteWith(this.colliderAtRest);

			Transform.applyTransformToCoordsArrays
			(
				this._transformTranslate.displacementSet
				(
					entity.Locatable.loc.pos
				),
				this.collider.coordsGroupToTranslate()
			);

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
							var collidableOther = entityOther.Collidable;
							var canCollide = (collidableOther.ticksUntilCanCollide == 0);
							if (canCollide)
							{
								var colliderThis = entity.Collidable.collider;
								var colliderOther = collidableOther.collider;

								var collisionHelper = universe.collisionHelper;
								var doEntitiesCollide = collisionHelper.doCollidersCollide
								(
									colliderThis, colliderOther
								);

								if (entityOther == this.entityAlreadyCollidedWith)
								{
									if (doEntitiesCollide)
									{
										doEntitiesCollide = false;
									}
									else
									{
										this.entityAlreadyCollidedWith = null;
									}
								}

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
		}
	};

	// cloneable

	Collidable.prototype.clone = function()
	{
		return new Collidable
		(
			this.collider.clone(),
			this.entityPropertyNamesToCollideWith,
			this.collideEntities
		);
	}
}
