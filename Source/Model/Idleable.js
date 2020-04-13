
class Idleable
{
	updateForTimerTick(universe, world, place, player)
	{
		var playerLoc = player.locatable.loc;
		playerLoc.orientation.forwardSet(Coords.Instances().Zeroes);
	};
}
