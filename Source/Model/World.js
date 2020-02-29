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
			var entityLoc = entity.locatable.loc;
			var isEntityStandingOnGround =
				(entityLoc.pos.z >= 0 && entityLoc.vel.z >= 0);
			if (isEntityStandingOnGround)
			{
				entityLoc.orientation.forwardSet(directionToMove);
				entity.movable.accelerate(universe, world, place, entity);
			}
		};

		var useItemInSocketNumbered = function(universe, world, place, actor, socketNumber)
		{
			var equipmentUser = actor.equipmentUser;
			var socketName = "Item" + socketNumber;
			var entityItemEquipped = equipmentUser.itemEntityInSocketWithName(socketName);
			if (entityItemEquipped != null)
			{
				var itemEquipped = entityItemEquipped.item;
				itemEquipped.use(universe, world, place, actor, entityItemEquipped);
			}
		};

		var actions =
		[
			actionsAll.DoNothing,
			actionsAll.ShowCrafting,
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
					var equipmentUser = actor.equipmentUser;
					var entityWeaponEquipped = equipmentUser.itemEntityInSocketWithName("Weapon");
					var actorHasWeaponEquipped = (entityWeaponEquipped != null);

					if (actorHasWeaponEquipped)
					{
						var deviceWeapon = entityWeaponEquipped.device;
						deviceWeapon.use(universe, world, place, actor, entityWeaponEquipped);
					}
				}
			),
			new Action
			(
				"Jump",
				function perform(universe, world, place, actor)
				{
					var loc = actor.locatable.loc;
					var isNotAlreadyJumping = (loc.pos.z >= 0);
					if (isNotAlreadyJumping)
					{
						// For unknown reasons, setting accel instead of vel
						// results in nondeterministic jump height,
						// or often no visible jump at all.
						loc.vel.z = -10;
					}
				}
			),
			new Action("Item0", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 0)),
			new Action("Item1", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 1)),
			new Action("Item2", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 2)),
			new Action("Item3", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 3)),
			new Action("Item4", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 4)),
			new Action("Item5", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 5)),
			new Action("Item6", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 6)),
			new Action("Item7", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 7)),
			new Action("Item8", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 8)),
			new Action("Item9", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 0)),

		];

		var inputNames = Input.Names();

		var actionToInputsMappings =
		[
			new ActionToInputsMapping("ShowMenu", [ inputNames.Escape ]),
			new ActionToInputsMapping("ShowItems", [ inputNames.Tab ]),
			new ActionToInputsMapping("ShowEquipment", [ "`" ]),
			new ActionToInputsMapping("ShowCrafting", [ "~" ]),

			new ActionToInputsMapping("MoveDown", 	[ inputNames.ArrowDown, inputNames.GamepadMoveDown + "0" ]),
			new ActionToInputsMapping("MoveLeft", 	[ inputNames.ArrowLeft, inputNames.GamepadMoveLeft + "0" ]),
			new ActionToInputsMapping("MoveRight", 	[ inputNames.ArrowRight, inputNames.GamepadMoveRight + "0" ]),
			new ActionToInputsMapping("MoveUp", 	[ inputNames.ArrowUp, inputNames.GamepadMoveUp + "0" ]),
			new ActionToInputsMapping("Fire", 		[ inputNames.Enter, inputNames.GamepadButton0 + "0" ]),
			new ActionToInputsMapping("Jump", 		[ inputNames.Space, inputNames.GamepadButton0 + "1" ]),

			new ActionToInputsMapping("Item0", 	[ "_0" ]),
			new ActionToInputsMapping("Item1", 	[ "_1" ]),
			new ActionToInputsMapping("Item2", 	[ "_2" ]),
			new ActionToInputsMapping("Item3", 	[ "_3" ]),
			new ActionToInputsMapping("Item4", 	[ "_4" ]),
			new ActionToInputsMapping("Item5", 	[ "_5" ]),
			new ActionToInputsMapping("Item6", 	[ "_6" ]),
			new ActionToInputsMapping("Item7", 	[ "_7" ]),
			new ActionToInputsMapping("Item8", 	[ "_8" ]),
			new ActionToInputsMapping("Item9", 	[ "_9" ]),

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
			var equipmentUser = entityUser.equipmentUser;
			var message = equipmentUser.equipEntityWithItem
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
			ItemDefn.fromNameCategoryNameAndUse
			(
				"Enhanced Armor",
				"Armor", // categoryName
				itemUseEquip
			),
			new ItemDefn("Key"),
			new ItemDefn("Material"),
			ItemDefn.fromNameCategoryNameAndUse
			(
				"Medicine",
				"Consumable", // categoryName
				function use(universe, world, place, entityUser, entityItem, item)
				{
					var integrityToRestore = 10;
					entityUser.killable.integrityAdd(integrityToRestore);
					entityUser.itemHolder.itemSubtractDefnNameAndQuantity(item.defnName, 1);
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
			new ItemDefn("Toolset"),
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
