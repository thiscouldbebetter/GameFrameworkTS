
class PlaceBuilderDemo_Actions
{
	parent: PlaceBuilderDemo;
	font: FontNameAndHeight;

	constructor(parent: PlaceBuilderDemo)
	{
		this.parent = parent;
		this.font = FontNameAndHeight.fromHeightInPixels(this.parent.entityDimension);
	}

	// actions

	actionsBuild(): Action[]
	{
		var actionsAll = Action.Instances();

		var a = (n: string, p: any) => new Action(n, p);

		var actions =
		[
			actionsAll.DoNothing,

			DisplayRecorder.actionStartStop(),

			actionsAll.ShowMenuPlayer,

			Movable.actionAccelerateDown(),
			Movable.actionAccelerateLeft(),
			Movable.actionAccelerateRight(),
			Movable.actionAccelerateUp(),

			a("Fire", this.actionPerform_Fire),
			a("Hide", this.actionPerform_Hide),
			a("Jump", this.actionPerform_Jump),
			a("Pick Up", this.actionPerform_PickUp),
			a("Run", this.actionPerform_Run),
			a("Sneak", this.actionPerform_Sneak),
			a("Use", this.actionPerform_Use),
			a("Wait", this.actionPerform_Wait),
			
			a("Item0", (uwpe: UniverseWorldPlaceEntities) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 0)),
			a("Item1", (uwpe: UniverseWorldPlaceEntities) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 1)),
			a("Item2", (uwpe: UniverseWorldPlaceEntities) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 2)),
			a("Item3", (uwpe: UniverseWorldPlaceEntities) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 3)),
			a("Item4", (uwpe: UniverseWorldPlaceEntities) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 4)),
			a("Item5", (uwpe: UniverseWorldPlaceEntities) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 5)),
			a("Item6", (uwpe: UniverseWorldPlaceEntities) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 6)),
			a("Item7", (uwpe: UniverseWorldPlaceEntities) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 7)),
			a("Item8", (uwpe: UniverseWorldPlaceEntities) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 8)),
			a("Item9", (uwpe: UniverseWorldPlaceEntities) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 9)),
		];

		return actions;
	}

	actionToInputsMappingsBuild(): ActionToInputsMapping[]
	{
		var inputNames = Input.Names();

		var inactivateFalse = false;
		var inactivateTrue = true;

		var actions = Action.Instances();

		var atim = (a: string, b: string[], c: boolean) =>
			new ActionToInputsMapping(a, b, c);

		var actionToInputsMappings =
		[
			atim(actions.ShowMenuPlayer.name, [ inputNames.Escape, inputNames.Tab ], inactivateFalse),

			atim
			(
				Movable.actionAccelerateDown().name,
				[
					inputNames.ArrowDown,
					"s",
					inputNames.GamepadMoveDown + "0"
				],
				inactivateFalse
			),
			atim
			(
				Movable.actionAccelerateLeft().name,
				[
					inputNames.ArrowLeft,
					"a",
					inputNames.GamepadMoveLeft + "0"
				],
				inactivateFalse
			),
			atim
			(
				Movable.actionAccelerateRight().name,
				[
					inputNames.ArrowRight,
					"d",
					inputNames.GamepadMoveRight + "0"
				],
				inactivateFalse
			),
			atim
			(
				Movable.actionAccelerateUp().name,
				[
					inputNames.ArrowUp,
					"w",
					inputNames.GamepadMoveUp + "0"
				],
				inactivateFalse
			),

			atim("Fire", 		[ "f", inputNames.Enter, inputNames.GamepadButton0 + "0" ], inactivateTrue),
			atim("Hide", 		[ "h", inputNames.GamepadButton0 + "3" ], inactivateFalse),
			atim("Jump", 		[ inputNames.Space, inputNames.GamepadButton0 + "1" ], inactivateTrue),
			atim("Pick Up", 	[ "g", inputNames.GamepadButton0 + "4" ], inactivateTrue),
			atim("Run", 		[ inputNames.Shift, inputNames.GamepadButton0 + "2" ], inactivateFalse),
			atim("Sneak", 		[ inputNames.Control, inputNames.GamepadButton0 + "6" ], inactivateFalse),
			atim("Use", 		[ "e", inputNames.GamepadButton0 + "5" ], inactivateTrue),
			atim("Wait", 		[ "p" ], inactivateTrue),

			atim("Item0", 	[ "_0" ], inactivateTrue),
			atim("Item1", 	[ "_1" ], inactivateTrue),
			atim("Item2", 	[ "_2" ], inactivateTrue),
			atim("Item3", 	[ "_3" ], inactivateTrue),
			atim("Item4", 	[ "_4" ], inactivateTrue),
			atim("Item5", 	[ "_5" ], inactivateTrue),
			atim("Item6", 	[ "_6" ], inactivateTrue),
			atim("Item7", 	[ "_7" ], inactivateTrue),
			atim("Item8", 	[ "_8" ], inactivateTrue),
			atim("Item9", 	[ "_9" ], inactivateTrue),

			atim("Recording Start/Stop", [ "`" ], inactivateTrue),
		];

		return actionToInputsMappings;
	}

	activityDefnsBuild(): ActivityDefn[]
	{
		var activityDefns = [];
		activityDefns.push(...ActivityDefn.Instances()._All);
		return activityDefns;
	}

	// Action performs.

	actionPerform_Fire(uwpe: UniverseWorldPlaceEntities): void
	{
		var actor = uwpe.entity;
		var equipmentUser = EquipmentUser.of(actor);
		var entityWieldableEquipped = equipmentUser.itemEntityInSocketWithName("Wielding");
		var actorHasWieldableEquipped = (entityWieldableEquipped != null);

		if (actorHasWieldableEquipped)
		{
			var deviceWieldable = Device.of(entityWieldableEquipped);
			uwpe.entity2Set(entityWieldableEquipped);
			deviceWieldable.use(uwpe);
		}
	}

	actionPerform_Hide(uwpe: UniverseWorldPlaceEntities): void
	{
		var actor = uwpe.entity;
		var learner = SkillLearner.of(actor);
		var knowsHowToHide = learner.skillsKnownNames.indexOf("Hiding") >= 0;
		if (knowsHowToHide)
		{
			var perceptible = Perceptible.of(actor);
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

	actionPerform_Jump(uwpe: UniverseWorldPlaceEntities): void
	{
		var actor = uwpe.entity;
		var learner = SkillLearner.of(actor);
		var canJump = learner.skillsKnownNames.indexOf("Jumping") >= 0;
		if (canJump)
		{
			var loc = Locatable.of(actor).loc;
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

	actionPerform_PickUp(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;
		var world = uwpe.world;
		var place = uwpe.place;
		var entityActor = uwpe.entity;

		var itemHolder = ItemHolder.of(entityActor);
		var itemEntityToPickUp = itemHolder.itemEntityFindClosest
		(
			uwpe
		);

		if (itemEntityToPickUp == null)
		{
			return;
		}

		var canPickUp = itemHolder.itemCanPickUp
		(
			universe, world, place, Item.of(itemEntityToPickUp)
		);

		if (canPickUp)
		{
			var actor = Actor.of(entityActor);
			var activity = actor.activity;
			activity.targetEntitySetByName
			(
				"ItemEntityToPickUp", itemEntityToPickUp
			);
		}
		else
		{
			var message = "Can't pick up!";
			place.entitySpawn2
			(
				universe, world,
				universe.entityBuilder.messageFloater
				(
					message,
					this.font,
					Locatable.of(entityActor).loc.pos,
					Color.Instances().Red
				)
			);
		}
	}

	actionPerform_Run(uwpe: UniverseWorldPlaceEntities): void
	{
		var actor = uwpe.entity;
		var learner = SkillLearner.of(actor);
		var knowsHowToRun = learner.skillsKnownNames.indexOf("Running") >= 0;
		// knowsHowToRun = true; // debug
		if (knowsHowToRun)
		{
			var loc = Locatable.of(actor).loc;
			var isOnGround = (loc.pos.z >= 0);
			if (isOnGround)
			{
				var vel = loc.vel;
				var speedRunning = 4;
				var speedCurrent = vel.magnitude();
				if (speedCurrent > 0 && speedCurrent < speedRunning)
				{
					vel.multiplyScalar(speedRunning);
				}
			}
		}
	}

	actionPerform_Sneak(uwpe: UniverseWorldPlaceEntities): void
	{
		var actor = uwpe.entity;
		// var learner = SkillLearner.of(actor);
		// var knowsHowToSneak = learner.skillsKnownNames.indexOf("Sneaking") >= 0;
		var knowsHowToSneak = true; // debug
		if (knowsHowToSneak)
		{
			var loc = Locatable.of(actor).loc;
			var isOnGround = (loc.pos.z >= 0);
			if (isOnGround)
			{
				var vel = loc.vel;
				var speedSneaking = .5;
				vel.trimToMagnitudeMax(speedSneaking);
			}
		}
	}

	actionPerform_Use(uwpe: UniverseWorldPlaceEntities): void
	{
		var actor = uwpe.entity;
		var place = uwpe.place as PlaceBase;
		var entityUsablesInPlace = Usable.entitiesFromPlace(place);
		var actorPos = Locatable.of(actor).loc.pos;
		var radiusOfReach = 20; // todo
		var entityUsablesWithinReach = entityUsablesInPlace.filter
		(
			(x: Entity) =>
				Locatable.of(x).loc.pos.clone().subtract(actorPos).magnitude() < radiusOfReach
		);
		if (entityUsablesWithinReach.length > 0)
		{
			var entityToUse = entityUsablesWithinReach[0];
			uwpe.entity2Set(entityToUse);
			Usable.of(entityToUse).use(uwpe);
		}
	}

	actionPerform_Wait(uwpe: UniverseWorldPlaceEntities): void
	{
		var actor = uwpe.entity;
		Actor.of(actor).activity.defnName = "Wait";
	};

}
