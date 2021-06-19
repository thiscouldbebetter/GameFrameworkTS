
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

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		this.ticksToLive--;
		if (this.ticksToLive <= 0)
		{
			var entityEphemeral = uwpe.entity;
			uwpe.place.entityToRemoveAdd(entityEphemeral);
			if (this.expire != null)
			{
				this.expire(uwpe);
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
