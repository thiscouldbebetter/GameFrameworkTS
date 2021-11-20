
namespace ThisCouldBeBetter.GameFramework
{

export class Recurrent implements EntityProperty<Recurrent>
{
	ticksPerRecurrence: number;
	timesToRecur: number;
	recur: (uwpe: UniverseWorldPlaceEntities) => void;

	timesRecurredSoFar: number;
	ticksUntilRecurrence: number;

	constructor
	(
		ticksPerRecurrence: number,
		timesToRecur: number,
		recur: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.ticksPerRecurrence = ticksPerRecurrence;
		this.timesToRecur = timesToRecur;
		this.recur = recur;

		this.timesRecurredSoFar = 0;
		this.ticksUntilRecurrence = this.ticksPerRecurrence;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.timesRecurredSoFar < this.timesToRecur)
		{
			this.ticksUntilRecurrence--;
			if (this.ticksUntilRecurrence <= 0)
			{
				this.ticksUntilRecurrence = this.ticksPerRecurrence;
				this.timesRecurredSoFar++;
				this.recur(uwpe);
			}
		}
	}

	// cloneable

	clone(): Recurrent
	{
		return new Recurrent(this.ticksPerRecurrence, this.timesToRecur, this.recur);
	}

	// Equatable

	equals(other: Recurrent): boolean { return false; } // todo

}

}
