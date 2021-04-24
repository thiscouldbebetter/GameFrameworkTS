namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Gravity implements Constraint
{
	accelerationPerTick: Coords;

	constructor(accelerationPerTick: Coords)
	{
		this.accelerationPerTick = accelerationPerTick;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var loc = entity.locatable().loc;
		if (loc.pos.z < 0) // hack
		{
			loc.accel.add(this.accelerationPerTick);
		}
	}
}

}
