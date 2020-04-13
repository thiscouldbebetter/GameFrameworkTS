// This class, as implemented, is only a demonstration.
// Its code is expected to be modified heavily in actual applications,
// including the constructor, the draw() and update() methods,
// and the static new() method.

class World
{
	constructor(name, dateCreated, defns, places)
	{
		this.name = name;
		this.dateCreated = dateCreated;

		this.timerTicksSoFar = 0;

		this.defns = defns;

		this.places = places.addLookupsByName();
		this.placeNext = this.places[0];
	}

	// static methods

	static new(universe)
	{
		var now = DateTime.now();
		var nowAsString = now.toStringMMDD_HHMM_SS();

		// PlaceDefns.

		var actions = World.actionsBuild();
		var actionToInputsMappings = World.actionToInputsMappingsBuild();

		var placeBuilder = new PlaceBuilderDemo();

		var entityDefns = placeBuilder.entityDefnsBuild();

		var itemDefns = World.itemDefnsBuild();

		var placeDefnDemo = new PlaceDefn
		(
			"Demo",
			actions,
			actionToInputsMappings
		);

		var placeDefns = [ placeDefnDemo ]; // todo

		var skills = Skill.skillsDemo();

		var defns = new Defns([entityDefns, itemDefns, placeDefns, skills]);

		var displaySize = universe.display.sizeInPixels;
		var cameraViewSize = displaySize.clone();

		var randomizer = null; // Use default.

		var places = [];

		var worldSizeInRooms = new Coords(2, 2);
		var roomPos = new Coords();
		var roomSize = displaySize.clone().double();
		var goalPos = new Coords().randomize().multiply(worldSizeInRooms).floor();

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

				var isGoal = (roomPos.equals(goalPos));

				var placeBattlefield = placeBuilder.build
				(
					"Battlefield",
					roomSize, // size
					cameraViewSize,
					null, // placeNameToReturnTo
					randomizer,
					itemDefns,
					roomPos,
					areNeighborsConnectedESWN,
					isGoal
				);

				places.push(placeBattlefield);
			}
		}

		placeBuilder.entityBuildKeys
		(
			places,
			10, //entityDimension,
			5, //numberOfKeysToUnlockGoal,
			new Coords(20, 20) //marginSize
		);

		var placeBase = placeBuilder.build
		(
			"Base",
			displaySize.clone(), // size
			cameraViewSize,
			places[0].name, // placeNameToReturnTo
			randomizer,
			itemDefns,
			null, // pos
			[false, false, false, false] // areNeighborsConnectedESWN
		);

		places.insertElementAt(placeBase, 0);

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

	draw(universe)
	{
		if (this.placeCurrent != null)
		{
			this.placeCurrent.draw(universe, this);
		}
	};

	initialize(universe)
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
	};

	updateForTimerTick(universe)
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
	};

	// Build helpers.

	static actionsBuild()
	{
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

		var coordsInstances = Coords.Instances();

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
				"Hide",
				function perform(universe, world, place, actor)
				{
					var learner = actor.skillLearner;
					var knowsHowToHide = learner.skillsKnownNames.contains("Hiding");
					//knowsHowToHide = true; // debug
					if (knowsHowToHide)
					{
						var perceptible = actor.playable; // hack
						var isAlreadyHiding = perceptible.isHiding;
						if (isAlreadyHiding)
						{
							perceptible.isHiding = false;
						}
						else
						{
							perceptible.isHiding = true;
						}
					}
				}
			),
			new Action
			(
				"Jump",
				function perform(universe, world, place, actor)
				{
					var learner = actor.skillLearner;
					var canJump = learner.skillsKnownNames.contains("Jumping");
					if (canJump)
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
				}
			),
			new Action
			(
				"Run",
				function perform(universe, world, place, actor)
				{
					var learner = actor.skillLearner;
					var knowsHowToRun = learner.skillsKnownNames.contains("Running");
					// knowsHowToRun = true; // debug
					if (knowsHowToRun)
					{
						var loc = actor.locatable.loc;
						var isOnGround = (loc.pos.z >= 0);
						if (isOnGround)
						{
							var vel = loc.vel;
							var speedRunning = 16;
							var speedCurrent = vel.magnitude();
							if (speedCurrent > 0 && speedCurrent < speedRunning)
							{
								var direction = vel.normalize();
								vel.multiplyScalar(speedRunning);
							}
						}
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

		return actions;
	};

	static actionToInputsMappingsBuild()
	{
		var inputNames = Input.Names();

		var actionToInputsMappings =
		[
			new ActionToInputsMapping("ShowMenu", [ inputNames.Escape ]),
			new ActionToInputsMapping("ShowItems", [ inputNames.Tab ]),

			new ActionToInputsMapping("MoveDown", 	[ inputNames.ArrowDown, inputNames.GamepadMoveDown + "0" ]),
			new ActionToInputsMapping("MoveLeft", 	[ inputNames.ArrowLeft, inputNames.GamepadMoveLeft + "0" ]),
			new ActionToInputsMapping("MoveRight", 	[ inputNames.ArrowRight, inputNames.GamepadMoveRight + "0" ]),
			new ActionToInputsMapping("MoveUp", 	[ inputNames.ArrowUp, inputNames.GamepadMoveUp + "0" ]),

			new ActionToInputsMapping("Fire", 		[ inputNames.Enter, inputNames.GamepadButton0 + "0" ]),
			new ActionToInputsMapping("Jump", 		[ inputNames.Space, inputNames.GamepadButton0 + "1" ]),
			new ActionToInputsMapping("Run", 		[ inputNames.Shift, inputNames.GamepadButton0 + "2" ]),
			new ActionToInputsMapping("Hide", 		[ "h", inputNames.GamepadButton0 + "3" ]),

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

		return actionToInputsMappings;
	};

	static itemDefnsBuild()
	{
		var itemUseEquip = function(universe, world, place, entityUser, entityItem, item)
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
			// 			name, 				appr, desc, mass, 	val,stax, categoryNames, use
			new ItemDefn("Ammo"),
			new ItemDefn("Armor", 			null, null, 50, 	30, null, [ "Armor" ], itemUseEquip),
			new ItemDefn("Coin", 			null, null, .01, 	1),
			new ItemDefn("Crystal", 		null, null, .1, 	1),
			new ItemDefn("Enhanced Armor",	null, null, 60, 	60, null, [ "Armor" ], itemUseEquip),
			new ItemDefn("Flower", 			null, null, .01, 	1),
			new ItemDefn("Key", 			null, null, .1, 	5),
			new ItemDefn("Material", 		null, null, 10, 	3),
			new ItemDefn("Mushroom", 		null, null, .01, 	1),
			new ItemDefn("Speed Booster", 	null, null, 10, 	30, null, [ "Accessory" ], itemUseEquip),
			new ItemDefn("Toolset", 		null, null, 1, 		30),
			new ItemDefn("Weapon",			null, null, 5, 		100, null, [ "Weapon" ], itemUseEquip),

			new ItemDefn
			(
				"Book", null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
				null, // categoryNames
				function use(universe, world, place, entityUser, entityItem, item)
				{
					var venuePrev = universe.venueCurrent;
					var back = function()
					{
						var venueNext = venuePrev;
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					};

					var text =
						"Fourscore and seven years ago, our fathers brought forth upon this continent "
						+ "a new nation, conceived in liberty, and dedicated to the proposition that "
						+ " all men are created equal. ";
					var size = universe.display.sizeInPixels.clone();
					var fontHeight = 10;
					var textarea = new ControlTextarea
					(
						"textareaContents", size.clone().half().half(), size.clone().half(), text, fontHeight, false // isEnabled
					);
					var button = new ControlButton
					(
						"buttonDone",
						new Coords(size.x / 4, 3 * size.y / 4 + fontHeight),
						new Coords(size.x / 2, fontHeight * 2),
						"Done",
						fontHeight,
						true, // hasBorder
						true, // isEnabled
						back // click
					);
					var container = new ControlContainer
					(
						"containerBook",
						new Coords(0, 0),
						size.clone(),
						[ textarea, button ], // children
						[
							new Action( ControlActionNames.Instances().ControlCancel, back ),
							new Action( ControlActionNames.Instances().ControlConfirm, back )
						]
					);

					var venueNext = new VenueControls(container);
					venueNext = new VenueFader(venueNext);
					universe.venueNext = venueNext;
				}
			),

			new ItemDefn
			(
				"Medicine", null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
				[ "Consumable" ], // categoryNames
				function use(universe, world, place, entityUser, entityItem, item)
				{
					var integrityToRestore = 10;
					entityUser.killable.integrityAdd(integrityToRestore);
					entityUser.itemHolder.itemSubtractDefnNameAndQuantity(item.defnName, 1);
					var message = "The medicine restores " + integrityToRestore + " points.";
					return message;
				}
			),

			new ItemDefn
			(
				"Potion", null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
				[ "Consumable" ], // categoryNames
				function use(universe, world, place, entityUser, entityItem, item)
				{
					// Same as medicine, for now.
					var integrityToRestore = 10;
					entityUser.killable.integrityAdd(integrityToRestore);
					entityUser.itemHolder.itemSubtractDefnNameAndQuantity(item.defnName, 1);
					var message = "The potion restores " + integrityToRestore + " points.";
					return message;
				}
			),

		];

		return itemDefns;
	};
}
