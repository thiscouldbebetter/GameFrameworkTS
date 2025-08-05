
namespace ThisCouldBeBetter.GameFramework
{

export class Recurrent extends EntityPropertyBase<Recurrent>
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
		super();

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

}

}
