
namespace ThisCouldBeBetter.GameFramework
{

export interface EntityProperty extends Equatable<EntityProperty>
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

	clone(): T { throw new Error("Must be implemented on subclass!"); }
	overwriteWith(other: T): T { throw new Error("Must be implemented on subclass!"); }
	equals(other: T): boolean { throw new Error("Must be implemented on subclass!"); }
}

}
