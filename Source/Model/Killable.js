
function Killable(integrityMax, die)
{
	this.integrityMax = integrityMax;
	this.die = die;

	this.integrity = this.integrityMax;
}
{
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
		return new Killable(this.integrityMax, this.die);
	}
}
