
namespace ThisCouldBeBetter.GameFramework
{

export class Usable implements EntityProperty<Usable>
{
	_use: (uwpe: UniverseWorldPlaceEntities) => void;

	isDisabled: boolean;

	constructor(use: (uwpe: UniverseWorldPlaceEntities) => void)
	{
		this._use = use;

		this.isDisabled = false;
	}

	static of(entity: Entity): Usable
	{
		return entity.propertyByName(Usable.name) as Usable;
	}

	use(uwpe: UniverseWorldPlaceEntities): void
	{
		this._use(uwpe);
	}

	// Clonable.

	clone(): Usable
	{
		return new Usable(this._use);
	}

	overwriteWith(other: Usable): Usable
	{
		this._use = other._use;
		return this;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return Usable.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Usable): boolean { return false; } // todo
}

}
