
namespace ThisCouldBeBetter.GameFramework
{

export class Killable implements EntityProperty
{
	integrityMax: number;
	_damageApply: (u: Universe, w: World, p: Place, eDamager: Entity, eKillable: Entity, damageToApply: Damage) => number;
	_die: (u: Universe, w: World, p: Place, e: Entity) => void;

	integrity: number;

	constructor
	(
		integrityMax: number,
		damageApply: (u: Universe, w: World, p: Place, eDamager: Entity, eKillable: Entity, damageToApply: Damage) => number,
		die: (u: Universe, w: World, p: Place, e: Entity) => void
	)
	{
		this.integrityMax = integrityMax;
		this._damageApply = damageApply;
		this._die = die;

		this.integrity = this.integrityMax;
	}

	damageApply
	(
		universe: Universe, world: World, place: Place, entityDamager: Entity,
		entityKillable: Entity, damageToApply: Damage
	): number
	{
		var damageApplied;
		if (this._damageApply == null)
		{
			damageApplied = (damageToApply == null ? entityDamager.damager().damagePerHit.amount : damageToApply.amount);
			entityKillable.killable().integritySubtract(damageApplied);
		}
		else
		{
			damageApplied = this._damageApply(universe, world, place, entityDamager, entityKillable, damageToApply);
		}
		return damageApplied;
	}

	die(u: Universe, w: World, p: Place, e: Entity): void
	{
		if (this._die != null)
		{
			this._die(u, w, p, e);
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

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}

	updateForTimerTick(universe: Universe, world: World, place: Place, entityKillable: Entity)
	{
		if (this.isAlive() == false)
		{
			place.entitiesToRemove.push(entityKillable);
			this.die(universe, world, place, entityKillable);
		}
	}

	// cloneable

	clone(): Killable
	{
		return new Killable(this.integrityMax, this._damageApply, this._die);
	}

}

}
