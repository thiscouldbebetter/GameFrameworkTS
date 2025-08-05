
namespace ThisCouldBeBetter.GameFramework
{

export class Equippable extends EntityPropertyBase<Equippable>
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
		super();

		this._equip = equip;
		this._unequip = unequip;
		this.isEquipped = false;
	}

	static default(): Equippable
	{
		return new Equippable(null, null);
	}

	static of(entity: Entity): Equippable
	{
		return entity.propertyByName(Equippable.name) as Equippable;
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
	propertyName(): string { return Equippable.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Equippable): boolean { return false; } // todo

}

}
