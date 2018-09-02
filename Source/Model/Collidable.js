
function Collidable(collider, entityPropertyNamesToCollideWith, collideEntities)
{
	this.collider = collider;
	this.entityPropertyNamesToCollideWith = entityPropertyNamesToCollideWith;
	this.collideEntities = collideEntities;

	if (this.entityPropertyNamesToCollideWith == null)
	{
		this.entityPropertyNamesToCollideWith = [];
	}

	this.ticksUntilCanCollide = 0;
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
							var collidableOther = entityOther.collidable;
							if (collidableOther.ticksUntilCanCollide == 0)
							{
								var colliderThis = entity.collidable.collider;
								var colliderOther = collidableOther.collider;

								var collisionHelper = universe.collisionHelper;
								var doEntitiesCollide = collisionHelper.doCollidersCollide
								(
									colliderThis, colliderOther
								);
								if (doEntitiesCollide == true)
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
	}
}
