
class Tirable extends EntityProperty
{
	staminaMaxAfterSleep: number;
	staminaMaxLostPerTick: number;
	staminaMaxRecoveredPerTickOfSleep: number;
	_fallAsleep: (u: Universe, w: World, p: Place, e: Entity) => void;

	staminaMaxRemainingBeforeSleep: number;
	stamina: number;

	constructor
	(
		staminaMaxAfterSleep: number,
		staminaMaxLostPerTick: number,
		staminaMaxRecoveredPerTickOfSleep: number,
		fallAsleep: (u: Universe, w: World, p: Place, e: Entity) => void
	)
	{
		super();
		this.staminaMaxAfterSleep = staminaMaxAfterSleep;
		this.staminaMaxLostPerTick = staminaMaxLostPerTick;
		this.staminaMaxRecoveredPerTickOfSleep = staminaMaxRecoveredPerTickOfSleep;
		this._fallAsleep = fallAsleep;

		this.stamina = this.staminaMaxAfterSleep;
		this.staminaMaxRemainingBeforeSleep = this.staminaMaxAfterSleep;
	}

	fallAsleep(u: Universe, w: World, p: Place, e: Entity)
	{
		var staminaMaxToRecover =
			this.staminaMaxAfterSleep - this.staminaMaxRemainingBeforeSleep;
		var ticksToRecover = Math.ceil
		(
			staminaMaxToRecover / this.staminaMaxRecoveredPerTickOfSleep
		);
		w.timerTicksSoFar += ticksToRecover;

		if (this._fallAsleep != null)
		{
			this._fallAsleep(u, w, p, e);
		}
	}

	isExhausted()
	{
		return (this.staminaMaxRemainingBeforeSleep <= 0);
	}

	staminaAdd(amountToAdd: number)
	{
		this.stamina += amountToAdd;
		this.stamina = NumberHelper.trimToRangeMax
		(
			this.stamina, this.staminaMaxRemainingBeforeSleep
		);
	}

	staminaSubtract(amountToSubtract: number)
	{
		this.staminaAdd(0 - amountToSubtract);
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entityStarvable: Entity)
	{
		if (this.isExhausted())
		{
			this.fallAsleep(universe, world, place, entityStarvable);
		}
		else
		{
			this.staminaMaxRemainingBeforeSleep -= this.staminaMaxLostPerTick;
			this.stamina = NumberHelper.trimToRangeMax
			(
				this.stamina, this.staminaMaxRemainingBeforeSleep
			);
		}
	}

	// cloneable

	clone()
	{
		return new Tirable
		(
			this.staminaMaxAfterSleep,
			this.staminaMaxLostPerTick,
			this.staminaMaxRecoveredPerTickOfSleep,
			this._fallAsleep
		);
	}
}
