
namespace ThisCouldBeBetter.GameFramework
{

export class Killable implements EntityProperty
{
	integrityMax: number;
	_damageApply:
	(
		uwpe: UniverseWorldPlaceEntities, damageToApply: Damage
	) => number;
	_die: (uwpe: UniverseWorldPlaceEntities) => void;

	integrity: number;

	constructor
	(
		integrityMax: number,
		damageApply:
		(
			uwpe: UniverseWorldPlaceEntities, damageToApply: Damage
		) => number,
		die: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.integrityMax = integrityMax;
		this._damageApply = damageApply;
		this._die = die;

		this.integrity = this.integrityMax;
	}

	static fromIntegrityMax(integrityMax: number): Killable
	{
		return new Killable(integrityMax, null, null);
	}

	damageApply
	(
		uwpe: UniverseWorldPlaceEntities, damageToApply: Damage
	): number
	{
		var universe = uwpe.universe;
		var entityKillable = uwpe.entity;
		var entityDamager = uwpe.entity2;

		var damageApplied;
		if (this._damageApply == null)
		{
			var randomizer = universe.randomizer;

			damageApplied =
			(
				damageToApply == null
				? entityDamager.damager().damagePerHit.amount(randomizer)
				: damageToApply.amount(randomizer)
			);

			var killable = entityKillable.killable();
			killable.integritySubtract(damageApplied);
		}
		else
		{
			damageApplied = this._damageApply(uwpe, damageToApply);
		}
		return damageApplied;
	}

	die(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._die != null)
		{
			this._die(uwpe);
		}
	}

	integrityAdd(amountToAdd: number): void
	{
		this.integrity += amountToAdd;
		this.integrity = NumberHelper.trimToRangeMax
		(
			this.integrity,
			this.integrityMax
		);
	}

	integritySubtract(amountToSubtract: number): void
	{
		this.integrityAdd(0 - amountToSubtract);
	}

	kill(): void
	{
		this.integrity = 0;
	}

	isAlive(): boolean
	{
		return (this.integrity > 0);
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick
	(
		uwpe: UniverseWorldPlaceEntities
	): void
	{
		if (this.isAlive() == false)
		{
			var place = uwpe.place;
			var entityKillable = uwpe.entity;
			place.entityToRemoveAdd(entityKillable);
			this.die(uwpe);
		}
	}

	// cloneable

	clone(): Killable
	{
		return new Killable(this.integrityMax, this._damageApply, this._die);
	}

}

}
