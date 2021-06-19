namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Gravity implements Constraint
{
	accelerationPerTick: Coords;

	constructor(accelerationPerTick: Coords)
	{
		this.accelerationPerTick = accelerationPerTick;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;
		var loc = entity.locatable().loc;
		if (loc.pos.z < 0) // hack
		{
			loc.accel.add(this.accelerationPerTick);
		}
	}
}

}
