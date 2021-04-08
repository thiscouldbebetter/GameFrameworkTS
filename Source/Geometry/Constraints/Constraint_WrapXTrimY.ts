namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_WrapXTrimY implements Constraint
{
	constrain(universe: Universe, world: World, place: Place, entity: Entity): void
	{
		var min = Coords.Instances().Zeroes;
		var max = place.size;

		var entityLoc = entity.locatable().loc;
		var entityPos = entityLoc.pos;

		while (entityPos.x < min.x)
		{
			entityPos.x += max.x;
		}
		while (entityPos.x >= max.x)
		{
			entityPos.x -= max.x;
		}

		if (entityPos.y < min.y)
		{
			entityPos.y = min.y;
		}
		else if (entityPos.y > max.y)
		{
			entityPos.y = max.y;
		}
	}
}

}
