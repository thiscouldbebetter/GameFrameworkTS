
namespace ThisCouldBeBetter.GameFramework
{

export interface EntityProperty extends Equatable<EntityProperty>, Inactivatable<EntityProperty>
{
	finalize(uwpe: UniverseWorldPlaceEntities): void;
	initialize(uwpe: UniverseWorldPlaceEntities): void;
	propertyName(): string;
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void;
}

export class EntityPropertyBase<T extends EntityProperty> implements EntityProperty, Equatable<T>, Clonable<T>, Inactivatable<T>
{
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return this.constructor.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Clonable.

	clone(): T { throw new Error("Must be implemented on subclass!"); }
	overwriteWith(other: T): T { throw new Error("Must be implemented on subclass!"); }
	equals(other: T): boolean { throw new Error("Must be implemented on subclass!"); }

	// Inactivatable.
	_inactivated: boolean = false;
	activate(): Inactivatable<T>
	{
		this._inactivated = false;
		return this;
	}
	activated(): boolean { return (this._inactivated == false); }
	inactivate(): Inactivatable<T>
	{
		this._inactivated = true;
		return this;
	}
	inactivated(): boolean { return this._inactivated; }
}

}
