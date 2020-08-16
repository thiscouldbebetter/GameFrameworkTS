
class Equippable extends EntityProperty
{
	_equip: (u: Universe, w: World, p: Place, e: Entity) => void;
	_unequip: (u: Universe, w: World, p: Place, e: Entity) => void;

	isEquipped: boolean;

	constructor
	(
		equip: (u: Universe, w: World, p: Place, e: Entity) => void,
		unequip: (u: Universe, w: World, p: Place, e: Entity) => void
	)
	{
		super();
		this._equip = equip;
		this._unequip = unequip;
		this.isEquipped = false;
	}

	equip(u: Universe, w: World, p: Place, e: Entity)
	{
		if (this._equip != null)
		{
			this._equip(u, w, p, e);
		}
		this.isEquipped = true;
	}

	unequip(u: Universe, w: World, p: Place, e: Entity)
	{
		if (this._unequip != null)
		{
			this._unequip(u, w, p, e);
		}
		this.isEquipped = false;
	}

	// Clonable.

	clone(): Equippable
	{
		return this;
	}

	overwriteWith(other: Equippable)
	{
		return this;
	} 
}
