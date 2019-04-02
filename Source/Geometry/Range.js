
function Range(min, max)
{
	this.min = min;
	this.max = max;
}
{
	Range.prototype.clone = function()
	{
		return new Range(this.min, this.max);
	}

	Range.prototype.intersectWith = function(other)
	{
		this.min = (this.min >= other.min ? this.min : other.min);
		this.max = (this.max <= other.max ? this.max : other.max);
		return this;
	}

	Range.prototype.midpoint = function()
	{
		return (this.min + this.max) / 2;
	}

	Range.prototype.overlapsWith = function(other)
	{
		var returnValue =
		(
			(this.min > other.min && this.min < other.max)
			|| (this.max > other.min && this.max < other.max)
			|| (other.min > this.min && other.min < this.max)
			|| (other.max > this.min && other.max < this.max)
		);

		return returnValue;
	}

	Range.prototype.overwriteWith = function(other)
	{
		this.min = min;
		this.max = max;
		return this;
	}
}
