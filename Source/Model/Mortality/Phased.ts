
class Phased extends EntityProperty
{
	tickBorn: number;
	phases: Phase[];

	constructor(tickBorn: number, phases: Phase[])
	{
		super();
		this.tickBorn = tickBorn;
		this.phases = phases;
	}

	phaseCurrent(world: World)
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

	clone()
	{
		return new Phased(this.tickBorn, ArrayHelper.clone(this.phases));
	}

	overwriteWith(other: Phased)
	{
		ArrayHelper.overwriteWith(this.phases, other.phases);
		this.tickBorn = other.tickBorn;
		return this;
	}
}

class Phase
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

	clone()
	{
		return this;
	}

	overwriteWith(other: Phase)
	{
		return this;
	}
}
