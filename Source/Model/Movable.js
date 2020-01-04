
function Movable(accelerationPerTick, accelerate)
{
	this.accelerationPerTick = accelerationPerTick;
	this._accelerate = accelerate;
}
{
	Movable.prototype.accelerate = function(universe, world, place, entityMovable)
	{
		if (this._accelerate == null)
		{
			this.accelerateForward
			(
				universe, world, place, entityMovable, entityMovable.Movable.accelerationPerTick
			);
		}
		else
		{
			this._accelerate(universe, world, place, entityMovable);
		}
	};

	Movable.prototype.accelerateForward = function(universe, world, place, entityMovable, acceleration)
	{
		var entityLoc = entityMovable.Locatable.loc;
		entityLoc.accel.overwriteWith
		(
			entityLoc.orientation.forward
		).multiplyScalar
		(
			acceleration
		);
	};

	// cloneable

	Movable.prototype.clone = function()
	{
		return this;
	};
}
