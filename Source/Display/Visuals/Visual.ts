
namespace ThisCouldBeBetter.GameFramework
{

export interface Visual extends Clonable<Visual>, Transformable<Visual>
{
	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void;
	initialize(uwpe: UniverseWorldPlaceEntities): void;
	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean;
}

export class VisualBase<T extends Visual> implements Visual, Clonable<T>, Transformable<T>
{
	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void { throw new Error("Must be implemented in subclass!"); }
	
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean { return true; }

	// Clonable.

	clone(): T { throw new Error("Must be implemented on subclass!"); }
	overwriteWith(other: T): T { throw new Error("Must be implemented on subclass!"); }
	equals(other: T): boolean { throw new Error("Must be implemented on subclass!"); }

	// Transformable.

	transform(transformToApply: TransformBase): T { throw new Error("Must be implemented in subclass!"); }

}


}
