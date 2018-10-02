
function Killable(integrity, die)
{
	this.integrity = integrity;
	this.die = die;
}
{
	Killable.prototype.updateForTimerTick = function(universe, world, place, entityKillable)
	{
		if (this.integrity <= 0)
		{
			place.entitiesToRemove.push(entityKillable);
			if (this.die != null)
			{
				this.die(universe, world, place, entityKillable);
			}
		}
	}
}
