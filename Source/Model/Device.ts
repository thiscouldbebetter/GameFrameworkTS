
class Device
{
	name: string;
	initialize: (u: Universe, w: World, p: Place, e: Entity) => void;
	update: (u: Universe, w: World, p: Place, e: Entity) => void;
	use: (u: Universe, w: World, p: Place, eUser: Entity, eDevice: Entity) => void;

	tickLastUsed: number;
	ticksToCharge: number;

	constructor
	(
		name: string,
		initialize: (u: Universe, w: World, p: Place, e: Entity) => void,
		update: (u: Universe, w: World, p: Place, e: Entity) => void,
		use: (u: Universe, w: World, p: Place, eUser: Entity, eDevice: Entity) => void)
	{
		this.name = name;
		this.initialize = initialize;
		this.update = update;
		this.use = use;
	}

	// clonable

	clone()
	{
		return new Device(this.name, this.initialize, this.update, this.use);
	};
}
