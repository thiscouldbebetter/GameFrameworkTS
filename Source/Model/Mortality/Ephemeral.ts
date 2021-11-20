
namespace ThisCouldBeBetter.GameFramework
{

export class Ephemeral implements EntityProperty<Ephemeral>
{
	ticksToLive: number;
	expire: (uwpe: UniverseWorldPlaceEntities) => void;

	constructor
	(
		ticksToLive: number,
		expire: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.ticksToLive = ticksToLive;
		this.expire = expire;
	}

	toEntity(): Entity { return new Entity(Ephemeral.name, [ this ] ); }

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

	// Clonable.

	clone(): Ephemeral
	{
		return new Ephemeral(this.ticksToLive, this.expire);
	}

	// Equatable

	equals(other: Ephemeral): boolean { return false; } // todo

}

}
