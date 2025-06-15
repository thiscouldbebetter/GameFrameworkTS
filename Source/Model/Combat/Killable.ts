
namespace ThisCouldBeBetter.GameFramework
{

export class Killable implements EntityProperty<Killable>
{
	integrityMax: number;
	_damageApply:
	(
		uwpe: UniverseWorldPlaceEntities, damageToApply: Damage
	) => number;
	_die: (uwpe: UniverseWorldPlaceEntities) => void;

	deathIsIgnored: boolean; // For debugging.
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

		this.deathIsIgnored = false;
		this.integritySetToMax();
	}

	static fromIntegrityMaxDamageApplyAndDie
	(
		integrityMax: number,
		damageApply:
		(
			uwpe: UniverseWorldPlaceEntities, damageToApply: Damage
		) => number,
		die: (uwpe: UniverseWorldPlaceEntities) => void
	): Killable
	{
		return new Killable(integrityMax, damageApply, die);
	}

	static default(): Killable
	{
		return Killable.fromIntegrityMax(1);
	}

	static fromIntegrityMax(integrityMax: number): Killable
	{
		return new Killable(integrityMax, null, null);
	}

	static fromIntegrityMaxAndDie
	(
		integrityMax: number,
		die: (uwpe: UniverseWorldPlaceEntities) => void
	): Killable
	{
		return new Killable(integrityMax, null, die);
	}

	static of(entity: Entity): Killable
	{
		return entity.propertyByName(Killable.name) as Killable;
	}

	damageApply
	(
		uwpe: UniverseWorldPlaceEntities, damageToApply: Damage
	): number
	{
		if (damageToApply == null)
		{
			return 0;
		}

		var universe = uwpe.universe;
		var entityDamager = uwpe.entity;
		var entityKillable = uwpe.entity2;

		var damageApplied;
		if (this._damageApply == null)
		{
			var randomizer = universe.randomizer;

			damageApplied =
			(
				damageToApply == null
				? Damager.of(entityDamager).damagePerHit.amount(randomizer)
				: damageToApply.amount(randomizer)
			);

			var killable = Killable.of(entityKillable);
			killable.integritySubtract(damageApplied);
		}
		else
		{
			damageApplied = this._damageApply(uwpe, damageToApply);
		}
		return damageApplied;
	}

	deathIsIgnoredSet(value: boolean): Killable
	{
		this.deathIsIgnored = value;
		return this;
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
		var integrityToSet = this.integrity + amountToAdd;
		integrityToSet = NumberHelper.trimToRangeMax
		(
			this.integrity,
			this.integrityMax
		);
		this.integritySet(integrityToSet);
	}

	integrityCurrentOverMax(): string
	{
		return this.integrity + "/" + this.integrityMax;
	}

	integritySet(value: number): Killable
	{
		this.integrity = value;
		return this;
	}

	integritySetToMax(): void
	{
		this.integritySet(this.integrityMax);
	}

	integritySubtract(amountToSubtract: number): void
	{
		this.integrityAdd(0 - amountToSubtract);
	}

	kill(): void
	{
		this.integritySet(0);
	}

	isAlive(): boolean
	{
		return (this.integrity > 0 || this.deathIsIgnored);
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	propertyName(): string { return Killable.name; }

	updateForTimerTick
	(
		uwpe: UniverseWorldPlaceEntities
	): void
	{
		var killableIsAlive = this.isAlive();
		if (killableIsAlive == false)
		{
			var place = uwpe.place;
			var entityKillable = uwpe.entity;
			place.entityToRemoveAdd(entityKillable);
			this.die(uwpe);
		}
	}

	// Clonable.

	clone(): Killable
	{
		return new Killable(this.integrityMax, this._damageApply, this._die);
	}

	overwriteWith(other: Killable): Killable { return this; }

	// Equatable

	equals(other: Killable): boolean { return false; } // todo
}

}
