
namespace ThisCouldBeBetter.GameFramework
{

export class ValueBreakGroup<T extends Interpolatable<T>>
{
	stops: ValueBreak<T>[];
	interpolationMode: InterpolationMode;

	constructor
	(
		stops: ValueBreak<T>[],
		interpolationMode: InterpolationMode
	)
	{
		this.stops = stops;
		this.interpolationMode = interpolationMode;
	}

	valueAtPosition(positionToCheck: number): T
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
			var stopPrevValue = stopPrev.value;
			var stopValue = stop.value;
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

export class ValueBreak<T extends Interpolatable<T>>
{
	position: number;
	value: T;

	constructor(position: number, value: T)
	{
		this.position = position;
		this.value = value;
	}
}

}
