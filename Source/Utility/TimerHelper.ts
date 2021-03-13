
namespace ThisCouldBeBetter.GameFramework
{

export class TimerHelper
{
	ticksPerSecond: number;
	millisecondsPerTick: number;
	timer: any;

	handleEventTimerTick: any;
	ticksSoFar: number;

	constructor(ticksPerSecond: number)
	{
		this.ticksPerSecond = ticksPerSecond;

		var millisecondsPerSecond = 1000;
		this.millisecondsPerTick = Math.floor
		(
			millisecondsPerSecond / this.ticksPerSecond
		);
	}

	initialize(handleEventTimerTick: any)
	{
		this.handleEventTimerTick = handleEventTimerTick;

		this.ticksSoFar = 0;

		this.timer = setInterval
		(
			this.tick.bind(this), this.millisecondsPerTick
		);
	}

	tick()
	{
		this.handleEventTimerTick();
		this.ticksSoFar++;
	}

	ticksToStringH_M_S(ticksToConvert: number)
	{
		return this.ticksToString(ticksToConvert, " h ", " m ", " s");
	}

	ticksToStringHColonMColonS(ticksToConvert: number)
	{
		return this.ticksToString(ticksToConvert, ":", ":", "");
	}

	ticksToStringHours_Minutes_Seconds(ticksToConvert: number)
	{
		return this.ticksToString(ticksToConvert, " hours ", " minutes ", " seconds");
	}

	ticksToString
	(
		ticksToConvert: number, unitStringHours: string,
		unitStringMinutes: string, unitStringSeconds: string
	)
	{
		var secondsTotal = Math.floor
		(
			ticksToConvert / this.ticksPerSecond
		);
		var minutesTotal = Math.floor(secondsTotal / 60);
		var hoursTotal = Math.floor(minutesTotal / 60);

		var timeAsString =
			hoursTotal + unitStringHours
			+ (minutesTotal % 60) + unitStringMinutes
			+ (secondsTotal % 60) + unitStringSeconds

		return timeAsString;
	}
}

}
