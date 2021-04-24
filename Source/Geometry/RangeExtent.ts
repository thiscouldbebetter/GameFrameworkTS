
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

	static create(): RangeExtent
	{
		return new RangeExtent(0, 0);
	}

	static _instances: RangeExtent_Instances;
	static Instances(): RangeExtent_Instances
	{
		if (RangeExtent._instances == null)
		{
			RangeExtent._instances = new RangeExtent_Instances();
		}
		return RangeExtent._instances;
	}

	clone(): RangeExtent
	{
		return new RangeExtent(this.min, this.max);
	}

	contains(valueToCheck: number): boolean
	{
		return (valueToCheck >= this.min && valueToCheck <= this.max);
	}

	intersectWith(other: RangeExtent): RangeExtent
	{
		this.min = (this.min >= other.min ? this.min : other.min);
		this.max = (this.max <= other.max ? this.max : other.max);
		return this;
	}

	midpoint(): number
	{
		return (this.min + this.max) / 2;
	}

	minAndMax(): number[]
	{
		return [ this.min, this.max ];
	}

	overlapsWith(other: RangeExtent): boolean
	{
		var returnValue =
		(
			this.min < other.max
			&& this.max > other.min
		);

		return returnValue;
	}

	overwriteWith(other: RangeExtent): RangeExtent
	{
		this.min = other.min;
		this.max = other.max;
		return this;
	}

	overwriteWithMinAndMax(min: number, max: number): RangeExtent
	{
		this.min = min;
		this.max = max;
		return this;
	}

	random(randomizer: Randomizer): number
	{
		return this.min + (this.max - this.min) * randomizer.getNextRandom();
	}

	size(): number
	{
		return this.max - this.min;
	}

	subtract(other: RangeExtent): RangeExtent[]
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

	trimValue(valueToTrim: number): number
	{
		if (valueToTrim < this.min)
		{
			valueToTrim = this.min;
		}
		else if (valueToTrim > this.max)
		{
			valueToTrim = this.max;
		}
		return valueToTrim;
	}

	touches(other: RangeExtent): boolean
	{
		var returnValue =
		(
			this.min <= other.max
			&& this.max >= other.min
		);

		return returnValue;
	}

	wrapValue(valueToWrap: number): number
	{
		var returnValue = valueToWrap;

		var size = this.size();

		while (returnValue < this.min)
		{
			returnValue += size;
		}
		while (returnValue > this.max)
		{
			returnValue -= size;
		}

		return returnValue;
	}
}

export class RangeExtent_Instances
{
	ZeroToOne: RangeExtent;

	constructor()
	{
		this.ZeroToOne = new RangeExtent(0, 1);
	}
}

}
