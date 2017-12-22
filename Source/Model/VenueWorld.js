
function VenueWorld(world)
{
	this.name = "World";
	this.world = world;
}

{
	VenueWorld.prototype.draw = function(universe)
	{
		this.world.draw(universe);
	}

	VenueWorld.prototype.finalize = function(universe)
	{
		universe.soundHelper.soundForMusic.pause(universe);
	}

	VenueWorld.prototype.initialize = function(universe)
	{
		universe.world = this.world;
		this.world.initialize(universe);

		var soundHelper = universe.soundHelper;
		soundHelper.soundWithNamePlayAsMusic(universe, "Music");
	}

	VenueWorld.prototype.updateForTimerTick = function(universe)
	{
		this.world.updateForTimerTick(universe);
		this.draw(universe);
	}
}
