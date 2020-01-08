
function Killable(integrityMax, die, damageApply)
{
	this.integrityMax = integrityMax;
	this.die = die;
	this._damageApply = damageApply;

	this.integrity = this.integrityMax;
}
{
	Killable.prototype.damageApply = function(universe, world, place, entityDamager, entityKillable, damageToApply)
	{
		var damageApplied;
		if (this._damageApply == null)
		{
			damageApplied = (damageToApply == null ? entityDamager.Damager.damagePerHit : damageToApply);
			entityKillable.Killable.integrityAdd(0 - damageApplied);
		}
		else
		{
			damageApplied = this._damageApply(universe, world, place, entityDamager, entityKillable, damageToApply);
		}
		return damageApplied;
	};

	Killable.prototype.integrityAdd = function(amountToAdd)
	{
		this.integrity += amountToAdd;
		this.integrity = this.integrity.trimToRangeMax
		(
			this.integrityMax
		);
	};

	Killable.prototype.updateForTimerTick = function(universe, world, place, entityKillable)
	{
		if (this.integrity <= 0)
		{
			place.entitiesToRemove.push(entityKillable);
			if (this.die != null)
			{
				this.die(universe, world, place, entityKillable);
			}
		}
	};

	// cloneable

	Killable.prototype.clone = function()
	{
		return new Killable(this.integrityMax, this.die, this._damageApply);
	};
}
