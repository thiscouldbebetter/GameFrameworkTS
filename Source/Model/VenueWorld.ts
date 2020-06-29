
class VenueWorld
{
	constructor(world)
	{
		this.name = "World";
		this.world = world;
	}

	draw(universe)
	{
		this.world.draw(universe);
	};

	finalize(universe)
	{
		universe.soundHelper.soundForMusic.pause(universe);
	};

	initialize(universe)
	{
		universe.world = this.world;
		this.world.initialize(universe);

		var soundHelper = universe.soundHelper;
		soundHelper.soundWithNamePlayAsMusic(universe, "Music");
	};

	updateForTimerTick(universe)
	{
		this.world.updateForTimerTick(universe);
		this.draw(universe);
	};
}
