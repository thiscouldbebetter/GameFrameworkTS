
function Ephemeral(ticksToLive)
{
	this.ticksToLive = ticksToLive;
}
{
	Ephemeral.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		this.ticksToLive--;
		if (this.ticksToLive <= 0)
		{
			place.entitiesToRemove.push(entity);
		}
	}

}
