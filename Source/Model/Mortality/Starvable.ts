
namespace ThisCouldBeBetter.GameFramework
{

export class Starvable implements EntityProperty
{
	satietyMax: number;
	satietyLostPerTick: number;
	_starve: (uwpe: UniverseWorldPlaceEntities) => void;

	satiety: number;

	constructor
	(
		satietyMax: number,
		satietyLostPerTick: number,
		starve: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.satietyMax = satietyMax;
		this.satietyLostPerTick = satietyLostPerTick;
		this._starve = starve;

		this.satiety = this.satietyMax;
	}

	starve(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._starve != null)
		{
			this._starve(uwpe);
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

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick
	(
		uwpe: UniverseWorldPlaceEntities
	): void
	{
		if (this.isStarving())
		{
			this.starve(uwpe);
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
