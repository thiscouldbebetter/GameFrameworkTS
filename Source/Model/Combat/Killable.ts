
class Killable
{
	integrityMax: number;
	_damageApply: any;
	die: any;
	itemDefnCorpse: ItemDefn;

	integrity: number;

	constructor(integrityMax: number, damageApply: any, die: any, itemDefnCorpse: ItemDefn)
	{
		this.integrityMax = integrityMax;
		this._damageApply = damageApply;
		this.die = die;
		this.itemDefnCorpse = itemDefnCorpse;

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
