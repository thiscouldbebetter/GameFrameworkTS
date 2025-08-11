
namespace ThisCouldBeBetter.GameFramework
{

export class Phased extends EntityPropertyBase<Phased>
{
	phaseCurrentIndex: number;
	ticksOnPhaseCurrent: number;
	phases: Phase[];

	constructor
	(
		phaseCurrentIndex: number,
		ticksOnPhaseCurrent: number,
		phases: Phase[]
	)
	{
		super();

		this.phaseCurrentIndex = phaseCurrentIndex || 0;
		this.ticksOnPhaseCurrent = ticksOnPhaseCurrent || 0;
		this.phases = phases;

		for (var i = 0; i < this.phases.length; i++)
		{
			var phase = this.phases[i];
			phase.index = i;
		}
	}

	static fromPhaseStartNameAndPhases
	(
		phaseStartName: string, phases: Phase[]
	): Phased
	{
		var returnValue = new Phased(0, 0, phases);
		returnValue.phaseCurrentSetByName(phaseStartName);
		return returnValue;
	}

	static fromPhases(phases: Phase[]): Phased
	{
		return new Phased(0, 0, phases);
	}

	static of(entity: Entity): Phased
	{
		return entity.propertyByName(Phased.name) as Phased;
	}

	phaseByName(phaseName: string): Phase
	{
		return this.phases.find(x => x.name == phaseName);
	}

	phaseCurrent(): Phase
	{
		return this.phases[this.phaseCurrentIndex];
	}

	phaseCurrentSetByName(phaseName: string): Phase
	{
		var phase = this.phaseByName(phaseName);
		var phaseIndex = this.phases.indexOf(phase);
		this.phaseCurrentIndex = phaseIndex;
		return phase;
	}

	reset(): Phased
	{
		this.phaseCurrentIndex = 0;
		this.ticksOnPhaseCurrent = 0;
		return this;
	}

	// EntityProperty.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		for (var i = 0; i <= this.phaseCurrentIndex; i++)
		{
			var phase = this.phases[i];
			phase.enter(uwpe);
		}
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities)
	{
		this.ticksOnPhaseCurrent++;

		var phaseCurrent = this.phaseCurrent();
		if (this.ticksOnPhaseCurrent >= phaseCurrent.durationInTicks)
		{
			this.phaseCurrentIndex++;
			this.ticksOnPhaseCurrent = 0;

			phaseCurrent = this.phaseCurrent();
			phaseCurrent.enter(uwpe);
		}
	}

	// Clonable.

	clone(): Phased
	{
		return new Phased
		(
			this.phaseCurrentIndex,
			this.ticksOnPhaseCurrent,
			ArrayHelper.clone(this.phases)
		);
	}

	overwriteWith(other: Phased): Phased
	{
		ArrayHelper.overwriteWith(this.phases, other.phases);
		this.phaseCurrentIndex = other.phaseCurrentIndex;
		this.ticksOnPhaseCurrent = other.ticksOnPhaseCurrent;
		return this;
	}

}

export class Phase
{
	index: number;
	name: string;
	durationInTicks: number;
	_enter: (uwpe: UniverseWorldPlaceEntities) => void;

	constructor
	(
		index: number,
		name: string,
		durationInTicks: number,
		enter: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.index = index;
		this.name = name;
		this.durationInTicks = durationInTicks;
		this._enter = enter;
	}

	static fromIndexNameTicksAndEnter
	(
		index: number,
		name: string,
		durationInTicks: number,
		enter: (uwpe: UniverseWorldPlaceEntities) => void
	): Phase
	{
		return new Phase(index, name, durationInTicks, enter);
	}

	static fromNameTicksAndEnter
	(
		name: string,
		durationInTicks: number,
		enter: (uwpe: UniverseWorldPlaceEntities) => void
	): Phase
	{
		return new Phase(null, name, durationInTicks, enter);
	}

	enter(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._enter != null)
		{
			this._enter(uwpe);
		}
	}

	// Clonable.

	clone(): Phase
	{
		return new Phase(this.index, this.name, this.durationInTicks, this._enter);
	}

	overwriteWith(other: Phase): Phase
	{
		this.index = other.index;
		this.name = other.name;
		this.durationInTicks = other.durationInTicks;
		this._enter = other.enter;
		return this;
	}
}

}
