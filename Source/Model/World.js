// This class, as implemented, is only a demonstration.
// Its code is expected to be modified heavily in actual applications,
// including the constructor, the draw() and update() methods,
// and the World.new() method.

function World(name, dateCreated, defns, place)
{
	this.name = name;
	this.dateCreated = dateCreated;

	this.timerTicksSoFar = 0;

	this.defns = defns;

	this.place = place;
}

{
	// static methods

	World.new = function(universe)
	{
		var now = DateTime.now();
		var nowAsString = now.toStringMMDD_HHMM_SS();

		var place = new PlaceDemo
		(
			universe.display.sizeInPixels.clone().double(), // size
			5, // numberOfKeysToUnlockGoal
			48 // numberOfObstacles
		);
		place.entitiesSpawn(universe, null);

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
					var actorHasWeapon = itemHolder.hasItems(itemWeapon);

					if (actorHasWeapon)
					{
						var entityWeapon = itemHolder.itemEntities["Weapon"];
						var deviceWeapon = entityWeapon.Device;
						deviceWeapon.use(universe, world, place, actor, deviceWeapon);
					}
				}
			),
		]

		var actionToInputsMappings =
		[
			new ActionToInputsMapping("ShowMenu", ["Escape"]),
			new ActionToInputsMapping("ShowItems", ["Tab"]),

			new ActionToInputsMapping("MoveDown", ["ArrowDown", "Gamepad0Down"]),
			new ActionToInputsMapping("MoveLeft", ["ArrowLeft", "Gamepad0Left"]),
			new ActionToInputsMapping("MoveRight", ["ArrowRight", "Gamepad0Right"]),
			new ActionToInputsMapping("MoveUp", ["ArrowUp", "Gamepad0Up"]),
			new ActionToInputsMapping("Fire", ["Enter", "Gamepad0Button0"]),
		];

		var placeDefnDemo = new PlaceDefn
		(
			"Demo",
			actions,
			actionToInputsMappings
		);

		var placeDefns = [ placeDefnDemo ]; // todo

		var defns = new Defns(constraintDefns, placeDefns);

		var returnValue = new World
		(
			"World-" + nowAsString,
			now, // dateCreated
			defns,
			place
		);
		return returnValue;
	};

	// instance methods

	World.prototype.draw = function(universe)
	{
		this.place.draw(universe, this);
	};

	World.prototype.initialize = function(universe)
	{
		this.place.initialize(universe, this);
	};

	World.prototype.updateForTimerTick = function(universe)
	{
		this.place.updateForTimerTick(universe, this);
		this.timerTicksSoFar++;
	};
}
