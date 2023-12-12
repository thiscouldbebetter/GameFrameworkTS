
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
	clone(): Controllable { return this; }
	overwriteWith(other: Controllable): Controllable { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Controllable): boolean { return false; } // todo
}

}
