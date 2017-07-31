
function Location(pos, heading)
{
	this.pos = pos;
	this.heading = heading;
}

{
	Location.prototype.clone = function()
	{
		return new Location(this.pos.clone(), this.heading);
	}

	Location.prototype.overwriteWith = function(other)
	{
		this.pos.overwriteWith(other.pos);
		this.heading = other.heading;
		return this;
	}
}
