
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

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity): void
	{
		// Do nothing.
	}
}

}

