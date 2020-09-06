
class ValueBreakGroup
{
	stops: ValueBreak[];
	interpolationMode: InterpolationMode;

	constructor(stops: ValueBreak[], interpolationMode: InterpolationMode)
	{
		this.stops = stops;
		this.interpolationMode = interpolationMode;
	}

	valueAtPosition(positionToCheck: number)
	{
		var returnValue = null;

		var stopPrev = this.stops[0];
		var stop;

		for (var i = 1; i < this.stops.length; i++)
		{
			stop = this.stops[i];
			if
			(
				positionToCheck >= stopPrev.position
				&& positionToCheck <= stop.position
			)
			{
				break;
			}
			stopPrev = stop;
		}

		if (this.interpolationMode != null)
		{
			var stopPrevValue = stopPrev.value as Interpolatable;
			var stopValue = stop.value as Interpolatable;
			var positionOfStopThisMinusPrev = stop.position - stopPrev.position;
			var positionToCheckMinusStopPrev = positionToCheck - stopPrev.position;
			var fraction = positionToCheckMinusStopPrev / positionOfStopThisMinusPrev;
			fraction = this.interpolationMode.fractionAdjust(fraction);
			var valueInterpolated = stopPrevValue.interpolateWith(stopValue, fraction);
			returnValue = valueInterpolated;
		}
		else
		{
			returnValue = stopPrev.value;
		}

		return returnValue;
	}
}

class ValueBreak
{
	position: number;
	value: any;

	constructor(position: number, value: any)
	{
		this.position = position;
		this.value = value;
	}
}
