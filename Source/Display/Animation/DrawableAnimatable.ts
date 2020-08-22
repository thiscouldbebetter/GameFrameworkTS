
class DrawableAnimatable
{
	ticksStartedByAnimationName: Map<string, number>;

	constructor()
	{
		this.ticksStartedByAnimationName = new Map<string, number>();
	}

	animationStartByName(name: string, world: World)
	{
		this.ticksStartedByAnimationName.set(name, world.timerTicksSoFar);
	}

	animationStopByName(name: string)
	{
		this.ticksStartedByAnimationName.delete(name);
	}

	animationsRunningNames()
	{
		var animationsRunningNames = Array.from(this.ticksStartedByAnimationName.keys()).filter
		(
			x => this.ticksStartedByAnimationName.has(x)
		);
		return animationsRunningNames;
	}

	animationWithNameStartIfNecessary(animationName: string, world: World)
	{
		if (this.ticksStartedByAnimationName.has(animationName) == false)
		{
			this.ticksStartedByAnimationName.set(animationName, world.timerTicksSoFar);
		}
		return this.ticksStartedByAnimationName.get(animationName);
	}
}
