
function CollisionHelper()
{}
{
	CollisionHelper.prototype.collideEntities = function(collision, entity0, entity1)
	{
		entity0.defn().collidable.collide(entity0, entity1);
		entity1.defn().collidable.collide(entity1, entity0);
	}

	CollisionHelper.prototype.doEntitiesCollide = function(entity0, entity1)
	{
		var returnValue = entity0.bounds().overlapWith(entity1.bounds());
		return returnValue;
	}

	CollisionHelper.prototype.findCollisionsBetweenEntitiesInSets = function(entitySet0, entitySet1)
	{
		var returnValues = [];

		var numberOfEntitiesInSet0 = entitySet0.length;
		var numberOfEntitiesInSet1 = entitySet1.length;

		for (var i = 0; i < numberOfEntitiesInSet0; i++)
		{
			var entityFromSet0 = entitySet0[i];

			for (var j = 0; j < numberOfEntitiesInSet1; j++)
			{
				var entityFromSet1 = entitySet1[j];

				if (this.doEntitiesCollide(entityFromSet0, entityFromSet1) == true)
				{
					var collision = new Collision
					(
						[entityFromSet0, entityFromSet1]
					);
					returnValues.push(collision);
				}
			}
		}

		return returnValues;
	}
}
