
class TimerHelper
{
	ticksPerSecond: number;
	millisecondsPerTick: number;
	timer: any;

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
		this.timer = setInterval
		(
			handleEventTimerTick,
			this.millisecondsPerTick
		);
	};
}
