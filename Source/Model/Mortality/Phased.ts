
namespace ThisCouldBeBetter.GameFramework
{

export class Phased implements EntityProperty<Phased>
{
	phaseCurrentIndex: number;
	ticksOnPhaseCurrent: number;
	phases: Phase[];

	phasesByName: Map<string, Phase>;

	constructor
	(
		phaseCurrentIndex: number,
		ticksOnPhaseCurrent: number,
		phases: Phase[]
	)
	{
		this.phaseCurrentIndex = phaseCurrentIndex || 0;
		this.ticksOnPhaseCurrent = ticksOnPhaseCurrent || 0;
		this.phases = phases;

		this.phasesByName = ArrayHelper.addLookupsByName(this.phases);
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

	phaseByName(phaseName: string): Phase
	{
		return this.phasesByName.get(phaseName);
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

	finalize(uwpe: UniverseWorldPlaceEntities): void {}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		for (var i = 0; i <= this.phaseCurrentIndex; i++)
		{
			var phase = this.phases[i];
			phase.enter(uwpe);
		}
	}

	propertyName(): string { return Phased.name; }

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

	// Equatable

	equals(other: Phased): boolean { return false; } // todo

}

export class Phase
{
	name: string;
	durationInTicks: number;
	_enter: (uwpe: UniverseWorldPlaceEntities) => void;

	constructor
	(
		name: string,
		durationInTicks: number,
		enter: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.name = name;
		this.durationInTicks = durationInTicks;
		this._enter = enter;
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
		return new Phase(this.name, this.durationInTicks, this._enter);
	}

	overwriteWith(other: Phase): Phase
	{
		this.name = other.name;
		this.durationInTicks = other.durationInTicks;
		this._enter = other.enter;
		return this;
	}
}

}
