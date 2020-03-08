
function Locatable(loc)
{
	this.loc = loc;
}
{
	Locatable.prototype.updateForTimerTick = function(universe, world, place, entity)
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

	Locatable.prototype.clone = function()
	{
		return new Locatable(this.loc.clone());
	};
}
