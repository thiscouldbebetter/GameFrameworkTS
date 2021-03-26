
namespace ThisCouldBeBetter.GameFramework
{

export class NumberHelper
{
	// static class

	static isInRangeMinMax(n: number, min: number, max: number)
	{
		return (n >= min && n <= max);
	}

	static reflectNumberOffRange(numberToReflect: number, rangeMin: number, rangeMax: number)
	{
		while (numberToReflect < rangeMin)
		{
			numberToReflect = rangeMin + rangeMin - numberToReflect;
		}

		while (numberToReflect > rangeMax)
		{
			numberToReflect = rangeMax - (numberToReflect - rangeMax);
		}

		return NumberHelper.trimToRangeMinMax(numberToReflect, rangeMin, rangeMax);
	}

	static roundToDecimalPlaces(n: number, numberOfPlaces: number)
	{
		var multiplier = Math.pow(10, numberOfPlaces);
		return Math.round(n * multiplier) / multiplier;
	}

	static subtractWrappedToRangeMax(n: number, subtrahend: number, max: number)
	{
		var differenceUnwrapped = n - subtrahend;
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
	}

	static trimToRangeMax(n: number, max: number)
	{
		return NumberHelper.trimToRangeMinMax(n, 0, max);
	}

	static trimToRangeMinMax(n: number, min: number, max: number)
	{
		var value = n;

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

	static wrapToRangeMax(n: number, max: number)
	{
		return NumberHelper.wrapToRangeMinMax(n, 0, max);
	}

	static wrapToRangeMinMax(n: number, min: number, max: number)
	{
		var value = n;

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

	static wrapToRangeZeroOne(n: number)
	{
		return NumberHelper.wrapToRangeMinMax(n, 0, 1);
	}
}

}
