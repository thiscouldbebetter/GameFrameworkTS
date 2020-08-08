
class Device
{
	name: string;
	initialize: (u: Universe, w: World, p: Place, e: Entity) => void;
	update: (u: Universe, w: World, p: Place, e: Entity) => void;
	_use: (u: Universe, w: World, p: Place, eUser: Entity, eDevice: Entity) => void;

	tickLastUsed: number;
	ticksToCharge: number;

	constructor
	(
		name: string,
		ticksToCharge: number,
		initialize: (u: Universe, w: World, p: Place, e: Entity) => void,
		update: (u: Universe, w: World, p: Place, e: Entity) => void,
		use: (u: Universe, w: World, p: Place, eUser: Entity, eDevice: Entity) => void)
	{
		this.name = name;
		this.ticksToCharge = ticksToCharge;
		this.initialize = initialize;
		this.update = update;
		this.use = use;

		this.tickLastUsed = 0 - this.ticksToCharge;
	}

	use(u: Universe, w: World, p: Place, eUser: Entity, eDevice: Entity)
	{
		var tickCurrent = w.timerTicksSoFar;
		var ticksSinceUsed = tickCurrent - this.tickLastUsed;
		if (ticksSinceUsed >= this.ticksToCharge)
		{
			this.tickLastUsed = tickCurrent;
			this._use(u, w, p, eUser, eDevice);
		}
	}

	// clonable

	clone()
	{
		return new Device(this.name, this.ticksToCharge, this.initialize, this.update, this.use);
	};
}
