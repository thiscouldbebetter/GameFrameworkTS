
namespace ThisCouldBeBetter.GameFramework
{

export class Tirable implements EntityProperty
{
	staminaMaxAfterSleep: number;
	staminaRecoveredPerTick: number;
	staminaMaxLostPerTick: number;
	staminaMaxRecoveredPerTickOfSleep: number;
	_fallAsleep: (uwpe: UniverseWorldPlaceEntities) => void;

	staminaMaxRemainingBeforeSleep: number;
	stamina: number;

	constructor
	(
		staminaMaxAfterSleep: number,
		staminaRecoveredPerTick: number,
		staminaMaxLostPerTick: number,
		staminaMaxRecoveredPerTickOfSleep: number,
		fallAsleep: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.staminaMaxAfterSleep = staminaMaxAfterSleep;
		this.staminaRecoveredPerTick = staminaRecoveredPerTick;
		this.staminaMaxLostPerTick = staminaMaxLostPerTick;
		this.staminaMaxRecoveredPerTickOfSleep = staminaMaxRecoveredPerTickOfSleep;
		this._fallAsleep = fallAsleep;

		this.stamina = this.staminaMaxAfterSleep;
		this.staminaMaxRemainingBeforeSleep = this.staminaMaxAfterSleep;
	}

	fallAsleep(uwpe: UniverseWorldPlaceEntities): void
	{
		var staminaMaxToRecover =
			this.staminaMaxAfterSleep - this.staminaMaxRemainingBeforeSleep;
		var ticksToRecover = Math.ceil
		(
			staminaMaxToRecover / this.staminaMaxRecoveredPerTickOfSleep
		);
		var world = uwpe.world;
		world.timerTicksSoFar += ticksToRecover;

		if (this._fallAsleep != null)
		{
			this._fallAsleep(uwpe);
		}
	}

	isExhausted(): boolean
	{
		return (this.staminaMaxRemainingBeforeSleep <= 0);
	}

	staminaAdd(amountToAdd: number): void
	{
		this.stamina += amountToAdd;
		this.stamina = NumberHelper.trimToRangeMax
		(
			this.stamina, this.staminaMaxRemainingBeforeSleep
		);
	}

	staminaSubtract(amountToSubtract: number): void
	{
		this.staminaAdd(0 - amountToSubtract);
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.isExhausted())
		{
			this.fallAsleep(uwpe);
		}
		else
		{
			this.staminaMaxRemainingBeforeSleep -= this.staminaMaxLostPerTick;
			this.staminaAdd(this.staminaRecoveredPerTick);
		}
	}

	// cloneable

	clone(): Tirable
	{
		return new Tirable
		(
			this.staminaMaxAfterSleep,
			this.staminaRecoveredPerTick,
			this.staminaMaxLostPerTick,
			this.staminaMaxRecoveredPerTickOfSleep,
			this._fallAsleep
		);
	}
}

}
