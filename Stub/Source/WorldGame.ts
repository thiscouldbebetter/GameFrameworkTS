
class WorldGame extends World
{
	constructor(name: string)
	{
		var name = name;

		var timeCreated = DateTime.now();
		var defn = WorldGame.defnBuild();
		var place = new PlaceDefault();
		var places = [ place ];
		var placesByName = new Map(places.map(x => [x.name, x]) );
		var placeGetByName =
			(placeName: string) => placesByName.get(placeName);
		var placeInitialName = places[0].name;

		super
		(
			name, timeCreated, defn, placeGetByName, placeInitialName
		);
	}

	static fromName(name: string): WorldGame
	{
		return new WorldGame(name);
	}

	static defnBuild(): WorldDefn
	{
		return new WorldDefn
		([
			[
				UserInputListener.activityDefn()
			],
			[
				PlaceDefault.defnBuild()
			]
		]);
	}
}
