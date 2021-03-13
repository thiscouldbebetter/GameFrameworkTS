
namespace ThisCouldBeBetter.GameFramework
{

export class Recurrent extends EntityProperty
{
	ticksPerRecurrence: number;
	timesToRecur: number;
	recur: any;

	timesRecurredSoFar: number;
	ticksUntilRecurrence: number;

	constructor(ticksPerRecurrence: number, timesToRecur: number, recur: any)
	{
		super();
		this.ticksPerRecurrence = ticksPerRecurrence;
		this.timesToRecur = timesToRecur;
		this.recur = recur;

		this.timesRecurredSoFar = 0;
		this.ticksUntilRecurrence = this.ticksPerRecurrence;
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
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

	clone()
	{
		return new Recurrent(this.ticksPerRecurrence, this.timesToRecur, this.recur);
	}
}

}
