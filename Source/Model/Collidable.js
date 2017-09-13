
function Collidable(collider, entityPropertyNamesToCollideWith, collideEntities)
{
	this.collider = collider;
	this.entityPropertyNamesToCollideWith = entityPropertyNamesToCollideWith;
	this.collideEntities = collideEntities;
	
	if (this.entityPropertyNamesToCollideWith == null)
	{
		this.entityPropertyNamesToCollideWith = [];
	}
}

{
	Collidable.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		for (var p = 0; p < this.entityPropertyNamesToCollideWith.length; p++)
		{
			var entityPropertyName = this.entityPropertyNamesToCollideWith[p];
			var entitiesWithProperty = place.entitiesByPropertyName[entityPropertyName];
			for (var e = 0; e < entitiesWithProperty.length; e++)
			{
				var entityOther = entitiesWithProperty[e];
				if (entityOther != entity)
				{
					var colliderThis = entity.collidable.collider;
					var colliderOther = entityOther.collidable.collider;

					var collisionHelper = Globals.Instance.collisionHelper;
					var doEntitiesCollide = collisionHelper.doCollidersCollide(colliderThis, colliderOther);
					if (doEntitiesCollide == true)
					{
						this.collideEntities(universe, world, place, entity, entityOther);
					}
				}
			}
		}
	}
}