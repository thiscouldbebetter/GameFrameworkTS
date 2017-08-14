
function VisualAnimation(ticksPerFrame, frames)
{
	this.ticksPerFrame = ticksPerFrame;
	this.frames = frames;
	
	this.ticksToComplete = this.frames.length * this.ticksPerFrame;
}

{
	// visual
	
	VisualAnimation.prototype.drawToDisplayForDrawableAndLoc = function(display, drawable, loc)
	{
		var world = Globals.Instance.universe.world;
		var ticksSoFar = (world.timerTicksSoFar - loc.timeOffsetInTicks) % this.ticksToComplete;
		var frameIndexCurrent = Math.floor(ticksSoFar / this.ticksPerFrame);
		var frameCurrent = this.frames[frameIndexCurrent];
		frameCurrent.drawToDisplayForDrawableAndLoc(display, drawable, loc);
	}
}