
class VisualAnimation implements Visual
{
	name: string;
	ticksToHoldFrames: number[];
	frames: Visual[];
	isRepeating: boolean;

	ticksToComplete: number;

	constructor(name: string, ticksToHoldFrames: number[], frames: Visual[], isRepeating: boolean)
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

		this.ticksToComplete = 0;
		for (var f = 0; f < this.ticksToHoldFrames.length; f++)
		{
			this.ticksToComplete += this.ticksToHoldFrames[f];
		}
	}

	// visual

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		this.update(universe, world, display, entity);
	};

	frameCurrent(drawable: Drawable)
	{
		var frameIndexCurrent = this.frameIndexCurrent(drawable);
		var frameCurrent = this.frames[frameIndexCurrent];
		return frameCurrent;
	};

	frameIndexCurrent(drawable: Drawable)
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

	isComplete(drawable: Drawable)
	{
		var returnValue = (drawable.ticksSinceStarted >= this.ticksToComplete);
		return returnValue;
	};

	update(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var drawable = entity.drawable();
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
					NumberHelper.wrapToRangeMinMax(drawable.ticksSinceStarted, 0, this.ticksToComplete);
			}
			else
			{
				drawable.ticksSinceStarted =
					NumberHelper.trimToRangeMax(drawable.ticksSinceStarted, this.ticksToComplete - 1);
			}
		}

		var frameCurrent = this.frameCurrent(drawable);
		frameCurrent.draw(universe, world, display, entity);
	};

	// Clonable.

	clone()
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}

}
