
function TimerHelper(ticksPerSecond)
{
	this.ticksPerSecond = ticksPerSecond;
	
	var millisecondsPerSecond = 1000;
	this.millisecondsPerTick = Math.floor
	(
		millisecondsPerSecond / this.ticksPerSecond
	);
}

{
	TimerHelper.prototype.initialize = function(handleEventTimerTick)
	{
		this.timer = setInterval
		(
			handleEventTimerTick,
			this.millisecondsPerTick
		);
	}
}