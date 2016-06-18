
function Coords(x, y)
{
	this.x = x;
	this.y = y;
}

{
	Coords.prototype.add = function(other)
	{
		this.x += other.x;
		this.y += other.y;
		return this;
	}

	Coords.prototype.clone = function()
	{
		return new Coords(this.x, this.y);
	}

	Coords.prototype.equals = function(other)
	{
		return (this.x == other.x && this.y == other.y);
	}

	Coords.prototype.isWithinRange = function(min, max)
	{
		var returnValue = 
		(
			this.x >= min.x
			&& this.x <= max.x
			&& this.y >= min.y
			&& this.y <= max.y
		);

		return returnValue;
	}

	Coords.prototype.overwriteWith = function(other)
	{
		this.x = other.x;
		this.y = other.y;
		return this;
	}

	Coords.prototype.overwriteWithXY = function(x, y)
	{
		this.x = x;
		this.y = y;
		return this;
	}
}
