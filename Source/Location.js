
function Location(pos)
{
	this.pos = pos;
	this.orientation = new Orientation(new Coords(1, 0));

	this.vel = new Coords(0, 0);
	this.accel = new Coords(0, 0);
	this.force = new Coords(0, 0);
}

{
	Location.prototype.clone = function()
	{
		var returnValue = new Location
		(
			this.pos.clone()
		);

		returnValue.venue = returnValue.venue;
		returnValue.vel = returnValue.vel.clone();
		returnValue.accel = returnValue.accel.clone();
		returnValue.force = returnValue.force.clone();

		return returnValue;
	}
	
	Location.prototype.headingInTurns = function()
	{
		var forward = this.orientation.forward;
		var returnValue = 
			Math.atan2(forward.y, forward.x) / (Math.PI * 2);
			
		if (returnValue < 0)
		{
			returnValue += 1;
		}
		
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
