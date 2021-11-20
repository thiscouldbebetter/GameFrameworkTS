
namespace ThisCouldBeBetter.GameFramework
{

export class Device implements EntityProperty<Device>
{
	name: string;
	_initialize: (uwpe: UniverseWorldPlaceEntities) => void;
	update: (uwpe: UniverseWorldPlaceEntities) => void;
	_use: (uwpe: UniverseWorldPlaceEntities) => void;

	tickLastUsed: number;
	ticksToCharge: number;

	constructor
	(
		name: string,
		ticksToCharge: number,
		initialize: (uwpe: UniverseWorldPlaceEntities) => void,
		update: (uwpe: UniverseWorldPlaceEntities) => void,
		use: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.name = name;
		this.ticksToCharge = ticksToCharge;
		this._initialize = initialize;
		this.update = update;
		this.use = use;

		this.tickLastUsed = 0 - this.ticksToCharge;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._initialize != null)
		{
			this._initialize(uwpe);
		}
	}

	use(uwpe: UniverseWorldPlaceEntities): void
	{
		var world = uwpe.world;
		var tickCurrent = world.timerTicksSoFar;
		var ticksSinceUsed = tickCurrent - this.tickLastUsed;
		if (ticksSinceUsed >= this.ticksToCharge)
		{
			this.tickLastUsed = tickCurrent;
			this._use(uwpe);
		}
	}

	// clonable

	clone(): Device
	{
		return new Device
		(
			this.name, this.ticksToCharge, this._initialize, this.update,
			this.use
		);
	}

	// Equatable

	equals(other: Device): boolean { return false; } // todo

}

}
