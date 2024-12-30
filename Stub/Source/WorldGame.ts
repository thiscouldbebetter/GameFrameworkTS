
class WorldGame extends World
{
	constructor()
	{
		var name = "WorldGame";
		var timeCreated = DateTime.now();
		var defn = WorldGame.defnBuild();
		var place = new PlaceStub();
		var places = [ place ];
		var placesByName = new Map(places.map(x => [x.name, x]) );
		var placeGetByName = (placeName: string) => placesByName.get(placeName);
		var placeInitialName = places[0].name;

		super
		(
			name, timeCreated, defn, placeGetByName, placeInitialName
		);
	}

	static defnBuild(): WorldDefn
	{
		return new WorldDefn
		([
			[
				UserInputListener.activityDefn()
			],
			[
				PlaceStub.defnBuild()
			]
		]);
	}

	toControl(): ControlBase
	{
		return new ControlNone();
	}
}
