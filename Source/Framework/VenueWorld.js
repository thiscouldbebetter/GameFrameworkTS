
function VenueWorld(world)
{
	this.name = "World";
	this.world = world;
}

{
	VenueWorld.prototype.draw = function()
	{
		this.world.draw();
	}

	VenueWorld.prototype.finalize = function()
	{
		Globals.Instance.soundHelper.soundForMusic.pause();
	}

	VenueWorld.prototype.initialize = function()
	{
		Globals.Instance.universe.world = this.world;
		
		var soundHelper = Globals.Instance.soundHelper;
		soundHelper.soundWithNamePlayAsMusic("Music");
	}

	VenueWorld.prototype.updateForTimerTick = function()
	{
		this.world.updateForTimerTick();
		this.draw();
	}
}
