
function Coords(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;

	if (this.z == null)
	{
		this.z = 0;
	}
}

{
	Coords.Instances = new Coords_Instances();

	function Coords_Instances()
	{
		this.Ones = new Coords(1, 1, 1);
		this.Zeroes = new Coords(0, 0, 0);
	}

	Coords.prototype.add = function(other)
	{
		this.x += other.x;
		this.y += other.y;
		this.z += other.z;
		return this;
	}

	Coords.prototype.addDimensions = function(x, y, z)
	{
		this.x += x;
		this.y += y;
		this.z += z;
		return this;
	}

	Coords.prototype.ceiling = function()
	{
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.z = Math.ceil(this.z);
		return this;
	}

	Coords.prototype.clear = function()
	{
		this.x = 0;
		this.y = 0;
		this.z = 0;
		return this;
	}

	Coords.prototype.clone = function()
	{
		return new Coords(this.x, this.y, this.z);
	}

	Coords.prototype.crossProduct = function(other)
	{
		return this.overwriteWithDimensions
		(
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x
		);
	}

	Coords.prototype.divide = function(other)
	{
		this.x /= other.x;
		this.y /= other.y;
		this.z /= other.z;
		return this;
	}

	Coords.prototype.divideScalar = function(scalar)
	{
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;
		return this;
	}

	Coords.prototype.dotProduct = function(other)
	{
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}

	Coords.prototype.equals = function(other)
	{
		return (this.x == other.x && this.y == other.y && this.z == other.z);
	}

	Coords.prototype.floor = function()
	{
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);
		return this;
	}

	Coords.prototype.invert = function()
	{
		this.x = 0 - this.x;
		this.y = 0 - this.y;
		this.z = 0 - this.z;
		return this;
	}

	Coords.prototype.isInRangeMinMax = function(min, max)
	{
		var returnValue =
		(
			this.x >= min.x
			&& this.x <= max.x
			&& this.y >= min.y
			&& this.y <= max.y
			&& this.z >= min.z
			&& this.z <= max.z
		);

		return returnValue;
	}

	Coords.prototype.magnitude = function()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	Coords.prototype.multiply = function(other)
	{
		this.x *= other.x;
		this.y *= other.y;
		this.z *= other.z;
		return this;
	}

	Coords.prototype.multiplyScalar = function(scalar)
	{
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;
	}

	Coords.prototype.normalize = function()
	{
		var magnitude = this.magnitude();
		if (magnitude > 0)
		{
			this.divideScalar(magnitude);
		}
		return this;
	}

	Coords.prototype.overwriteWith = function(other)
	{
		this.x = other.x;
		this.y = other.y;
		this.z = other.z;
		return this;
	}

	Coords.prototype.overwriteWithDimensions = function(x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	Coords.prototype.randomize = function()
	{
		this.x = Math.random();
		this.y = Math.random();
		this.z = Math.random();
		return this;
	}

	Coords.prototype.right = function()
	{
		var temp = this.y;
		this.y = this.x;
		this.x = 0 - temp;
		return this;
	}

	Coords.prototype.round = function()
	{
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		this.z = Math.round(this.z);
		return this;
	}

	Coords.prototype.subtract = function(other)
	{
		this.x -= other.x;
		this.y -= other.y;
		this.z -= other.z;
		return this;
	}

	Coords.prototype.trimToMagnitudeMax = function(magnitudeMax)
	{
		var magnitude = this.magnitude();
		if (magnitude > magnitudeMax)
		{
			this.divideScalar(magnitude).multiplyScalar(magnitudeMax);
		}
		return this;
	}

	Coords.prototype.trimToRangeMax = function(max)
	{
		if (this.x < 0)
		{
			this.x = 0;
		}
		else if (this.x >= max.x)
		{
			this.x = max.x;
		}

		if (this.y < 0)
		{
			this.y = 0;
		}
		else if (this.y >= max.y)
		{
			this.y = max.y;
		}

		if (this.z < 0)
		{
			this.z = 0;
		}
		else if (this.z >= max.z)
		{
			this.z = max.z;
		}

		return this;
	}

	Coords.prototype.trimToRangeMinMax = function(min, max)
	{
		if (this.x < min.x)
		{
			this.x = min.x;
		}
		else if (this.x >= max.x)
		{
			this.x = max.x;
		}

		if (this.y < min.y)
		{
			this.y = min.y;
		}
		else if (this.y >= max.y)
		{
			this.y = max.y;
		}

		if (this.z < min.z)
		{
			this.z = min.z;
		}
		else if (this.z >= max.z)
		{
			this.z = max.z;
		}

		return this;
	}

	Coords.prototype.wrapToRangeMax = function(max)
	{
		while (this.x < 0)
		{
			this.x += max.x;
		}
		while (this.x >= max.x)
		{
			this.x -= max.x;
		}

		while (this.y < 0)
		{
			this.y += max.y;
		}
		while (this.y >= max.y)
		{
			this.y -= max.y;
		}

		while (this.z < 0)
		{
			this.z += max.z;
		}
		while (this.z >= max.z)
		{
			this.z -= max.z;
		}

		return this;
	}

	// string

	Coords.prototype.toString = function()
	{
		return this.x + "x" + this.y + "x" + this.z;
	}
}
