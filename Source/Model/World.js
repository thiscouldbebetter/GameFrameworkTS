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

		// PlaceDefns.

		var coordsInstances = Coords.Instances();

		var actionsAll = Action.Instances();

		var entityAccelerateInDirection = function
		(
			universe, world, place, entity, directionToMove
		)
		{
			entity.Locatable.loc.orientation.forwardSet(directionToMove);
			entity.Movable.accelerate(universe, world, place, entity);
		};

		var actions =
		[
			actionsAll.DoNothing,
			actionsAll.ShowEquipment,
			actionsAll.ShowItems,
			actionsAll.ShowMenu,
			new Action
			(
				"MoveDown",
				function perform(universe, world, place, actor)
				{
					entityAccelerateInDirection
					(
						universe, world, place, actor, coordsInstances.ZeroOneZero
					);
				}
			),
			new Action
			(
				"MoveLeft",
				function perform(universe, world, place, actor)
				{
					entityAccelerateInDirection
					(
						universe, world, place, actor, coordsInstances.MinusOneZeroZero
					);
				}
			),
			new Action
			(
				"MoveRight",
				function perform(universe, world, place, actor)
				{
					entityAccelerateInDirection
					(
						universe, world, place, actor, coordsInstances.OneZeroZero
					);
				}
			),
			new Action
			(
				"MoveUp",
				function perform(universe, world, place, actor)
				{
					entityAccelerateInDirection
					(
						universe, world, place, actor, coordsInstances.ZeroMinusOneZero
					);
				}
			),
			new Action
			(
				"Fire",
				function perform(universe, world, place, actor)
				{
					var equippable = actor.Equippable;
					var entityWeaponEquipped = equippable.socketGroup.sockets["Weapon"].itemEntityEquipped;
					var actorHasWeaponEquipped = (entityWeaponEquipped != null);

					if (actorHasWeaponEquipped)
					{
						var deviceWeapon = entityWeaponEquipped.Device;
						deviceWeapon.use(universe, world, place, entityWeaponEquipped, deviceWeapon, actor);
					}
				}
			),
		];

		var inputNames = universe.inputHelper.inputNames();

		var actionToInputsMappings =
		[
			new ActionToInputsMapping("ShowMenu", [ inputNames.Escape ]),
			new ActionToInputsMapping("ShowItems", [ inputNames.Tab ]),
			new ActionToInputsMapping("ShowEquipment", [ "`" ]),

			new ActionToInputsMapping("MoveDown", [ inputNames.ArrowDown, "Gamepad0Down" ]),
			new ActionToInputsMapping("MoveLeft", [ inputNames.ArrowLeft, "Gamepad0Left" ]),
			new ActionToInputsMapping("MoveRight", [ inputNames.ArrowRight, "Gamepad0Right" ]),
			new ActionToInputsMapping("MoveUp", [ inputNames.ArrowUp, "Gamepad0Up" ]),
			new ActionToInputsMapping("Fire", [ inputNames.Enter, "Gamepad0Button0" ]),
		];

		var placeDefnDemo = new PlaceDefn
		(
			"Demo",
			actions,
			actionToInputsMappings
		);

		var placeDefns = [ placeDefnDemo ]; // todo

		var itemUseEquip = function (universe, world, place, entityUser, entityItem, item)
		{
			var equippable = entityUser.Equippable;
			var message = equippable.equipEntityWithItem
			(
				universe, world, place, entityUser, entityItem, item
			);
			return message;
		};

		var itemDefns =
		[
			new ItemDefn("Ammo"),
			ItemDefn.fromNameCategoryNameAndUse
			(
				"Armor",
				"Armor", // categoryName
				itemUseEquip
			),
			new ItemDefn("Coin"),
			new ItemDefn("Key"),
			ItemDefn.fromNameAndUse
			(
				"Medicine",
				function use(universe, world, place, entityUser, entityItem, item)
				{
					var integrityToRestore = 10;
					entityUser.Killable.integrityAdd(integrityToRestore);
					entityUser.ItemHolder.itemSubtractDefnNameAndQuantity(item.defnName, 1);
					var message = "The medicine restores " + integrityToRestore + " points.";
					return message;
				}
			),
			ItemDefn.fromNameCategoryNameAndUse
			(
				"Speed Booster",
				"Accessory", // categoryName
				itemUseEquip
			),
			ItemDefn.fromNameCategoryNameAndUse
			(
				"Weapon",
				"Weapon", // categoryName
				itemUseEquip
			)
		];

		var defns = new Defns(itemDefns, placeDefns);

		var displaySize = universe.display.sizeInPixels;
		var cameraViewSize = displaySize.clone();
		var placeBuilder = new PlaceBuilderDemo();

		var randomizer = null; // Use default.

		var placeMain = placeBuilder.build
		(
			"Battlefield",
			displaySize.clone().double(), // size
			cameraViewSize,
			null, // placeNameToReturnTo
			randomizer,
			itemDefns
		);

		var placeBase = placeBuilder.build
		(
			"Base",
			displaySize.clone(), // size
			cameraViewSize,
			placeMain.name, // placeNameToReturnTo
			randomizer,
			itemDefns
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
