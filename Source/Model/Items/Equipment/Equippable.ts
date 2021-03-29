
namespace ThisCouldBeBetter.GameFramework
{

export class Equippable extends EntityProperty
{
	_equip: (u: Universe, w: World, p: Place, eEquipmentUser: Entity, eEquippable: Entity) => void;
	_unequip: (u: Universe, w: World, p: Place, eEquipmentUser: Entity, eEquippable: Entity) => void;

	isEquipped: boolean;

	constructor
	(
		equip: (u: Universe, w: World, p: Place, eEquipmentUser: Entity, eEquippable: Entity) => void,
		unequip: (u: Universe, w: World, p: Place, eEquipmentUser: Entity, eEquippable: Entity) => void
	)
	{
		super();
		this._equip = equip;
		this._unequip = unequip;
		this.isEquipped = false;
	}

	static create(): Equippable
	{
		return new Equippable(null, null);
	}

	equip(u: Universe, w: World, p: Place, eEquipmentUser: Entity, eEquippable: Entity): void
	{
		if (this._equip != null)
		{
			this._equip(u, w, p, eEquipmentUser, eEquippable);
		}
		this.isEquipped = true;
	}

	unequip(u: Universe, w: World, p: Place, eEquipmentUser: Entity, eEquippable: Entity): void
	{
		if (this._unequip != null)
		{
			this._unequip(u, w, p, eEquipmentUser, eEquippable);
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

}
