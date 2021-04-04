namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_WrapXTrimY implements Constraint
{
	target: Coords;

	constructor(target: Coords)
	{
		this.target = target;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var entityLoc = entity.locatable().loc;
		var entityPos = entityLoc.pos;
		var max = this.target;

		while (entityPos.x < 0)
		{
			entityPos.x += max.x;
		}
		while (entityPos.x >= max.x)
		{
			entityPos.x -= max.x;
		}

		if (entityPos.y < 0)
		{
			entityPos.y = 0;
		}
		else if (entityPos.y > max.y)
		{
			entityPos.y = max.y;
		}
	}
}

}
