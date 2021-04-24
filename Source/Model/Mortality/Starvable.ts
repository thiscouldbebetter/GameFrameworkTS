
namespace ThisCouldBeBetter.GameFramework
{

export class Starvable implements EntityProperty
{
	satietyMax: number;
	satietyLostPerTick: number;
	_starve: (u: Universe, w: World, p: Place, e: Entity) => void;

	satiety: number;

	constructor
	(
		satietyMax: number,
		satietyLostPerTick: number,
		starve: (u: Universe, w: World, p: Place, e: Entity) => void
	)
	{
		this.satietyMax = satietyMax;
		this.satietyLostPerTick = satietyLostPerTick;
		this._starve = starve;

		this.satiety = this.satietyMax;
	}

	starve(u: Universe, w: World, p: Place, e: Entity): void
	{
		if (this._starve != null)
		{
			this._starve(u, w, p, e);
		}
	}

	satietyAdd(amountToAdd: number): void
	{
		this.satiety += amountToAdd;
		this.satiety = NumberHelper.trimToRangeMax
		(
			this.satiety, this.satietyMax
		);
	}

	satietySubtract(amountToSubtract: number): void
	{
		this.satietyAdd(0 - amountToSubtract);
	}

	isStarving(): boolean
	{
		return (this.satiety <= 0);
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}

	updateForTimerTick
	(
		universe: Universe, world: World, place: Place, entityStarvable: Entity
	): void
	{
		if (this.isStarving())
		{
			this.starve(universe, world, place, entityStarvable);
		}
		else
		{
			this.satiety -= this.satietyLostPerTick;
		}
	}

	// cloneable

	clone(): Starvable
	{
		return new Starvable(this.satietyMax, this.satietyLostPerTick, this._starve);
	}
}

}
