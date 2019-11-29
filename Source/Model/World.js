// This class, as implemented, is only a demonstration.
// Its code is expected to be modified heavily in actual applications,
// including the constructor, the draw() and update() methods,
// and the World.new() method.

function World(name, dateCreated, defns, places)
{
	this.name = name;
	this.dateCreated = dateCreated;

	this.timerTicksSoFar = 0;

	this.defns = defns;

	this.places = places.addLookupsByName();
	this.placeCurrent = this.places[0];
}

{
	// static methods

	World.new = function(universe)
	{
		var now = DateTime.now();
		var nowAsString = now.toStringMMDD_HHMM_SS();

		var constraintDefns =
		[
			ConstraintDefn.Instances().Friction,
			ConstraintDefn.Instances().SpeedMax,
		];

		// PlaceDefns.

		var coordsInstances = Coords.Instances();

		var actions =
		[
			Action.Instances().DoNothing,
			new Action
			(
				"ShowMenu",
				function perform(universe, world, place, actor)
				{
					var venueNext = new VenueControls
					(
						universe.controlBuilder.configure(universe)
					);
					venueNext = new VenueFader(venueNext, universe.venueCurrent);
					universe.venueNext = venueNext;
				}
			),
			new Action
			(
				"ShowItems",
				function perform(universe, world, place, actor)
				{
					var itemHolder = actor.ItemHolder;
					var itemHolderAsControl = itemHolder.toControl
					(
						universe, universe.display.sizeInPixels, actor, universe.venueCurrent
					);
					var venueNext = new VenueControls(itemHolderAsControl);
					venueNext = new VenueFader(venueNext, universe.venueCurrent);
					universe.venueNext = venueNext;
				}
			),
			new Action
			(
				"MoveDown",
				function perform(universe, world, place, actor)
				{
					place.entityAccelerateInDirection
					(
						world, actor, coordsInstances.ZeroOneZero
					);
				}
			),
			new Action
			(
				"MoveLeft",
				function perform(universe, world, place, actor)
				{
					place.entityAccelerateInDirection
					(
						world, actor, coordsInstances.MinusOneZeroZero
					);
				}
			),
			new Action
			(
				"MoveRight",
				function perform(universe, world, place, actor)
				{
					place.entityAccelerateInDirection
					(
						world, actor, coordsInstances.OneZeroZero
					);
				}
			),
			new Action
			(
				"MoveUp",
				function perform(universe, world, place, actor)
				{
					place.entityAccelerateInDirection
					(
						world, actor, coordsInstances.ZeroMinusOneZero
					);
				}
			),
			new Action
			(
				"Fire",
				function perform(universe, world, place, actor)
				{
					var itemWeapon = new Item("Weapon", 1);
					var itemHolder = actor.ItemHolder;
					var actorHasWeapon = itemHolder.hasItem(itemWeapon);

					if (actorHasWeapon)
					{
						var entityWeapon = itemHolder.itemEntities["Weapon"];
						var deviceWeapon = entityWeapon.Device;
						deviceWeapon.use(universe, world, place, actor, deviceWeapon);
					}
				}
			),
		];

		var inputNames = universe.inputHelper.inputNames();

		var actionToInputsMappings =
		[
			new ActionToInputsMapping("ShowMenu", [inputNames.Escape]),
			new ActionToInputsMapping("ShowItems", [inputNames.Tab]),

			new ActionToInputsMapping("MoveDown", [inputNames.ArrowDown, "Gamepad0Down"]),
			new ActionToInputsMapping("MoveLeft", [inputNames.ArrowLeft, "Gamepad0Left"]),
			new ActionToInputsMapping("MoveRight", [inputNames.ArrowRight, "Gamepad0Right"]),
			new ActionToInputsMapping("MoveUp", [inputNames.ArrowUp, "Gamepad0Up"]),
			new ActionToInputsMapping("Fire", [inputNames.Enter, "Gamepad0Button0"]),
		];

		var placeDefnDemo = new PlaceDefn
		(
			"Demo",
			actions,
			actionToInputsMappings
		);

		var placeDefns = [ placeDefnDemo ]; // todo

		var defns = new Defns(constraintDefns, placeDefns);

		var displaySize = universe.display.sizeInPixels;
		var cameraViewSize = displaySize.clone();
		var placeMain = new PlaceDemo
		(
			"Battlefield",
			displaySize.clone().double(), // size
			cameraViewSize,
			null // placeNameToReturnTo
		);

		var placeBase = new PlaceDemo
		(
			"Base",
			displaySize.clone(), // size
			cameraViewSize,
			placeMain.name // placeNameToReturnTo
		);

		var places = [ placeMain, placeBase ];

		var returnValue = new World
		(
			"World-" + nowAsString,
			now, // dateCreated
			defns,
			places
		);
		return returnValue;
	};

	// instance methods

	World.prototype.draw = function(universe)
	{
		this.placeCurrent.draw(universe, this);
	};

	World.prototype.initialize = function(universe)
	{
		this.placeCurrent.initialize(universe, this);
	};

	World.prototype.updateForTimerTick = function(universe)
	{
		this.placeCurrent.updateForTimerTick(universe, this);
		this.timerTicksSoFar++;
	};
}
