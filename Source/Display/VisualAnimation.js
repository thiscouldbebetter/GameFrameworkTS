
function VisualAnimation(ticksPerFrame, frames)
{
	this.ticksPerFrame = ticksPerFrame;
	this.frames = frames;

	this.ticksToComplete = this.frames.length * this.ticksPerFrame;
}

{
	// visual
	VisualAnimation.prototype.draw = function(universe, world, display, drawable)
	{
		var ticksSinceStarted = drawable.timerTicksSinceAnimationStarted;
		if (ticksSinceStarted == null)
		{
			ticksSinceStarted = 0;
			drawable.timerTicksSinceAnimationStarted = ticksSinceStarted;
		}

		var frameIndexCurrent = Math.floor(ticksSinceStarted / this.ticksPerFrame);
		var frameCurrent = this.frames[frameIndexCurrent];
		frameCurrent.draw(universe, world, display, drawable);

		ticksSinceStarted++;
		ticksSinceStarted = ticksSinceStarted.wrapToRangeMinMax
		(
			0, this.ticksToComplete
		);
		drawable.timerTicksSinceAnimationStarted = ticksSinceStarted;
	}
}