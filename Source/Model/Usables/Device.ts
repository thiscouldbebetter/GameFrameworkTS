
namespace ThisCouldBeBetter.GameFramework
{

export class Device extends EntityPropertyBase<Device>
{
	name: string;
	_initialize: (uwpe: UniverseWorldPlaceEntities) => void;
	_update: (uwpe: UniverseWorldPlaceEntities) => void;
	_canUse: (uwpe: UniverseWorldPlaceEntities) => boolean;
	_use: (uwpe: UniverseWorldPlaceEntities) => void;

	tickLastUsed: number;
	ticksToCharge: number;

	constructor
	(
		name: string,
		initialize: (uwpe: UniverseWorldPlaceEntities) => void,
		update: (uwpe: UniverseWorldPlaceEntities) => void,
		canUse: (uwpe: UniverseWorldPlaceEntities) => boolean,
		use: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		super();

		this.name = name;
		this._initialize = initialize;
		this._update = update;
		this._canUse = canUse;
		this._use = use;

		this.tickLastUsed = 0 - this.ticksToCharge;
	}

	static fromEntity(entity: Entity): Device
	{
		return entity.propertyByName(Device.name) as Device;
	}

	static fromNameCanUseAndUse
	(
		name: string,
		canUse: (uwpe: UniverseWorldPlaceEntities) => boolean,
		use:  (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		return new Device(name, null, null, canUse, use);
	}

	static fromNameTicksToChargeAndUse
	(
		name: string,
		ticksToCharge: number,
		use:  (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		return Device.fromNameCanUseAndUse
		(
			name,
			(uwpe: UniverseWorldPlaceEntities) =>
				Device.canUseAfterTicksToCharge(uwpe, ticksToCharge),
			use
		);
	}

	static of(entity: Entity): Device
	{
		return entity.propertyByName(Device.name) as Device;
	}

	canUse(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return this._canUse == null ? true : this._canUse(uwpe);
	}

	static canUseAfterTicksToCharge(uwpe: UniverseWorldPlaceEntities, ticksToCharge: number): boolean
	{
		var entityDevice = uwpe.entity2;
		var device = Device.fromEntity(entityDevice);
		var world = uwpe.world;
		var tickCurrent = world.timerTicksSoFar;
		var ticksSinceUsed = tickCurrent - device.tickLastUsed;
		var haveEnoughTicksPassedToCharge =
			(ticksSinceUsed >= ticksToCharge);
		return haveEnoughTicksPassedToCharge;
	}

	update(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._update != null)
		{
			this._update(uwpe);
		}
	}

	use(uwpe: UniverseWorldPlaceEntities): void
	{
		var canUse = this.canUse(uwpe);
		if (canUse)
		{
			var world = uwpe.world;
			var tickCurrent = world.timerTicksSoFar;
			this.tickLastUsed = tickCurrent;
			this._use(uwpe);
		}
	}

	// EntityProperty.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._initialize != null)
		{
			this._initialize(uwpe);
		}
	}

	// clonable

	clone(): Device
	{
		return new Device
		(
			this.name,
			this._initialize,
			this._update,
			this._canUse,
			this._use
		);
	}

}

}
