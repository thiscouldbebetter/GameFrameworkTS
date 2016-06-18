
function VenueWorld()
{
	this.name = "World";
}

{
	VenueWorld.prototype.draw = function()
	{
		Globals.Instance.universe.world.draw();
	}

	VenueWorld.prototype.finalize = function()
	{
		Globals.Instance.soundHelper.soundForMusic.pause();		
	}

	VenueWorld.prototype.initialize = function()
	{
		var soundHelper = Globals.Instance.soundHelper;
		soundHelper.soundWithNamePlayAsMusic("Music");
	}

	VenueWorld.prototype.updateForTimerTick = function()
	{
		Globals.Instance.universe.world.updateForTimerTick();
		this.draw();
	}
}
