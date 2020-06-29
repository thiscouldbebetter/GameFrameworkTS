
class Movable
{
	constructor(accelerationPerTick, accelerate)
	{
		this.accelerationPerTick = accelerationPerTick;
		this.accelerate = accelerate || this.accelerateForward;
	}

	accelerateForward(universe, world, place, entityMovable)
	{
		var entityLoc = entityMovable.locatable.loc;
		entityLoc.accel.overwriteWith
		(
			entityLoc.orientation.forward
		).multiplyScalar
		(
			entityMovable.movable.accelerationPerTick
		);
	};

	// cloneable

	clone = function()
	{
		return this;
	};
}
