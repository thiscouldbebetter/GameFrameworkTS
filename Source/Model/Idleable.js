
function Idleable()
{
	// Do nothing.
}
{
	Idleable.prototype.updateForTimerTick = function(universe, world, place, player)
	{
		var playerLoc = player.Locatable.loc;
		playerLoc.orientation.forwardSet(Coords.Instances().Zeroes);
	};
}
