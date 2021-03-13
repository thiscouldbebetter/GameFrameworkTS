
namespace ThisCouldBeBetter.GameFramework
{

export class RangeExtent
{
	min: number;
	max: number;

	constructor(min: number, max: number)
	{
		this.min = min;
		this.max = max;
	}

	clone()
	{
		return new RangeExtent(this.min, this.max);
	}

	intersectWith(other: RangeExtent)
	{
		this.min = (this.min >= other.min ? this.min : other.min);
		this.max = (this.max <= other.max ? this.max : other.max);
		return this;
	}

	midpoint()
	{
		return (this.min + this.max) / 2;
	}

	minAndMax()
	{
		return [ this.min, this.max ];
	}

	overlapsWith(other: RangeExtent)
	{
		var returnValue =
		(
			this.min < other.max
			&& this.max > other.min
		);

		return returnValue;
	}

	overwriteWith(other: RangeExtent)
	{
		this.min = other.min;
		this.max = other.max;
		return this;
	}

	overwriteWithMinAndMax(min: number, max: number)
	{
		this.min = min;
		this.max = max;
		return this;
	}

	random(randomizer: Randomizer)
	{
		return this.min + (this.max - this.min) * randomizer.getNextRandom();
	};

	size()
	{
		return this.max - this.min;
	}

	subtract(other: RangeExtent)
	{
		var returnValues = [];

		if (this.overlapsWith(other))
		{
			if (this.min <= other.min)
			{
				var segment = new RangeExtent(this.min, other.min);
				returnValues.push(segment);
			}

			if (this.max >= other.max)
			{
				var segment = new RangeExtent(other.max, this.max);
				returnValues.push(segment);
			}
		}
		else
		{
			returnValues.push(this);
		}

		return returnValues;
	}

	touches(other: RangeExtent)
	{
		var returnValue =
		(
			this.min <= other.max
			&& this.max >= other.min
		);

		return returnValue;
	}
}

}
