
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

	static of(entity: Entity): Recurrent
	{
		return entity.propertyByName(Recurrent.name) as Recurrent;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	propertyName(): string { return Recurrent.name; }

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

	overwriteWith(other: Recurrent): Recurrent { return this; }

	// Equatable

	equals(other: Recurrent): boolean { return false; } // todo

}

}
