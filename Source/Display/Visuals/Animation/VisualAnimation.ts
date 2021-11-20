
namespace ThisCouldBeBetter.GameFramework
{

export class VisualAnimation implements Visual<VisualAnimation>
{
	name: string;
	ticksToHoldFrames: number[];
	frames: VisualBase[];
	isRepeating: boolean;

	ticksToComplete: number;

	constructor
	(
		name: string,
		ticksToHoldFrames: number[],
		frames: VisualBase[],
		isRepeating: boolean
	)
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
		else if (this.ticksToHoldFrames.length < this.frames.length)
		{
			for (var f = 0; f < this.frames.length; f++)
			{
				if (f >= this.ticksToHoldFrames.length)
				{
					this.ticksToHoldFrames.push(this.ticksToHoldFrames[f % this.ticksToHoldFrames.length]);
				}
			}
		}

		this.ticksToComplete = 0;
		for (var f = 0; f < this.ticksToHoldFrames.length; f++)
		{
			this.ticksToComplete += this.ticksToHoldFrames[f];
		}
	}

	frameCurrent(world: World, tickStarted: number)
	{
		var frameIndexCurrent = this.frameIndexCurrent(world, tickStarted);
		var frameCurrent = this.frames[frameIndexCurrent];
		return frameCurrent;
	}

	frameIndexCurrent(world: World, tickStarted: number)
	{
		var returnValue = -1;

		var ticksSinceStarted = world.timerTicksSoFar - tickStarted;

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
	}

	isComplete(world: World, tickStarted: number)
	{
		var ticksSinceStarted = world.timerTicksSoFar - tickStarted;
		var returnValue = (ticksSinceStarted >= this.ticksToComplete);
		return returnValue;
	}

	// Visual.

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var world = uwpe.world;
		var entity = uwpe.entity;

		var animatable = entity.animatable();
		var tickStarted = animatable.animationWithNameStartIfNecessary(this.name, world);
		var frameCurrent = this.frameCurrent(world, tickStarted);
		frameCurrent.draw(uwpe, display);
	}

	// Clonable.

	clone(): VisualAnimation
	{
		return this; // todo
	}

	overwriteWith(other: VisualAnimation): VisualAnimation
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualAnimation
	{
		return this; // todo
	}
}

}
