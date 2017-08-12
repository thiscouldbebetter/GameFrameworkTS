
function NumberHelper()
{
	// static class
}

{
	NumberHelper.trimValueToRangeMinMax = function(value, min, max)
	{
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

	
	NumberHelper.wrapValueToRangeMinMax = function(value, min, max)
	{
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
