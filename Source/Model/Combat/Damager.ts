
namespace ThisCouldBeBetter.GameFramework
{

export class Damager extends EntityPropertyBase<Damager>
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
		super();

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

	static of(entity: Entity): Damager
	{
		return entity.propertyByName(Damager.name) as Damager;
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

	// Clonable.
	clone(): Damager { return this; }
	overwriteWith(other: Damager): Damager { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return Damager.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		this.ticksUntilCanAttempt--;
	}

	// Equatable

	equals(other: Damager): boolean { return false; } // todo
}

}
