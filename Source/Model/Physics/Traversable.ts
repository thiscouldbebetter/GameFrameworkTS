
namespace ThisCouldBeBetter.GameFramework
{

export class Traversable implements EntityProperty<Traversable>
{
	isBlocking: boolean

	constructor(isBlocking: boolean)
	{
		this.isBlocking = isBlocking;
	}

	static of(entity: Entity): Traversable
	{
		return entity.propertyByName(Traversable.name) as Traversable;
	}

	// Clonable.
	clone(): Traversable { return this; }
	overwriteWith(other: Traversable): Traversable { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return Traversable.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Traversable): boolean { return false; } // todo

}

}
