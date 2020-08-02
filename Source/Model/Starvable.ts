
class Starvable
{
	satietyMax: number;
	_starve: (u: Universe, w: World, p: Place, e: Entity) => void;

	satiety: number;

	constructor
	(
		satietyMax: number,
		starve: (u: Universe, w: World, p: Place, e: Entity) => void
	)
	{
		this.satietyMax = satietyMax;
		this._starve = starve;

		this.satiety = this.satietyMax;
	}

	starve(u: Universe, w: World, p: Place, e: Entity)
	{
		if (this._starve != null)
		{
			this._starve(u, w, p, e);
		}
	}

	satietyAdd(amountToAdd: number)
	{
		this.satiety += amountToAdd;
		this.satiety = NumberHelper.trimToRangeMax
		(
			this.satiety, this.satietyMax
		);
	}

	satietySubtract(amountToSubtract: number)
	{
		this.satietyAdd(0 - amountToSubtract);
	}

	isAlive()
	{
		return (this.satiety > 0);
	};

	updateForTimerTick(universe: Universe, world: World, place: Place, entityStarvable: Entity)
	{
		if (this.isAlive())
		{
			this.satiety--;
		}
		else
		{
			place.entitiesToRemove.push(entityStarvable);
			this.starve(universe, world, place, entityStarvable);
		}
	};

	// cloneable

	clone()
	{
		return new Starvable(this.satietyMax, this._starve);
	};
}
