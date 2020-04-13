
class Killable
{
	constructor(integrityMax, damageApply, die, itemDefnCorpse)
	{
		this.integrityMax = integrityMax;
		this._damageApply = damageApply;
		this.die = die;
		this.itemDefnCorpse = itemDefnCorpse;

		this.integrity = this.integrityMax;
	}

	damageApply(universe, world, place, entityDamager, entityKillable, damageToApply)
	{
		var damageApplied;
		if (this._damageApply == null)
		{
			damageApplied = (damageToApply == null ? entityDamager.damager.damagePerHit : damageToApply);
			entityKillable.killable.integrityAdd(0 - damageApplied);
		}
		else
		{
			damageApplied = this._damageApply(universe, world, place, entityDamager, entityKillable, damageToApply);
		}
		return damageApplied;
	};

	integrityAdd(amountToAdd)
	{
		this.integrity += amountToAdd;
		this.integrity = this.integrity.trimToRangeMax
		(
			this.integrityMax
		);
	};

	isAlive()
	{
		return (this.integrity > 0);
	};

	updateForTimerTick(universe, world, place, entityKillable)
	{
		if (this.isAlive() == false)
		{
			place.entitiesToRemove.push(entityKillable);
			if (this.die != null)
			{
				this.die(universe, world, place, entityKillable);
			}
		}
	};

	// cloneable

	clone()
	{
		return new Killable(this.integrityMax, this._damageApply, this.die, this.itemDefnCorpse);
	};
}
