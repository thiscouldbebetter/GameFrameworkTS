
namespace ThisCouldBeBetter.GameFramework
{

export class Ephemeral implements EntityProperty
{
	ticksToLive: number;
	expire: any;

	constructor(ticksToLive: number, expire: any)
	{
		this.ticksToLive = ticksToLive;
		this.expire = expire;
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}

	updateForTimerTick
	(
		universe: Universe, world: World, place: Place, entityEphemeral: Entity
	): void
	{
		this.ticksToLive--;
		if (this.ticksToLive <= 0)
		{
			place.entityToRemoveAdd(entityEphemeral);
			if (this.expire != null)
			{
				this.expire(universe, world, place, entityEphemeral);
			}
		}
	}

	// cloneable

	clone(): Ephemeral
	{
		return new Ephemeral(this.ticksToLive, this.expire);
	}
}

}
