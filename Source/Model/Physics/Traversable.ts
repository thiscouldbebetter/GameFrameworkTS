
namespace ThisCouldBeBetter.GameFramework
{

export class Traversable implements EntityProperty<Traversable>
{
	isBlocking: boolean

	constructor(isBlocking: boolean)
	{
		this.isBlocking = isBlocking;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Traversable): boolean { return false; } // todo

}

}
