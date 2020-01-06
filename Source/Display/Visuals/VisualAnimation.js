
function VisualAnimation(name, ticksToHoldFrames, frames, isRepeating)
{
	this.name = name;
	this.ticksToHoldFrames = ticksToHoldFrames;
	this.frames = frames;
	this.isRepeating = (isRepeating == null ? true : isRepeating);

	if (this.ticksToHoldFrames == null)
	{
		this.ticksToHoldFrames = [];
		for (var f = 0; f < this.frames.length; f++)
		{
			this.ticksToHoldFrames.push(1);
		}
	}
	else if (isNaN(this.ticksToHoldFrames) == false)
	{
		var ticksToHoldEachFrame = this.ticksToHoldFrames;
		this.ticksToHoldFrames = [];
		for (var f = 0; f < this.frames.length; f++)
		{
			this.ticksToHoldFrames.push(ticksToHoldEachFrame);
		}
	}

	this.ticksToComplete = 0;
	for (var f = 0; f < this.ticksToHoldFrames.length; f++)
	{
		this.ticksToComplete += this.ticksToHoldFrames[f];
	}
}

{
	// visual

	VisualAnimation.prototype.draw = function(universe, world, display, drawable, entity)
	{
		this.update(universe, world, display, drawable, entity);
	};

	VisualAnimation.prototype.frameCurrent = function(drawable)
	{
		var frameIndexCurrent = this.frameIndexCurrent(drawable);
		var frameCurrent = this.frames[frameIndexCurrent];
		return frameCurrent;
	};

	VisualAnimation.prototype.frameIndexCurrent = function(drawable)
	{
		var ticksForFramesSoFar = 0;
		var ticksToHoldFrames = this.ticksToHoldFrames;
		var f = 0;
		for (f = 0; f < ticksToHoldFrames.length; f++)
		{
			var ticksToHoldFrame = ticksToHoldFrames[f];
			ticksForFramesSoFar += ticksToHoldFrame;
			if (ticksForFramesSoFar >= drawable.ticksSinceStarted)
			{
				break;
			}
		}
		return f;
	};

	VisualAnimation.prototype.isComplete = function(drawable)
	{
		var returnValue = (drawable.ticksSinceStarted >= this.ticksToComplete);
		return returnValue;
	};

	VisualAnimation.prototype.update = function(universe, world, display, drawableIgnored, entity)
	{
		var drawable = entity.Drawable;
		if (drawable.ticksSinceStarted == null)
		{
			drawable.ticksSinceStarted = Math.floor(Math.random() * this.ticksToComplete);
		}
		else
		{
			drawable.ticksSinceStarted++;
		}

		if (this.isComplete(drawable))
		{
			if (this.isRepeating)
			{
				drawable.ticksSinceStarted =
					drawable.ticksSinceStarted.wrapToRangeMinMax(0, this.ticksToComplete);
			}
			else
			{
				drawable.ticksSinceStarted =
					drawable.ticksSinceStarted.trimToRangeMax(this.ticksToComplete - 1);
			}
		}

		var frameCurrent = this.frameCurrent(drawable);
		frameCurrent.draw(universe, world, display, drawable, entity);
	};
}
