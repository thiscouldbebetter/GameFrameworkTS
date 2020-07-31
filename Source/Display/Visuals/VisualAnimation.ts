
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

	frameCurrent(world: World, drawable: Drawable)
	{
		var frameIndexCurrent = this.frameIndexCurrent(world, drawable);
		var frameCurrent = this.frames[frameIndexCurrent];
		return frameCurrent;
	};

	frameIndexCurrent(world: World, drawable: Drawable)
	{
		var returnValue = -1;

		var ticksSinceStarted = world.timerTicksSoFar - drawable.tickStarted;

		if (ticksSinceStarted >= this.ticksToComplete)
		{
			if (this.isRepeating)
			{
				ticksSinceStarted = ticksSinceStarted % this.ticksToComplete;
			}
			else
			{
				returnValue = this.frames.length - 1;
			}
		}

		if (returnValue < 0)
		{
			var ticksForFramesSoFar = 0;
			var f = 0;
			for (f = 0; f < this.ticksToHoldFrames.length; f++)
			{
				var ticksToHoldFrame = this.ticksToHoldFrames[f];
				ticksForFramesSoFar += ticksToHoldFrame;
				if (ticksForFramesSoFar >= ticksSinceStarted)
				{
					break;
				}
			}
			returnValue = f;
		}

		return returnValue;
	};

	isComplete(world: World, drawable: Drawable)
	{
		var ticksSinceStarted = world.timerTicksSoFar - drawable.tickStarted;
		var returnValue = (ticksSinceStarted >= this.ticksToComplete);
		return returnValue;
	};

	update(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var drawable = entity.drawable();

		if (drawable.tickStarted == null)
		{
			drawable.tickStarted = world.timerTicksSoFar;
		}

		var frameCurrent = this.frameCurrent(world, drawable);
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
