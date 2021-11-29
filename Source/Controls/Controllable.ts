
namespace ThisCouldBeBetter.GameFramework
{

export class Controllable implements EntityProperty<Controllable>
{
	toControl: (uwpe: UniverseWorldPlaceEntities) => ControlBase;

	constructor(toControl: (uwpe: UniverseWorldPlaceEntities)=>ControlBase)
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
