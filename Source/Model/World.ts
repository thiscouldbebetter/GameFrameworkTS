namespace ThisCouldBeBetter.GameFramework
{

// This class, as implemented, is only a demonstration.
// Its code is expected to be modified heavily in actual applications,
// including the constructor, the draw() and update() methods,
// and the static create() method.

export class World
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
			universe, randomizer, cameraViewSize
		);

		var actions = placeBuilder.actions;
		var actionToInputsMappings = placeBuilder.actionToInputsMappings;

		var propertyNamesToProcess = 
		[
			Locatable.name,
			ForceField.name,

			CollisionTracker.name,
			Boundable.name,
			Constrainable.name,
			Collidable.name,

			Idleable.name,
			Actor.name,

			Effectable.name,
			Generator.name,
			ItemCrafter.name,
			Loadable.name,
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

			Camera.name,
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

		var activityDefns = placeBuilder.activityDefns;
		var itemDefns = placeBuilder.itemDefns;
		var entityDefns = placeBuilder.entityDefns;
		var skills = Skill.skillsDemo();

		var defns = new WorldDefn([activityDefns, entityDefns, itemDefns, placeDefns, skills]);

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

	timePlayingAsStringShort(universe: Universe)
	{
		return universe.timerHelper.ticksToStringH_M_S(this.timerTicksSoFar);
	}

	timePlayingAsStringLong(universe: Universe)
	{
		return universe.timerHelper.ticksToStringHours_Minutes_Seconds(this.timerTicksSoFar);
	}

	toVenue()
	{
		return new VenueWorld(this);
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

	// Controls.

	toControl(universe: Universe)
	{
		return this.placeCurrent.toControl(universe, this);
	}
}

}
