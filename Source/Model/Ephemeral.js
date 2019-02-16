
function Ephemeral(ticksToLive, expire)
{
	this.ticksToLive = ticksToLive;
	this.expire = expire;
}
{
	Ephemeral.prototype.updateForTimerTick = function(universe, world, place, entityEphemeral)
	{
		this.ticksToLive--;
		if (this.ticksToLive <= 0)
		{
			place.entitiesToRemove.push(entityEphemeral);
			if (this.expire != null)
			{
				this.expire(universe, world, place, entityEphemeral);
			}
		}
	};
}
