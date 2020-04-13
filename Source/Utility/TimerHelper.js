
class TimerHelper
{
	constructor(ticksPerSecond)
	{
		this.ticksPerSecond = ticksPerSecond;

		var millisecondsPerSecond = 1000;
		this.millisecondsPerTick = Math.floor
		(
			millisecondsPerSecond / this.ticksPerSecond
		);
	}

	initialize(handleEventTimerTick)
	{
		this.timer = setInterval
		(
			handleEventTimerTick,
			this.millisecondsPerTick
		);
	};
}
