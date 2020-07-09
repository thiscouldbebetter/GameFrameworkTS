
class Movable
{
	accelerationPerTick: number;
	accelerate: any;

	constructor(accelerationPerTick: number, accelerate: any)
	{
		this.accelerationPerTick = accelerationPerTick;
		this.accelerate = accelerate || this.accelerateForward;
	}

	accelerateForward(universe: Universe, world: World, place: Place, entityMovable: Entity)
	{
		var entityLoc = entityMovable.locatable().loc;
		entityLoc.accel.overwriteWith
		(
			entityLoc.orientation.forward
		).multiplyScalar
		(
			entityMovable.movable().accelerationPerTick
		);
	};

	// cloneable

	clone = function()
	{
		return this;
	};
}
