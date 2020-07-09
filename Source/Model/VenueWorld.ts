
class VenueWorld implements Venue
{
	name: string;
	world: World;

	constructor(world: World)
	{
		this.name = "World";
		this.world = world;
	}

	draw(universe: Universe)
	{
		this.world.draw(universe);
	};

	finalize(universe: Universe)
	{
		universe.soundHelper.soundForMusic.pause(universe);
	};

	initialize(universe: Universe)
	{
		universe.world = this.world;
		this.world.initialize(universe);

		var soundHelper = universe.soundHelper;
		soundHelper.soundWithNamePlayAsMusic(universe, "Music");
	};

	updateForTimerTick(universe: Universe)
	{
		this.world.updateForTimerTick(universe);
		this.draw(universe);
	};
}
