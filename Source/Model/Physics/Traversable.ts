
namespace ThisCouldBeBetter.GameFramework
{

export class Traversable implements EntityProperty<Traversable>
{
	isBlocking: boolean

	constructor(isBlocking: boolean)
	{
		this.isBlocking = isBlocking;
	}

	// Clonable.
	clone(): Traversable { throw new Error("Not yet implemented."); }
	overwriteWith(other: Traversable): Traversable { throw new Error("Not yet implemented."); }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Traversable): boolean { return false; } // todo

}

}
