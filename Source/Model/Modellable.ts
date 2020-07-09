
class Modellable
{
	model: any;

	constructor(model: any)
	{
		this.model = model;
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		// Do nothing.
	};
}

