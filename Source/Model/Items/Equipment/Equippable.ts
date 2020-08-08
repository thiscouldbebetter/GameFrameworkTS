
class Equippable
{
	_equip: (u: Universe, w: World, p: Place, e: Entity) => void;

	constructor(equip: (u: Universe, w: World, p: Place, e: Entity) => void)
	{
		this._equip = equip;
	}

	equip(u: Universe, w: World, p: Place, e: Entity)
	{
		this._equip(u, w, p, e);
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
