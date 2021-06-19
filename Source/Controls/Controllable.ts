
namespace ThisCouldBeBetter.GameFramework
{

export class Controllable implements EntityProperty
{
	toControl: any;

	constructor(toControl: any)
	{
		this.toControl = toControl;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
}

}
