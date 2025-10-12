
namespace ThisCouldBeBetter.GameFramework
{

export class Ephemeral extends EntityPropertyBase<Ephemeral>
{
	ticksToLive: number;
	_expire: (uwpe: UniverseWorldPlaceEntities) => void;

	ticksSoFar: number;

	constructor
	(
		ticksToLive: number,
		expire: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		super();

		this.ticksToLive = ticksToLive || 100;
		this._expire = expire;

		this.ticksSoFar = 0;
	}

	static default(): Ephemeral
	{
		return Ephemeral.fromTicksToLive(100);
	}

	static fromTicksAndExpire
	(
		ticksToLive: number,
		expire: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		return new Ephemeral(ticksToLive, expire);
	}

	static fromTicksToLive(ticksToLive: number): Ephemeral
	{
		return new Ephemeral(ticksToLive, null);
	}

	static fromTicksToLiveAndExpire
	(
		ticksToLive: number,
		expire: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		return new Ephemeral(ticksToLive, expire);
	}

	static of(entity: Entity): Ephemeral
	{
		return entity.propertyByName(Ephemeral.name) as Ephemeral;
	}

	expire(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._expire != null)
		{
			this._expire(uwpe);
		}
	}

	isExpired(): boolean
	{
		return (this.ticksSoFar >= this.ticksToLive);
	}

	reset(): Ephemeral
	{
		this.ticksSoFar = 0;
		return this;
	}

	toEntity(): Entity { return new Entity(Ephemeral.name, [ this ] ); }

	// EntityProperty.

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.activated() )
		{
			this.ticksSoFar++;
			var isExpired = this.isExpired();
			if (isExpired)
			{
				var entityEphemeral = uwpe.entity;
				uwpe.place.entityToRemoveAdd(entityEphemeral);
				this.expire(uwpe);
			}
		}
	}

	// Clonable.

	clone(): Ephemeral
	{
		return new Ephemeral(this.ticksToLive, this._expire);
	}

}

}
