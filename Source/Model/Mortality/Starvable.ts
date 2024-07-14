
namespace ThisCouldBeBetter.GameFramework
{

export class Starvable implements EntityProperty<Starvable>
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
		this.satietyLostPerTick = satietyLostPerTick || 1;
		this._starve = starve;

		this.satiety = this.satietyMax;
	}

	static fromSatietyMax(satietyMax: number): Starvable
	{
		return new Starvable(satietyMax, null, null);
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

	propertyName(): string { return Starvable.name; }

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
			if (this.satiety < 0)
			{
				this.satiety = 0;
			}
		}
	}

	// cloneable

	clone(): Starvable
	{
		return new Starvable(this.satietyMax, this.satietyLostPerTick, this._starve);
	}

	overwriteWith(other: Starvable): Starvable { return this; }

	// Equatable

	equals(other: Starvable): boolean { return false; } // todo

}

}
