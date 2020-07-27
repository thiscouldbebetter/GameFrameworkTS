
class Killable
{
	integrityMax: number;
	_damageApply: (u: Universe, w: World, p: Place, eDamager: Entity, eKillable: Entity, damageToApply: number) => void;
	_die: (u: Universe, w: World, p: Place, e: Entity) => void;

	integrity: number;

	constructor
	(
		integrityMax: number,
		damageApply: (u: Universe, w: World, p: Place, eDamager: Entity, eKillable: Entity, damageToApply: number) => void,
		die: (u: Universe, w: World, p: Place, e: Entity) => void
	)
	{
		this.integrityMax = integrityMax;
		this._damageApply = damageApply;
		this._die = die;

		this.integrity = this.integrityMax;
	}

	damageApply(universe: Universe, world: World, place: Place, entityDamager: Entity, entityKillable: Entity, damageToApply: number)
	{
		var damageApplied;
		if (this._damageApply == null)
		{
			damageApplied = (damageToApply == null ? entityDamager.damager().damagePerHit : damageToApply);
			entityKillable.killable().integrityAdd(0 - damageApplied);
		}
		else
		{
			damageApplied = this._damageApply(universe, world, place, entityDamager, entityKillable, damageToApply);
		}
		return damageApplied;
	};

	die(u: Universe, w: World, p: Place, e: Entity)
	{
		if (this._die != null)
		{
			this._die(u, w, p, e);
		}
	}

	integrityAdd(amountToAdd: number)
	{
		this.integrity += amountToAdd;
		this.integrity = NumberHelper.trimToRangeMax
		(
			this.integrity,
			this.integrityMax
		);
	};

	isAlive()
	{
		return (this.integrity > 0);
	};

	updateForTimerTick(universe: Universe, world: World, place: Place, entityKillable: Entity)
	{
		if (this.isAlive() == false)
		{
			place.entitiesToRemove.push(entityKillable);
			this.die(universe, world, place, entityKillable);
		}
	};

	// cloneable

	clone()
	{
		return new Killable(this.integrityMax, this._damageApply, this._die);
	};
}