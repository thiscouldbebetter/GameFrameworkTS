
class Locatable
{
	loc: Disposition;

	constructor(loc: Disposition)
	{
		this.loc = loc || new Disposition(null, null, null);
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var loc = this.loc;

		loc.vel.add(loc.accel);
		loc.accel.clear();
		loc.pos.add(loc.vel);

		var spin = loc.spin;
		if (spin.angleInTurns() != 0)
		{
			loc.spin.transformOrientation(loc.orientation);
		}
	};

	// cloneable

	clone()
	{
		return new Locatable(this.loc.clone());
	};
}
