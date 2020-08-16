
class Idleable extends EntityProperty
{
	updateForTimerTick(universe: Universe, world: World, place: Place, entityPlayer: Entity)
	{
		var playerLoc = entityPlayer.locatable().loc;
		playerLoc.orientation.forwardSet(Coords.Instances().Zeroes);
	};
}
