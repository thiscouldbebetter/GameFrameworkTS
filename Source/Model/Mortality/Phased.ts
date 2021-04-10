
namespace ThisCouldBeBetter.GameFramework
{

export class Phased implements EntityProperty
{
	tickBorn: number;
	phases: Phase[];

	constructor(tickBorn: number, phases: Phase[])
	{
		this.tickBorn = tickBorn;
		this.phases = phases;
	}

	phaseCurrent(world: World): Phase
	{
		var returnValue = null;

		var ticksSinceBorn = world.timerTicksSoFar - this.tickBorn;
		for (var i = this.phases.length - 1; i >= 0; i--)
		{
			var phase = this.phases[i];
			var tickToRunAt = phase.tickToRunAt;
			if (ticksSinceBorn >= tickToRunAt)
			{
				returnValue = phase;
				break;
			}
		}

		return returnValue;
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}

	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity)
	{
		var ticksSinceBorn = w.timerTicksSoFar - this.tickBorn;
		for (var i = 0; i < this.phases.length; i++)
		{
			var phase = this.phases[i];
			var tickToRunAt = phase.tickToRunAt;
			if (ticksSinceBorn == tickToRunAt)
			{
				var updateToRun = phase.updateToRun;
				updateToRun(u, w, p, e);
			}
		}
	}

	// Clonable.

	clone(): Phased
	{
		return new Phased(this.tickBorn, ArrayHelper.clone(this.phases));
	}

	overwriteWith(other: Phased): Phased
	{
		ArrayHelper.overwriteWith(this.phases, other.phases);
		this.tickBorn = other.tickBorn;
		return this;
	}
}

export class Phase
{
	name: string;
	tickToRunAt: number;
	updateToRun: Function;

	constructor(name: string, tickToRunAt: number, updateToRun: Function)
	{
		this.name = name;
		this.tickToRunAt = tickToRunAt;
		this.updateToRun = updateToRun;
	}

	clone(): Phase
	{
		return this;
	}

	overwriteWith(other: Phase): Phase
	{
		return this;
	}
}

}
