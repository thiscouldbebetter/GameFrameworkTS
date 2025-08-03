
namespace ThisCouldBeBetter.GameFramework
{

export class TimerHelper
{
	ticksPerSecond: number;
	millisecondsPerTick: number;
	systemTimerHandle: number;

	handleEventTimerTick: () => void;
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

	static default(): TimerHelper
	{
		return TimerHelper.fromTicksPerSecond(25);
	}

	static fromTicksPerSecond(ticksPerSecond: number): TimerHelper
	{
		return new TimerHelper(ticksPerSecond);
	}

	initialize(handleEventTimerTick: () => void): void
	{
		this.handleEventTimerTick = handleEventTimerTick;

		this.ticksSoFar = 0;

		if (this.ticksPerSecond > 0)
		{
			this.systemTimerHandle = setInterval
			(
				this.tick.bind(this), this.millisecondsPerTick
			);
		}
	}

	tick(): void
	{
		this.handleEventTimerTick();
		this.ticksSoFar++;
	}

	ticksToStringH_M_S(ticksToConvert: number): string
	{
		return this.ticksToString(ticksToConvert, " h ", " m ", " s");
	}

	ticksToStringHColonMColonS(ticksToConvert: number): string
	{
		return this.ticksToString(ticksToConvert, ":", ":", "");
	}

	ticksToStringHours_Minutes_Seconds(ticksToConvert: number): string
	{
		return this.ticksToString(ticksToConvert, " hours ", " minutes ", " seconds");
	}

	ticksToSeconds(ticksToConvert: number): number
	{
		var secondsTotal = Math.floor
		(
			ticksToConvert / this.ticksPerSecond
		);

		return secondsTotal;
	}

	ticksToString
	(
		ticksToConvert: number,
		unitStringHours: string,
		unitStringMinutes: string,
		unitStringSeconds: string
	): string
	{
		var secondsTotal = this.ticksToSeconds(ticksToConvert);
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
