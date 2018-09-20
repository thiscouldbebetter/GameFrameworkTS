
function Killable(integrity, kill)
{
	this.integrity = integrity;
	this.kill = kill;
}
{
	Killable.prototype.updateForTimerTick = function(universe, world, place, entityKillable)
	{
		if (this.integrity <= 0)
		{
			place.entitiesToRemove.push(entityKillable);
			if (this.kill != null)
			{
				this.kill(universe, world, place, entityKillable);
			}
		}
	}
}
