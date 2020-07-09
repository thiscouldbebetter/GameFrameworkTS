
class Ephemeral
{
	ticksToLive: number;
	expire: any;

	constructor(ticksToLive: number, expire: any)
	{
		this.ticksToLive = ticksToLive;
		this.expire = expire;
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entityEphemeral: Entity)
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

	// cloneable

	clone()
	{
		return new Ephemeral(this.ticksToLive, this.expire);
	};
}
