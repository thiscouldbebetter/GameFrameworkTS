
function NumberExtensions()
{
	// extension class
}

{
	Number.prototype.isInRangeMinMax = function(min, max)
	{
		return (this >= min && this <= max);
	}

	Number.prototype.trimToRangeMinMax = function(min, max)
	{
		var value = this;

		if (value < min)
		{
			value = min;
		}
		else if (value > max)
		{
			value = max;
		}

		return value;
	}

	Number.prototype.wrapToRangeMinMax = function(min, max)
	{
		var value = this;

		var rangeSize = max - min;

		if (rangeSize == 0)
		{
			value = min;
		}
		else
		{
			while (value < min)
			{
				value += rangeSize;
			}

			while (value >= max)
			{
				value -= rangeSize;
			}
		}

		return value;
	}
}
