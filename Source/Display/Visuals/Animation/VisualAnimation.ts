
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
		this.ticksToHoldFrames = ticksToHoldFrames || frames.map(x => 1);
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
					this.ticksToHoldFrames.push
					(
						this.ticksToHoldFrames[f % this.ticksToHoldFrames.length]
					);
				}
			}
		}

		this.ticksToComplete = 0;
		for (var f = 0; f < this.ticksToHoldFrames.length; f++)
		{
			this.ticksToComplete += this.ticksToHoldFrames[f];
		}
	}

	static fromNameTicksToHoldFramesAndFramesNonRepeating
	(
		name: string,
		ticksToHoldFrames: number[],
		frames: VisualBase[]
	): VisualAnimation
	{
		return new VisualAnimation
		(
			name,
			ticksToHoldFrames,
			frames,
			false // repeating
		);
	}

	static fromNameTicksToHoldFramesAndFramesRepeating
	(
		name: string,
		ticksToHoldFrames: number[],
		frames: VisualBase[]
	): VisualAnimation
	{
		return new VisualAnimation
		(
			name,
			ticksToHoldFrames,
			frames,
			true // repeating
		);
	}

	static fromTicksToHoldFramesAndFramesNonRepeating
	(
		ticksToHoldFrames: number,
		frames: VisualBase[]
	): VisualAnimation
	{
		return new VisualAnimation
		(
			null, // name
			[ ticksToHoldFrames ],
			frames,
			false // isRepeating
		);
	}

	static fromTicksToHoldFramesAndFramesRepeating
	(
		ticksToHoldFrames: number,
		frames: VisualBase[]
	): VisualAnimation
	{
		return new VisualAnimation
		(
			null, // name
			[ ticksToHoldFrames ],
			frames,
			true // isRepeating
		);
	}

	static fromFrames
	(
		frames: VisualBase[]
	): VisualAnimation
	{
		var name = VisualAnimation.name + frames[0].constructor.name + frames.length;
		return this.fromNameAndFrames(name, frames);
	}

	static fromFramesRepeating
	(
		frames: VisualBase[]
	): VisualAnimation
	{
		var name = VisualAnimation.name + frames[0].constructor.name + frames.length;
		return this.fromNameFramesAndIsRepeating(name, frames, true);
	}

	static fromNameAndFrames
	(
		name: string, frames: VisualBase[]
	): VisualAnimation
	{
		return VisualAnimation.fromNameFramesAndIsRepeating
		(
			name, frames, false // isRepeating - This should probably be true, which is the default, but it hasn't been.
		);
	}

	static fromNameFramesAndIsRepeating
	(
		name: string,
		frames: VisualBase[],
		isRepeating: boolean
	): VisualAnimation
	{
		var ticksToHoldFrames = frames.map(x => 1);

		var returnValue = new VisualAnimation
		(
			name,
			ticksToHoldFrames,
			frames,
			isRepeating
		);
		return returnValue;
	}

	frameCurrent(world: World, tickStarted: number): VisualBase
	{
		var frameIndexCurrent = this.frameIndexCurrent(world, tickStarted);
		var frameCurrent = this.frames[frameIndexCurrent];
		return frameCurrent;
	}

	frameIndexCurrent(world: World, tickStarted: number): number
	{
		var returnValue = null;

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

		if (returnValue == null)
		{
			var ticksForFramesSoFar = 0;
			var f = 0;
			for (f = 0; f < this.ticksToHoldFrames.length; f++)
			{
				var ticksToHoldFrame = this.ticksToHoldFrames[f];
				ticksForFramesSoFar += ticksToHoldFrame;
				if (ticksForFramesSoFar > ticksSinceStarted)
				{
					break;
				}
			}
			returnValue = f;
		}

		return returnValue;
	}

	isComplete(world: World, tickStarted: number): boolean
	{
		var ticksSinceStarted = world.timerTicksSoFar - tickStarted;
		var returnValue = (ticksSinceStarted >= this.ticksToComplete);
		return returnValue;
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.frames.forEach(x => x.initialize(uwpe) );
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		if (this._initializeIsComplete == false)
		{
			this._initializeIsComplete =
				(this.frames.some(x => x.initializeIsComplete(uwpe) == false) == false);
		}
		return this._initializeIsComplete;
	}
	private _initializeIsComplete: boolean;

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var world = uwpe.world;
		var entity = uwpe.entity;

		var animatable =
			Animatable2 == null
			? null
			: Animatable2.of(entity);

		var tickStarted =
			animatable == null
			? 0
			: animatable.animationWithNameStartIfNecessary(this.name, world);
		var frameCurrent = this.frameCurrent(world, tickStarted);
		frameCurrent.draw(uwpe, display);
	}

	// Clonable.

	clone(): VisualAnimation
	{
		return new VisualAnimation
		(
			this.name,
			this.ticksToHoldFrames.map(x => x),
			this.frames.map(x => x.clone() ),
			this.isRepeating
		)
	}

	overwriteWith(other: VisualAnimation): VisualAnimation
	{
		this.name = other.name;
		for (var i = 0; i < this.ticksToHoldFrames.length; i++)
		{
			this.ticksToHoldFrames[i] = other.ticksToHoldFrames[i];
			this.frames[i].overwriteWith(other.frames[i]);
		}
		this.isRepeating = other.isRepeating;
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualAnimation
	{
		this.frames.forEach(x => x.transform(transformToApply) );
		return this;
	}
}

}
