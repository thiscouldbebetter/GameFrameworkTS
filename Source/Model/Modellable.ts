
class Modellable extends EntityProperty
{
	model: any;

	constructor(model: any)
	{
		super();
		this.model = model;
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		// Do nothing.
	};
}

