
function NumberHelper()
{
	// static class
}

{
	NumberHelper.wrapValueToRangeMinMax = function(value, min, max)
	{
		var rangeSize = max - min;

		if (rangeSize == 0)
		{
			value = min;
		}
		else
		{
			while (value < 0)
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