
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
		this.ticksToLive = ticksToLive || 100;
		this.expire = expire;
	}

	static default(): Ephemeral
	{
		return Ephemeral.fromTicksToLive(100);
	}

	static fromTicksToLive(ticksToLive: number): Ephemeral
	{
		return new Ephemeral(ticksToLive, null);
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

	overwriteWith(other: Ephemeral): Ephemeral { throw new Error("Not yet implemented."); }

	// Equatable

	equals(other: Ephemeral): boolean { return false; } // todo

}

}
