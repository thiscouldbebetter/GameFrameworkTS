
namespace ThisCouldBeBetter.GameFramework
{

export class Killable extends EntityPropertyBase<Killable>
{
	ticksOfImmunityInitial: number;
	integrityMax: number;
	_damageApply:
	(
		uwpe: UniverseWorldPlaceEntities, damageToApply: Damage
	) => number;
	_die: (uwpe: UniverseWorldPlaceEntities) => void;
	livesInReserve: number;

	deathIsIgnored: boolean; // For debugging.
	integrity: number;
	ticksOfImmunityRemaining: number;

	constructor
	(
		ticksOfImmunityInitial: number,
		integrityMax: number,
		damageApply:
		(
			uwpe: UniverseWorldPlaceEntities, damageToApply: Damage
		) => number,
		die: (uwpe: UniverseWorldPlaceEntities) => void,
		livesInReserve: number
	)
	{
		super();

		this.ticksOfImmunityInitial = ticksOfImmunityInitial || 0;
		this.integrityMax = integrityMax || 1;
		this._damageApply = damageApply;
		this._die = die;
		this.livesInReserve = livesInReserve || 0;

		this.ticksOfImmunityRemaining = this.ticksOfImmunityInitial;
		this.deathIsIgnored = false;
		this.integritySetToMax();
	}

	static fromDie
	(
		die: (uwpe: UniverseWorldPlaceEntities) => void
	): Killable
	{
		return new Killable(null, null, null, die, null);
	}

	static default(): Killable
	{
		return Killable.fromIntegrityMax(1);
	}

	static fromIntegrityMax(integrityMax: number): Killable
	{
		return new Killable(null, integrityMax, null, null, null);
	}

	static fromIntegrityMaxAndDie
	(
		integrityMax: number,
		die: (uwpe: UniverseWorldPlaceEntities) => void
	): Killable
	{
		return new Killable(null, integrityMax, null, die, null);
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
		return new Killable(null, integrityMax, damageApply, die, null);
	}

	static fromTicksOfImmunity
	(
		ticksOfImmunityInitial: number
	): Killable
	{
		return new Killable(ticksOfImmunityInitial, null, null, null, null);
	}

	static fromTicksOfImmunityAndDie
	(
		ticksOfImmunityInitial: number,
		die: (uwpe: UniverseWorldPlaceEntities) => void
	): Killable
	{
		return new Killable(ticksOfImmunityInitial, null, null, die, null);
	}

	static fromTicksOfImmunityDieAndLives
	(
		ticksOfImmunityInitial: number,
		die: (uwpe: UniverseWorldPlaceEntities) => void,
		livesInReserve: number
	): Killable
	{
		return new Killable(ticksOfImmunityInitial, null, null, die, livesInReserve);
	}

	static fromTicksOfImmunityIntegrityMaxAndDie
	(
		ticksOfImmunityInitial: number,
		integrityMax: number,
		die: (uwpe: UniverseWorldPlaceEntities) => void
	): Killable
	{
		return new Killable(ticksOfImmunityInitial, integrityMax, null, die, null);
	}

	static fromTicksOfImmunityIntegrityMaxDamageApplyDieAndLives
	(
		ticksOfImmunityInitial: number,
		integrityMax: number,
		damageApply:
		(
			uwpe: UniverseWorldPlaceEntities, damageToApply: Damage
		) => number,
		die: (uwpe: UniverseWorldPlaceEntities) => void,
		livesInReserve: number
	): Killable
	{
		return new Killable
		(
			ticksOfImmunityInitial, integrityMax, damageApply, die, livesInReserve
		);
	}

	static of(entity: Entity): Killable
	{
		return entity.propertyByName(Killable.name) as Killable;
	}

	damageApply
	(
		uwpe: UniverseWorldPlaceEntities, damageToApply: Damage
	): void
	{
		if (damageToApply == null)
		{
			// Do nothing.
		}
		else if (this.immunityIsInEffect() )
		{
			// Do nothing.
		}
		else if (this._damageApply == null)
		{
			this.damageApply_Default(uwpe, damageToApply);
		}
		else
		{
			this._damageApply(uwpe, damageToApply);
		}
	}

	damageApply_Default
	(
		uwpe: UniverseWorldPlaceEntities, damageToApply: Damage
	)
	{
		var universe = uwpe.universe;
		var entityDamager = uwpe.entity;
		var entityKillable = uwpe.entity2;

		var randomizer = universe.randomizer;

		var damageApplied =
			damageToApply == null
			? Damager.of(entityDamager).damagePerHit.amount(randomizer)
			: damageToApply.amount(randomizer);

		var killable = Killable.of(entityKillable);
		killable.integritySubtract(damageApplied);
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
		var integrityToSet =
			this.integrity + amountToAdd;

		integrityToSet = NumberHelper.trimToRangeMax
		(
			integrityToSet,
			this.integrityMax
		);
		this.integritySet(integrityToSet);
	}

	integrityCurrentOverMax(): string
	{
		return this.integrity + "/" + this.integrityMax;
	}

	integrityMaxSet(value: number): Killable
	{
		this.integrityMax = value;
		return this;
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

	immunityIsInEffect(): boolean
	{
		return (this.ticksOfImmunityRemaining > 0);
	}

	isAlive(): boolean
	{
		return (this.integrity > 0 || this.deathIsIgnored);
	}

	kill(): void
	{
		this.integritySet(0);
	}

	livesInReserveSet(value: number): Killable
	{
		this.livesInReserve = value;
		return this;
	}

	ticksOfImmunityInitialSet(value: number): Killable
	{
		this.ticksOfImmunityInitial = value;
		return this;
	}

	ticksOfImmunityRemainingReset(): void
	{
		this.ticksOfImmunityRemaining = this.ticksOfImmunityInitial;
	}

	// EntityProperty.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.ticksOfImmunityRemainingReset();
	}

	updateForTimerTick
	(
		uwpe: UniverseWorldPlaceEntities
	): void
	{
		var immunityIsInEffect = this.immunityIsInEffect();
		if (immunityIsInEffect)
		{
			this.ticksOfImmunityRemaining--;
		}
		else
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
	}

	// Clonable.

	clone(): Killable
	{
		return new Killable
		(
			this.ticksOfImmunityInitial,
			this.integrityMax,
			this._damageApply,
			this._die,
			this.livesInReserve
		);
	}

	overwriteWith(other: Killable): Killable
	{
		this.ticksOfImmunityInitial = other.ticksOfImmunityInitial;
		this.integrityMax = other.integrityMax;
		this._damageApply = other._damageApply;
		this._die = other._die;
		this.livesInReserve = other.livesInReserve;

		this.integrity = other.integrity;
		this.ticksOfImmunityRemaining = other.ticksOfImmunityRemaining;

		return this;
	}
}

}
