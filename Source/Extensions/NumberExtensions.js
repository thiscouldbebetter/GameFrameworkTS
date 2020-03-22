
function NumberExtensions()
{
	// extension class
}

{
	Number.prototype.isInRangeMinMax = function(min, max)
	{
		return (this >= min && this <= max);
	};

	Number.prototype.roundToDecimalPlaces = function(numberOfPlaces)
	{
		var multiplier = Math.pow(10, numberOfPlaces);
		return Math.round(this * multiplier) / multiplier;
	};

	Number.prototype.subtractWrappedToRangeMax = function(subtrahend, max)
	{
		var differenceUnwrapped = this - subtrahend;
		var differenceAbsolute = Math.abs(differenceUnwrapped);
		var differenceAbsoluteLeastSoFar = differenceAbsolute;
		var returnValue = differenceUnwrapped;

		for (var i = -1; i <= 1; i += 2)
		{
			var differenceWrapped = differenceUnwrapped + max * i;
			differenceAbsolute = Math.abs(differenceWrapped);
			if (differenceAbsolute < differenceAbsoluteLeastSoFar)
			{
				differenceAbsoluteLeastSoFar = differenceAbsolute;
				returnValue = differenceWrapped;
			}
		}

		return returnValue;
	};

	Number.prototype.trimToRangeMax = function(max)
	{
		return this.trimToRangeMinMax(0, max);
	};

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
	};

	Number.prototype.wrapToRangeMax = function(max)
	{
		return this.wrapToRangeMinMax(0, max);
	};

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
	};

	Number.prototype.wrapToRangeZeroOne = function()
	{
		return this.wrapToRangeMinMax(0, 1);
	};
}
