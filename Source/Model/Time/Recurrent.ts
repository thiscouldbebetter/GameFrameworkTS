
namespace ThisCouldBeBetter.GameFramework
{

export class Recurrent implements EntityProperty
{
	ticksPerRecurrence: number;
	timesToRecur: number;
	recur: any;

	timesRecurredSoFar: number;
	ticksUntilRecurrence: number;

	constructor(ticksPerRecurrence: number, timesToRecur: number, recur: any)
	{
		this.ticksPerRecurrence = ticksPerRecurrence;
		this.timesToRecur = timesToRecur;
		this.recur = recur;

		this.timesRecurredSoFar = 0;
		this.ticksUntilRecurrence = this.ticksPerRecurrence;
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity): void
	{
		if (this.timesRecurredSoFar < this.timesToRecur)
		{
			this.ticksUntilRecurrence--;
			if (this.ticksUntilRecurrence <= 0)
			{
				this.ticksUntilRecurrence = this.ticksPerRecurrence;
				this.timesRecurredSoFar++;
				this.recur(universe, world, place, entity);
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
