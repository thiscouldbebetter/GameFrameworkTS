
namespace ThisCouldBeBetter.GameFramework
{

export class Animatable2 implements EntityProperty<Animatable2>
{
	animationDefnGroup: AnimationDefnGroup;
	transformableAtRest: TransformableBase;
	transformableTransformed: TransformableBase;
	ticksStartedByAnimationName: Map<string,number>;

	constructor
	(
		animationDefnGroup: AnimationDefnGroup,
		transformableAtRest: TransformableBase,
		transformableTransformed: TransformableBase
	)
	{
		this.animationDefnGroup = animationDefnGroup;
		this.transformableAtRest = transformableAtRest;
		this.transformableTransformed = transformableTransformed;

		this.ticksStartedByAnimationName = new Map();
	}

	static create(): Animatable2
	{
		return new Animatable2(null, null, null);
	}

	static default(): Animatable2
	{
		return new Animatable2(null, null, null);
	}

	animationStartByName(name: string, world: World): void
	{
		if (this.ticksStartedByAnimationName.has(name) == false)
		{
			this.ticksStartedByAnimationName.set(name, world.timerTicksSoFar);
		}
	}

	animationStopByName(name: string): void
	{
		this.ticksStartedByAnimationName.delete(name);
	}

	animationWithNameStartIfNecessary(animationName: string, world: World): number
	{
		if (this.ticksStartedByAnimationName.has(animationName) == false)
		{
			this.ticksStartedByAnimationName.set(animationName, world.timerTicksSoFar);
		}
		return this.ticksStartedByAnimationName.get(animationName);
	}

	animationDefnsRunning(): AnimationDefn[]
	{
		var animationsRunningNames = this.animationsRunningNames();
		var returnValues = animationsRunningNames.map
		(
			x => this.animationDefnGroup.animationDefnsByName.get(x)
		);
		return returnValues;
	}

	animationsRunningNames(): string[]
	{
		var animationsRunningNames = Array.from
		(
			this.ticksStartedByAnimationName.keys()
		).filter
		(
			x => this.ticksStartedByAnimationName.has(x)
		);
		return animationsRunningNames;
	}

	animationsStopAll(): void
	{
		this.ticksStartedByAnimationName.clear();
	}

	transformableReset(): void
	{
		this.transformableTransformed.overwriteWith(this.transformableAtRest);
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var world = uwpe.world;
		var animationDefnsRunning = this.animationDefnsRunning();
		for (var i = 0; i < animationDefnsRunning.length; i++)
		{
			var animationDefn = animationDefnsRunning[i];
			var tickAnimationStarted =
				this.ticksStartedByAnimationName.get(animationDefn.name);
			var ticksSinceAnimationStarted =
				world.timerTicksSoFar - tickAnimationStarted;
			var transform = new Transform_Animate
			(
				animationDefn, ticksSinceAnimationStarted
			);
			this.transformableTransformed.overwriteWith
			(
				this.transformableAtRest
			);
			transform.transform(this.transformableTransformed);
		}
	}

	// Clonable.

	clone(): Animatable2
	{
		return this; // todo
	}

	overwriteWith(other: Animatable2): Animatable2
	{
		return this; // todo
	}

	// Equatable

	equals(other: Animatable2): boolean { return false; } // todo
}

}
