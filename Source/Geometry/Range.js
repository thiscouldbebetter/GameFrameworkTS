
function Range(min, max)
{
	this.min = min;
	this.max = max;
}
{
	Range.prototype.clone = function()
	{
		return new Range(this.min, this.max);
	};

	Range.prototype.intersectWith = function(other)
	{
		this.min = (this.min >= other.min ? this.min : other.min);
		this.max = (this.max <= other.max ? this.max : other.max);
		return this;
	};

	Range.prototype.midpoint = function()
	{
		return (this.min + this.max) / 2;
	};

	Range.prototype.overlapsWith = function(other)
	{
		var returnValue =
		(
			this.min <= other.max
			&& this.max >= other.min
		);

		return returnValue;
	};

	Range.prototype.overwriteWith = function(other)
	{
		this.min = min;
		this.max = max;
		return this;
	};

	Range.prototype.overwriteWithMinAndMax = function(min, max)
	{
		this.min = min;
		this.max = max;
		return this;
	};

	Range.prototype.random = function(randomizer)
	{
		return this.min + (this.max - this.min) * randomizer.getNextRandom();
	};

	Range.prototype.size = function()
	{
		return this.max - this.min;
	};

	Range.prototype.subtract = function(other)
	{
		var returnValues = [];

		if (this.overlapsWith(other) == true)
		{
			if (this.min <= other.min)
			{
				var segment = new Range(this.min, other.min);
				returnValues.push(segment);
			}

			if (this.max >= other.max)
			{
				var segment = new Range(other.max, this.max);
				returnValues.push(segment);
			}
		}
		else
		{
			returnValues.push(this);
		}

		return returnValues;
	};
}
