
namespace ThisCouldBeBetter.GameFramework
{

export class Modellable implements EntityProperty
{
	model: any;

	constructor(model: any)
	{
		this.model = model;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}
}

}

