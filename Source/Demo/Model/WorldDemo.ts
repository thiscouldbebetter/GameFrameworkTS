
class WorldDemo extends World
{
	constructor(name: string, dateCreated: DateTime, defn: WorldDefn, places: Place[])
	{
		var placesByName = ArrayHelper.addLookupsByName(places);
		var placeGetByName = (placeName: string) => placesByName.get(placeName);
		var placeInitialName = places[0].name;
		super
		(
			name, dateCreated, defn, placeGetByName, placeInitialName
		);
	}

	// static methods

	static create(universe: Universe): WorldDemo
	{
		var now = DateTime.now();
		var nowAsString = now.toStringMMDD_HHMM_SS();

		// PlaceDefns.

		var randomizer = null; // Use default.
		var displaySize = universe.display.sizeInPixels;
		var cameraViewSize = displaySize.clone();
		var placeBuilder = new PlaceBuilderDemo
		(
			universe, randomizer, cameraViewSize
		);

		var actions = placeBuilder.actions;
		var actionToInputsMappings = placeBuilder.actionToInputsMappings;

		var propertyNamesToProcess =
		[
			LoadableProperty.name,

			Locatable.name,
			ForceField.name,

			Boundable.name,
			Constrainable.name,
			Collidable.name,
			CollisionTrackerBase.name,

			Idleable.name,
			Actor.name,

			Effectable.name,
			EntityGenerator.name,
			Item.name,
			ItemCrafter.name,
			Playable.name,
			SkillLearner.name,
			Perceptible.name,
			Recurrent.name,
			Selector.name,
			Vehicle.name,

			Ephemeral.name,
			Killable.name,
			Phased.name,
			Starvable.name,
			Tirable.name,

			//Camera.name,
		];

		var placeDefnDemo = new PlaceDefn
		(
			"Demo",
			null, // soundForMusicName
			actions,
			actionToInputsMappings,
			propertyNamesToProcess,
			null, // placeInitialize
			null // placeFinalize
		);
		var placeDefns = [ placeDefnDemo ]; // todo

		var activityDefns = placeBuilder.activityDefns;
		var itemDefns = placeBuilder.itemDefns;
		var entityDefns = placeBuilder.entityDefns;
		var skills = Skill.skillsDemo();

		var defns = new WorldDefn
		([
			actions,
			activityDefns,
			entityDefns,
			itemDefns,
			placeDefns,
			skills
		]);

		var places = [];

		var worldSizeInRooms = new Coords(2, 2, 1);
		var roomPos = Coords.create();
		var roomSize = displaySize.clone().double();
		var startPos = Coords.create();
		var goalPos = Coords.create().randomize(null).multiply(worldSizeInRooms).floor();

		for (var y = 0; y < worldSizeInRooms.y; y++)
		{
			roomPos.y = y;

			for (var x = 0; x < worldSizeInRooms.x; x++)
			{
				roomPos.x = x;

				var areNeighborsConnectedESWN =
				[
					(x < worldSizeInRooms.x - 1),
					(y < worldSizeInRooms.y - 1),
					(x > 0),
					(y > 0)
				];

				var isStart = (roomPos.equals(startPos));
				var isGoal = (roomPos.equals(goalPos));

				var placeNamesToIncludePortalsTo: string[] = [];
				if (isStart)
				{
					placeNamesToIncludePortalsTo =
					[
						"Base", "Parallax", "Terrarium", "Tunnels", "Zoned"
					];
				}

				var placeBattlefield = placeBuilder.buildBattlefield
				(
					roomSize, roomPos, areNeighborsConnectedESWN, isGoal,
					placeNamesToIncludePortalsTo
				);

				places.push(placeBattlefield);
			}
		}

		placeBuilder.entityBuildKeys
		(
			places,
			5, //numberOfKeysToUnlockGoal,
			Coords.fromXY(20, 20) // marginSize
		);

		var placeBattlefield0 = places[0];

		var placeBase = placeBuilder.buildBase
		(
			displaySize.clone(), // size
			placeBattlefield0.name // placeNameToReturnTo
		);
		places.splice(0, 0, placeBase);

		var placeParallax = placeBuilder.buildParallax
		(
			displaySize.clone().double().double(), // size
			placeBattlefield0.name // placeNameToReturnTo
		);
		places.push(placeParallax);

		var placeTerrarium = placeBuilder.buildTerrarium
		(
			displaySize.clone(), // size
			placeBattlefield0.name // placeNameToReturnTo
		);
		places.push(placeTerrarium);

		var placeTunnels = placeBuilder.buildTunnels
		(
			displaySize.clone(), // size
			placeBattlefield0.name // placeNameToReturnTo
		);
		places.push(placeTunnels);

		var placeZoned = placeBuilder.buildZoned
		(
			displaySize.clone(), // size
			placeBattlefield0.name // placeNameToReturnTo
		);
		places.push(placeZoned);

		var returnValue = new WorldDemo
		(
			"World-" + nowAsString,
			now, // dateCreated
			defns,
			places
		);
		return returnValue;
	}
}
