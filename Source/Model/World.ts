// This class, as implemented, is only a demonstration.
// Its code is expected to be modified heavily in actual applications,
// including the constructor, the draw() and update() methods,
// and the static new() method.

class World
{
	name: string;
	dateCreated: DateTime;
	defns: Defns;
	places: Place[];
	placesByName: any;

	dateSaved: DateTime;
	timerTicksSoFar: number;
	placeCurrent: Place;
	placeNext: Place;

	constructor(name: string, dateCreated: DateTime, defns: Defns, places: Place[])
	{
		this.name = name;
		this.dateCreated = dateCreated;

		this.timerTicksSoFar = 0;

		this.defns = defns;

		this.places = places;
		this.placesByName = ArrayHelper.addLookupsByName(this.places);
		this.placeNext = this.places[0];
	}

	// static methods

	static new(universe: Universe)
	{
		var now = DateTime.now();
		var nowAsString = now.toStringMMDD_HHMM_SS();

		// PlaceDefns.

		var actions = World.actionsBuild();
		var actionToInputsMappings = World.actionToInputsMappingsBuild();

		var itemDefns = World.itemDefnsBuild();

		var randomizer = null; // Use default.
		var displaySize = universe.display.sizeInPixels;
		var cameraViewSize = displaySize.clone();
		var placeBuilder = new PlaceBuilderDemo
		(
			randomizer, cameraViewSize, itemDefns
		);

		var entityDefns = placeBuilder.entityDefns;

		var placeDefnDemo = new PlaceDefn
		(
			"Demo", actions, actionToInputsMappings
		);
		var placeDefns = [ placeDefnDemo ]; // todo

		var skills = Skill.skillsDemo();

		var defns = new Defns([entityDefns, itemDefns, placeDefns, skills]);

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
					placeNamesToIncludePortalsTo = [ "Base", "Terrarium" ];
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

		var placeBase = placeBuilder.buildTerrarium
		(
			displaySize.clone(), // size
			placeBattlefield0.name // placeNameToReturnTo
		);
		places.push(placeBase);

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

	draw(universe: Universe)
	{
		if (this.placeCurrent != null)
		{
			this.placeCurrent.draw(universe, this);
		}
	};

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
	};

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
	};

	// Build helpers.

	static actionsBuild()
	{
		var actionsAll = Action.Instances();

		var entityAccelerateInDirection = 
		(
			universe: Universe, world: World, place: Place, entity: Entity, directionToMove: Coords
		) =>
		{
			var entityLoc = entity.locatable().loc;
			var isEntityStandingOnGround =
				(entityLoc.pos.z >= 0 && entityLoc.vel.z >= 0);
			if (isEntityStandingOnGround)
			{
				entityLoc.orientation.forwardSet(directionToMove);
				entity.movable().accelerate(universe, world, place, entity);
			}
		};

		var coordsInstances = Coords.Instances();

		var useItemInSocketNumbered = (universe: Universe, world: World, place: Place, actor: Entity, socketNumber: number) =>
		{
			var equipmentUser = actor.equipmentUser();
			var socketName = "Item" + socketNumber;
			var entityItemEquipped = equipmentUser.itemEntityInSocketWithName(socketName);
			if (entityItemEquipped != null)
			{
				var itemEquipped = entityItemEquipped.item();
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
				(universe: Universe, world: World, place: Place, actor: Entity) => // perform
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
				(universe: Universe, world: World, place: Place, actor: Entity) => // perform
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
				(universe: Universe, world: World, place: Place, actor: Entity) => // perform
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
				(universe: Universe, world: World, place: Place, actor: Entity) => // perform
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
				(universe: Universe, world: World, place: Place, actor: Entity) => // perform
				{
					var equipmentUser = actor.equipmentUser();
					var entityWeaponEquipped = equipmentUser.itemEntityInSocketWithName("Weapon");
					var actorHasWeaponEquipped = (entityWeaponEquipped != null);

					if (actorHasWeaponEquipped)
					{
						var deviceWeapon = entityWeaponEquipped.device();
						deviceWeapon.use(universe, world, place, actor, entityWeaponEquipped);
					}
				}
			),
			new Action
			(
				"Hide",
				(universe: Universe, world: World, place: Place, actor: Entity) => // perform
				{
					var learner = actor.skillLearner();
					var knowsHowToHide = learner.skillsKnownNames.indexOf("Hiding") >= 0;
					//knowsHowToHide = true; // debug
					if (knowsHowToHide)
					{
						var perceptible = actor.playable(); // hack
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
				(universe: Universe, world: World, place: Place, actor: Entity) => // perform
				{
					var learner = actor.skillLearner();
					var canJump = learner.skillsKnownNames.indexOf("Jumping") >= 0;
					if (canJump)
					{
						var loc = actor.locatable().loc;
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
				(universe: Universe, world: World, place: Place, actor: Entity) => // perform
				{
					var learner = actor.skillLearner();
					var knowsHowToRun = learner.skillsKnownNames.indexOf("Running") >= 0;
					// knowsHowToRun = true; // debug
					if (knowsHowToRun)
					{
						var loc = actor.locatable().loc;
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
			new Action("Item0", (u: Universe, w: World, p: Place, e: Entity) => useItemInSocketNumbered(u, w, p, e, 0)),
			new Action("Item1", (u: Universe, w: World, p: Place, e: Entity) => useItemInSocketNumbered(u, w, p, e, 1)),
			new Action("Item2", (u: Universe, w: World, p: Place, e: Entity) => useItemInSocketNumbered(u, w, p, e, 2)),
			new Action("Item3", (u: Universe, w: World, p: Place, e: Entity) => useItemInSocketNumbered(u, w, p, e, 3)),
			new Action("Item4", (u: Universe, w: World, p: Place, e: Entity) => useItemInSocketNumbered(u, w, p, e, 4)),
			new Action("Item5", (u: Universe, w: World, p: Place, e: Entity) => useItemInSocketNumbered(u, w, p, e, 5)),
			new Action("Item6", (u: Universe, w: World, p: Place, e: Entity) => useItemInSocketNumbered(u, w, p, e, 6)),
			new Action("Item7", (u: Universe, w: World, p: Place, e: Entity) => useItemInSocketNumbered(u, w, p, e, 7)),
			new Action("Item8", (u: Universe, w: World, p: Place, e: Entity) => useItemInSocketNumbered(u, w, p, e, 8)),
			new Action("Item9", (u: Universe, w: World, p: Place, e: Entity) => useItemInSocketNumbered(u, w, p, e, 0)),
		];

		return actions;
	};

	static actionToInputsMappingsBuild()
	{
		var inputNames = Input.Names();

		var inactivateFalse = false;

		var actionToInputsMappings =
		[
			new ActionToInputsMapping("ShowMenu", [ inputNames.Escape ], inactivateFalse),
			new ActionToInputsMapping("ShowItems", [ inputNames.Tab ], inactivateFalse),

			new ActionToInputsMapping("MoveDown", 	[ inputNames.ArrowDown, inputNames.GamepadMoveDown + "0" ], inactivateFalse),
			new ActionToInputsMapping("MoveLeft", 	[ inputNames.ArrowLeft, inputNames.GamepadMoveLeft + "0" ], inactivateFalse),
			new ActionToInputsMapping("MoveRight", 	[ inputNames.ArrowRight, inputNames.GamepadMoveRight + "0" ], inactivateFalse),
			new ActionToInputsMapping("MoveUp", 	[ inputNames.ArrowUp, inputNames.GamepadMoveUp + "0" ], inactivateFalse),

			new ActionToInputsMapping("Fire", 		[ inputNames.Enter, inputNames.GamepadButton0 + "0" ], inactivateFalse),
			new ActionToInputsMapping("Jump", 		[ inputNames.Space, inputNames.GamepadButton0 + "1" ], inactivateFalse),
			new ActionToInputsMapping("Run", 		[ inputNames.Shift, inputNames.GamepadButton0 + "2" ], inactivateFalse),
			new ActionToInputsMapping("Hide", 		[ "h", inputNames.GamepadButton0 + "3" ], inactivateFalse),

			new ActionToInputsMapping("Item0", 	[ "_0" ], inactivateFalse),
			new ActionToInputsMapping("Item1", 	[ "_1" ], inactivateFalse),
			new ActionToInputsMapping("Item2", 	[ "_2" ], inactivateFalse),
			new ActionToInputsMapping("Item3", 	[ "_3" ], inactivateFalse),
			new ActionToInputsMapping("Item4", 	[ "_4" ], inactivateFalse),
			new ActionToInputsMapping("Item5", 	[ "_5" ], inactivateFalse),
			new ActionToInputsMapping("Item6", 	[ "_6" ], inactivateFalse),
			new ActionToInputsMapping("Item7", 	[ "_7" ], inactivateFalse),
			new ActionToInputsMapping("Item8", 	[ "_8" ], inactivateFalse),
			new ActionToInputsMapping("Item9", 	[ "_9" ], inactivateFalse),
		];

		return actionToInputsMappings;
	};

	static itemDefnsBuild()
	{
		var itemUseEquip = (universe: Universe, world: World, place: Place, entityUser: Entity, entityItem: Entity, item: Item) =>
		{
			var equipmentUser = entityUser.equipmentUser();
			var message = equipmentUser.equipEntityWithItem
			(
				universe, world, place, entityUser, entityItem, item
			);
			return message;
		};

		var itemDefns =
		[
			// 			name, 				appr, desc, mass, 	val,stax, categoryNames, use
			new ItemDefn("Ammo", 			null, null, null, 	null, null, null, null),
			new ItemDefn("Armor", 			null, null, 50, 	30, null, [ "Armor" ], itemUseEquip),
			new ItemDefn("Coin", 			null, null, .01, 	1, null, null, null),
			new ItemDefn("Crystal", 		null, null, .1, 	1, null, null, null),
			new ItemDefn("Enhanced Armor",	null, null, 60, 	60, null, [ "Armor" ], itemUseEquip),
			new ItemDefn("Flower", 			null, null, .01, 	1, null, null, null),
			new ItemDefn("Gun",				null, null, 5, 		100, null, [ "Weapon" ], itemUseEquip),
			new ItemDefn("Key", 			null, null, .1, 	5, null, null, null),
			new ItemDefn("Material", 		null, null, 10, 	3, null, null, null),
			new ItemDefn("Mushroom", 		null, null, .01, 	1, null, null, null),
			new ItemDefn("Speed Boots", 	null, null, 10, 	30, null, [ "Accessory" ], itemUseEquip),
			new ItemDefn("Sword",			null, null, 10, 	100, null, [ "Weapon" ], itemUseEquip),
			new ItemDefn("Toolset", 		null, null, 1, 		30, null, null, null),

			new ItemDefn
			(
				"Book", null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
				null, // categoryNames
				(universe: Universe, world: World, place: Place, entityUser: Entity, entityItem: Entity, item: Item) => // use
				{
					var venuePrev = universe.venueCurrent;
					var back = function()
					{
						var venueNext = venuePrev;
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
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
						"textareaContents",
						size.clone().half().half(),
						size.clone().half(),
						text,
						fontHeight,
						new DataBinding(false, null, null) // isEnabled
					);
					var button = new ControlButton
					(
						"buttonDone",
						new Coords(size.x / 4, 3 * size.y / 4 + fontHeight, 1),
						new Coords(size.x / 2, fontHeight * 2, 1),
						"Done",
						fontHeight,
						true, // hasBorder
						true, // isEnabled
						back, // click
						null, null
					);
					var container = new ControlContainer
					(
						"containerBook",
						new Coords(0, 0, 0),
						size.clone(),
						[ textarea, button ], // children
						[
							new Action( ControlActionNames.Instances().ControlCancel, back ),
							new Action( ControlActionNames.Instances().ControlConfirm, back )
						],
						null
					);

					var venueNext: any = new VenueControls(container);
					venueNext = new VenueFader(venueNext, null, null, null);
					universe.venueNext = venueNext;
				}
			),

			new ItemDefn
			(
				"Medicine", null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
				[ "Consumable" ], // categoryNames
				(universe: Universe, world: World, place: Place, entityUser: Entity, entityItem: Entity, item: Item) => // use
				{
					var integrityToRestore = 10;
					entityUser.killable().integrityAdd(integrityToRestore);
					entityUser.itemHolder().itemSubtractDefnNameAndQuantity(item.defnName, 1);
					var message = "The medicine restores " + integrityToRestore + " points.";
					return message;
				}
			),

			new ItemDefn
			(
				"Potion", null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
				[ "Consumable" ], // categoryNames
				(universe: Universe, world: World, place: Place, entityUser: Entity, entityItem: Entity, item: Item) => // use
				{
					// Same as medicine, for now.
					var integrityToRestore = 10;
					entityUser.killable().integrityAdd(integrityToRestore);
					entityUser.itemHolder().itemSubtractDefnNameAndQuantity(item.defnName, 1);
					var message = "The potion restores " + integrityToRestore + " points.";
					return message;
				}
			),

			new ItemDefn
			(
				"Walkie-Talkie", null, null, 2, 10, null,
				[], // categoryNames
				(universe: Universe, world: World, place: Place, entityUser: Entity, entityItem: Entity, item: Item) => // use
				{
					return "There is no response but static.";
				}
			),

		];

		return itemDefns;
	};
}
