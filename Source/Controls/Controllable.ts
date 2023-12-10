
namespace ThisCouldBeBetter.GameFramework
{

export class Controllable implements EntityProperty<Controllable>
{
	toControl:
	(
		uwpe: UniverseWorldPlaceEntities,
		size: Coords,
		controlTypeName: string
	) => ControlBase;

	constructor
	(
		toControl:
		(
			uwpe: UniverseWorldPlaceEntities,
			size: Coords,
			controlTypeName: string
		) => ControlBase
	)
	{
		this.toControl = toControl;
	}

	// Clonable.
	clone(): Controllable { throw new Error("Not yet implemented."); }
	overwriteWith(other: Controllable): Controllable { throw new Error("Not yet implemented."); }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Controllable): boolean { return false; } // todo
}

}
