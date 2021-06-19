
namespace ThisCouldBeBetter.GameFramework
{

export class Usable implements EntityProperty
{
	_use: (uwpe: UniverseWorldPlaceEntities) => string;

	isDisabled: boolean;

	constructor(use: (uwpe: UniverseWorldPlaceEntities) => string)
	{
		this._use = use;

		this.isDisabled = false;
	}

	use(uwpe: UniverseWorldPlaceEntities): string
	{
		return (this.isDisabled ? null : this._use(uwpe));
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
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
}

}
