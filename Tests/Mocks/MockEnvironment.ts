
class MockEnvironment
{
	universe: Universe;

	constructor()
	{
		this.universe = this.universeCreate();
	}

	universeCreate(): Universe
	{
		var universe = Universe.default();
		universe.world = universe.worldCreate();
		universe.world.defn = WorldDefn.fromPlaceDefns
		(
			[ PlaceDefn.default() ]
		);
		universe.initialize(() => {});
		universe.profile = Profile.anonymous();
		var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);
		universe.world.initialize(uwpe);

		return universe;
	}
}
