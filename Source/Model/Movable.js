
function Movable(accelerationPerTick, accelerate)
{
	this.accelerationPerTick = accelerationPerTick;
	this.accelerate = accelerate || this.accelerateForward;
}
{
	Movable.prototype.accelerateForward = function(universe, world, place, entityMovable)
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

	Movable.prototype.clone = function()
	{
		return this;
	};
}
