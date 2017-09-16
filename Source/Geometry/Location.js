
function Location(pos, orientation)
{
	this.pos = pos;

	if (orientation == null)
	{
		orientation = Orientation.Instances.ForwardXDownZ.clone();
	}
	this.orientation = orientation;

	this.vel = new Coords(0, 0, 0);
	this.accel = new Coords(0, 0, 0);
	this.force = new Coords(0, 0, 0);

	this.spin = new Rotation(this.orientation.down, new Reference(0));

	this.timeOffsetInTicks = 0;
}

{
	Location.prototype.clone = function()
	{
		var returnValue = new Location
		(
			this.pos.clone()
		);

		returnValue.venue = this.venue;
		returnValue.vel = this.vel.clone();
		returnValue.accel = this.accel.clone();
		returnValue.force = this.force.clone();
		returnValue.timeOffsetInTicks = this.timeOffsetInTicks;

		return returnValue;
	}

	Location.prototype.overwriteWith = function(other)
	{
		this.venue = other.venue;
		this.pos.overwriteWith(other.pos);
		this.orientation.overwriteWith(other.orientation);
		this.vel.overwriteWith(other.vel);
		this.accel.overwriteWith(other.accel);
		this.force.overwriteWith(other.force);
		return this;
	}

	Location.prototype.toString = function()
	{
		return this.pos.clone().round().toString();
	}
}
