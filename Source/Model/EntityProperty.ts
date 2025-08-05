
namespace ThisCouldBeBetter.GameFramework
{

export interface EntityProperty
{
	finalize(uwpe: UniverseWorldPlaceEntities): void;
	initialize(uwpe: UniverseWorldPlaceEntities): void;
	propertyName(): string;
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void;
}

export class EntityPropertyBase<T extends EntityProperty> implements EntityProperty, Equatable<T>, Clonable<T>
{
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return this.constructor.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	clone(): T { throw new Error("todo"); }
	overwriteWith(other: T): T { throw new Error("todo"); }
	equals(other: T): boolean { throw new Error("todo"); }
}

}
