
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
		if (drawable.animationRuns == null)
		{
			drawable.animationRuns = {};
		}

		var animationRun = drawable.animationRuns[this.name];
		if (animationRun == null)
		{
			animationRun = new AnimationRun(this);
			drawable.animationRuns[this.name] = animationRun;
		}
		animationRun.update(universe, world, display, drawable, entity);
	};
}

function AnimationRun(defn)
{
	this.defn = defn;
	this.ticksSinceStarted = Math.floor(Math.random() * this.defn.ticksToComplete);
}
{
	AnimationRun.prototype.frameCurrent = function()
	{
		var frameIndexCurrent = this.frameIndexCurrent();
		var frameCurrent = this.defn.frames[frameIndexCurrent];
		return frameCurrent;
	};

	AnimationRun.prototype.frameIndexCurrent = function()
	{
		var ticksForFramesSoFar = 0;
		var f = 0;
		var ticksToHoldFrames = this.defn.ticksToHoldFrames;
		for (f = 0; f < ticksToHoldFrames.length; f++)
		{
			var ticksToHoldFrame = ticksToHoldFrames[f];
			ticksForFramesSoFar += ticksToHoldFrame;
			if (ticksForFramesSoFar >= this.ticksSinceStarted)
			{
				break;
			}
		}
		return f;
	};

	AnimationRun.prototype.isComplete = function()
	{
		var returnValue = (this.ticksSinceStarted >= this.defn.ticksToComplete);
		return returnValue;
	};

	AnimationRun.prototype.update = function(universe, world, display, drawable, entity)
	{
		var frameCurrent = this.frameCurrent();
		frameCurrent.draw(universe, world, display, drawable, entity);

		this.ticksSinceStarted++;

		if (this.isComplete())
		{
			if (this.defn.isRepeating)
			{
				this.ticksSinceStarted =
					this.ticksSinceStarted.wrapToRangeMinMax(0, this.defn.ticksToComplete);
			}
			else
			{
				this.ticksSinceStarted =
					this.ticksSinceStarted.trimToRangeMax(this.defn.ticksToComplete - 1);
			}
		}
	};
}
