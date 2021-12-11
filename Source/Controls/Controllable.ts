
namespace ThisCouldBeBetter.GameFramework
{

export class Controllable implements EntityProperty<Controllable>
{
	toControl:
	(
		uwpe: UniverseWorldPlaceEntities, controlTypeName: string
	) => ControlBase;

	constructor
	(
		toControl: (uwpe: UniverseWorldPlaceEntities, controlTypeName: string) => ControlBase
	)
	{
		this.toControl = toControl;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Controllable): boolean { return false; } // todo
}

}
