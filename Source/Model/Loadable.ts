
namespace ThisCouldBeBetter.GameFramework
{

export class Loadable implements EntityProperty
{
	isLoaded: boolean;
	_load: (universe: Universe, world: World, place: Place, entity: Entity) => void;
	_unload: (universe: Universe, world: World, place: Place, entity: Entity) => void;

	constructor
	(
		load: (universe: Universe, world: World, place: Place, entity: Entity) => void,
		unload: (universe: Universe, world: World, place: Place, entity: Entity) => void
	)
	{
		this.isLoaded = false;
		this._load = load;
		this._unload = unload;
	}

	finalize(universe: Universe, world: World, place: Place, entity: Entity)
	{
		this.unload(universe, world, place, entity);
	}

	initialize(universe: Universe, world: World, place: Place, entity: Entity)
	{
		this.load(universe, world, place, entity);
	}

	load(universe: Universe, world: World, place: Place, entity: Entity)
	{
		if (this.isLoaded == false)
		{
			if (this._load != null)
			{
				this._load(universe, world, place, entity);
			}
			this.isLoaded = true;
		}
	}

	unload(universe: Universe, world: World, place: Place, entity: Entity)
	{
		if (this.isLoaded)
		{
			if (this._unload != null)
			{
				this._unload(universe, world, place, entity);
			}
			this.isLoaded = false;
		}
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		// Do nothing.
	}
}

}
