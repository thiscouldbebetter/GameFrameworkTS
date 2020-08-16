// This class, as implemented, is only a demonstration.
// Its code is expected to be modified heavily in actual applications,
// including the constructor, the draw() and update() methods,
// and the static create() method.

class World
{
	name: string;
	dateCreated: DateTime;
	defn: WorldDefn;
	places: Place[];
	placesByName: any;

	dateSaved: DateTime;
	timerTicksSoFar: number;
	placeCurrent: Place;
	placeNext: Place;

	constructor(name: string, dateCreated: DateTime, defn: WorldDefn, places: Place[])
	{
		this.name = name;
		this.dateCreated = dateCreated;

		this.timerTicksSoFar = 0;

		this.defn = defn;

		this.places = places;
		this.placesByName = ArrayHelper.addLookupsByName(this.places);
		this.placeNext = this.places[0];
	}

	// static methods

	static create(universe: Universe)
	{
		var now = DateTime.now();
		var nowAsString = now.toStringMMDD_HHMM_SS();

		// PlaceDefns.

		var randomizer = null; // Use default.
		var displaySize = universe.display.sizeInPixels;
		var cameraViewSize = displaySize.clone();
		var placeBuilder = new PlaceBuilderDemo
		(
			randomizer, cameraViewSize
		);

		var actions = placeBuilder.actions;
		var actionToInputsMappings = placeBuilder.actionToInputsMappings;

		var propertyNamesToProcess = 
		[
			Locatable.name,
			Boundable.name,
			Constrainable.name,
			Collidable.name,
			CollisionTracker.name,
			Effectable.name,
			Generator.name,
			Hidable.name,
			Idleable.name,
			ItemCrafter.name,
			Actor.name,
			Loadable.name,
			Playable.name,
			SkillLearner.name,
			Ephemeral.name,
			Recurrent.name,
			Killable.name,
			Starvable.name,
			Camera.name
		]

		var placeDefnDemo = new PlaceDefn
		(
			"Demo",
			actions,
			actionToInputsMappings,
			propertyNamesToProcess,
			null, // placeInitialize
			null // placeFinalize
		);
		var placeDefns = [ placeDefnDemo ]; // todo

		var itemDefns = placeBuilder.itemDefns;
		var entityDefns = placeBuilder.entityDefns;
		var skills = Skill.skillsDemo();

		var defns = new WorldDefn([entityDefns, itemDefns, placeDefns, skills]);

		var places = [];

		var worldSizeInRooms = new Coords(2, 2, 1);
		var roomPos = new Coords(0, 0, 0);
		var roomSize = displaySize.clone().double();
		var startPos = new Coords(0, 0, 0);
		var goalPos = new Coords(0, 0, 0).randomize(null).multiply(worldSizeInRooms).floor();

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
					placeNamesToIncludePortalsTo = [ "Base", "Terrarium", "Zoned" ];
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
			10, //entityDimension,
			5, //numberOfKeysToUnlockGoal,
			new Coords(20, 20, 0) // marginSize
		);

		var placeBattlefield0 = places[0];

		var placeBase = placeBuilder.buildBase
		(
			displaySize.clone(), // size
			placeBattlefield0.name // placeNameToReturnTo
		);
		places.splice(0, 0, placeBase);

		var placeZoned = placeBuilder.buildZoned
		(
			displaySize.clone(), // size
			placeBattlefield0.name // placeNameToReturnTo
		);
		places.push(placeZoned);

		var placeTerrarium = placeBuilder.buildTerrarium
		(
			displaySize.clone(), // size
			placeBattlefield0.name // placeNameToReturnTo
		);
		places.push(placeTerrarium);

		var returnValue = new World
		(
			"World-" + nowAsString,
			now, // dateCreated
			defns,
			places
		);
		return returnValue;
	}

	// instance methods

	draw(universe: Universe)
	{
		if (this.placeCurrent != null)
		{
			this.placeCurrent.draw(universe, this, universe.display);
		}
	}

	initialize(universe: Universe)
	{
		if (this.placeNext != null)
		{
			if (this.placeCurrent != null)
			{
				this.placeCurrent.finalize(universe, this);
			}
			this.placeCurrent = this.placeNext;
			this.placeNext = null;
		}

		if (this.placeCurrent != null)
		{
			this.placeCurrent.initialize(universe, this);
		}
	}

	timePlayingAsString(universe: Universe, isShort: boolean)
	{
		var secondsPlayingTotal = Math.floor
		(
			this.timerTicksSoFar / universe.timerHelper.ticksPerSecond
		);
		var minutesPlayingTotal = Math.floor(secondsPlayingTotal / 60);
		var hoursPlayingTotal = Math.floor(minutesPlayingTotal / 60);

		var timePlayingAsString =
			hoursPlayingTotal + " " + (isShort ? "h" : "hours") + " "
			+ (minutesPlayingTotal % 60) + " " + (isShort ? "m" : "minutes") + " "
			+ (secondsPlayingTotal % 60) + " " + (isShort ? "s" : "seconds");

		return timePlayingAsString;
	}

	updateForTimerTick(universe: Universe)
	{
		if (this.placeNext != null)
		{
			if (this.placeCurrent != null)
			{
				this.placeCurrent.finalize(universe, this);
			}
			this.placeCurrent = this.placeNext;
			this.placeNext = null;
			this.placeCurrent.initialize(universe, this);
		}
		this.placeCurrent.updateForTimerTick(universe, this);
		this.timerTicksSoFar++;
	}
}
