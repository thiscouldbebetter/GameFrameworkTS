
function Locatable(loc)
{
	this.loc = loc;
}
{
	Locatable.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		var loc = this.loc;
	
		loc.pos.add(loc.vel);
		loc.vel.clear();

		var spin = loc.spin;
		if (spin.angleInTurns() != 0)
		{
			loc.spin.transformOrientation(loc.orientation);
		}
	}
}
