
namespace ThisCouldBeBetter.GameFramework
{

export class Equippable implements EntityProperty<Equippable>
{
	_equip: (uwpe: UniverseWorldPlaceEntities) => void;
	_unequip: (uwpe: UniverseWorldPlaceEntities) => void;

	isEquipped: boolean;

	constructor
	(
		equip: (uwpe: UniverseWorldPlaceEntities) => void,
		unequip: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this._equip = equip;
		this._unequip = unequip;
		this.isEquipped = false;
	}

	static default(): Equippable
	{
		return new Equippable(null, null);
	}

	equip(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._equip != null)
		{
			this._equip(uwpe);
		}
		this.isEquipped = true;
	}

	unequip(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._unequip != null)
		{
			this._unequip(uwpe);
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

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Equippable): boolean { return false; } // todo

}

}
