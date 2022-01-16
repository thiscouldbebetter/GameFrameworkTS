
namespace ThisCouldBeBetter.GameFramework
{

export class Damager implements EntityProperty<Damager>
{
	damagePerHit: Damage;
	ticksPerAttempt: number
	chanceOfHitPerAttempt: number;

	ticksUntilCanAttempt: number;

	constructor
	(
		damagePerHit: Damage,
		ticksPerAttempt: number,
		chanceOfHitPerAttempt: number
	)
	{
		this.damagePerHit = damagePerHit;
		this.ticksPerAttempt = ticksPerAttempt || 20;
		this.chanceOfHitPerAttempt = chanceOfHitPerAttempt || 1;

		this.ticksUntilCanAttempt = 0;
	}

	static default(): Damager
	{
		return Damager.fromDamagePerHit(Damage.default());
	}

	static fromDamagePerHit(damagePerHit: Damage): Damager
	{
		return new Damager(damagePerHit, null, null);
	}

	damageToApply(universe: Universe): Damage
	{
		var returnDamage: Damage = null;

		if (this.ticksUntilCanAttempt <= 0)
		{
			this.ticksUntilCanAttempt = this.ticksPerAttempt;

			var randomNumber = universe.randomizer.fraction();

			var doesAttemptSucceed =
				(randomNumber < this.chanceOfHitPerAttempt);

			if (doesAttemptSucceed)
			{
				returnDamage = this.damagePerHit;
			}
		}

		return returnDamage;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		this.ticksUntilCanAttempt--;
	}

	// Equatable

	equals(other: Damager): boolean { return false; } // todo
}

}
