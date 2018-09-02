
function VisualAnimation(name, ticksPerFrame, frames, isRepeating)
{
	this.name = name;
	this.ticksPerFrame = ticksPerFrame;
	this.frames = frames;
	this.isRepeating = (isRepeating == null ? true : isRepeating);

	this.ticksToComplete = this.frames.length * this.ticksPerFrame;
}

{
	// visual
	
	VisualAnimation.prototype.draw = function(universe, world, display, drawable)
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
		animationRun.update(universe, world, display, drawable);
	}
}

function AnimationRun(defn)
{
	this.defn = defn;
	this.ticksSinceStarted = 0;
}
{
	AnimationRun.prototype.frameCurrent = function()
	{
		var frameIndexCurrent = this.frameIndexCurrent();
		var frameCurrent = this.defn.frames[frameIndexCurrent];
		return frameCurrent;
	}

	AnimationRun.prototype.frameIndexCurrent = function()
	{
		return Math.floor(this.ticksSinceStarted / this.defn.ticksPerFrame);
	}
	
	AnimationRun.prototype.isComplete = function()
	{
		var returnValue = (this.ticksSinceStarted >= this.defn.ticksToComplete);
		return returnValue;
	}

	AnimationRun.prototype.update = function(universe, world, display, drawable)
	{
		var frameCurrent = this.frameCurrent();
		frameCurrent.draw(universe, world, display, drawable);

		this.ticksSinceStarted++;
		
		if (this.isComplete() == true)
		{
			if (this.defn.isRepeating == true)
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
	}
}
