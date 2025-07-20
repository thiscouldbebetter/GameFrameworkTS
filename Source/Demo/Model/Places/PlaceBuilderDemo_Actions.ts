
class PlaceBuilderDemo_Actions
{
	parent: PlaceBuilderDemo;
	font: FontNameAndHeight;

	constructor(parent: PlaceBuilderDemo)
	{
		this.parent = parent;
		this.font =
			FontNameAndHeight.fromHeightInPixels(this.parent.entityDimension);
	}

	// actions

	actionsBuild(): Action[]
	{
		var actionsAll = Action.Instances();

		var a = (n: string, p: any) => new Action(n, p);

		var uiisn = (uwpe: UniverseWorldPlaceEntities, n: number) =>
			this.actionPerform_UseItemInSocketNumbered(uwpe, n);

		var actions =
		[
			actionsAll.DoNothing,

			DisplayRecorder.actionStartStop(),

			actionsAll.ShowMenuPlayer,

			Movable.actionAccelerateAndFaceDown(),
			Movable.actionAccelerateAndFaceLeft(),
			Movable.actionAccelerateAndFaceRight(),
			Movable.actionAccelerateAndFaceUp(),

			a("Fire", this.actionPerform_Fire),
			a("Hide", this.actionPerform_Hide),
			a("Jump", this.actionPerform_Jump),
			a("Pick Up", this.actionPerform_PickUp),
			a("Run", this.actionPerform_Run),
			a("Sneak", this.actionPerform_Sneak),
			a("Use", this.actionPerform_Use),
			a("Wait", this.actionPerform_Wait),

			a("Item0", (uwpe: UniverseWorldPlaceEntities) => uiisn(uwpe, 0) ),
			a("Item1", (uwpe: UniverseWorldPlaceEntities) => uiisn(uwpe, 1) ),
			a("Item2", (uwpe: UniverseWorldPlaceEntities) => uiisn(uwpe, 2) ),
			a("Item3", (uwpe: UniverseWorldPlaceEntities) => uiisn(uwpe, 3) ),
			a("Item4", (uwpe: UniverseWorldPlaceEntities) => uiisn(uwpe, 4) ),
			a("Item5", (uwpe: UniverseWorldPlaceEntities) => uiisn(uwpe, 5) ),
			a("Item6", (uwpe: UniverseWorldPlaceEntities) => uiisn(uwpe, 6) ),
			a("Item7", (uwpe: UniverseWorldPlaceEntities) => uiisn(uwpe, 7) ),
			a("Item8", (uwpe: UniverseWorldPlaceEntities) => uiisn(uwpe, 8) ),
			a("Item9", (uwpe: UniverseWorldPlaceEntities) => uiisn(uwpe, 9) ),
		];

		return actions;
	}

	actionToInputsMappingsBuild(): ActionToInputsMapping[]
	{
		var inputs = Input.Instances();

		var inactivateFalse = false;
		var inactivateTrue = true;

		var actions = Action.Instances();

		var atim = (a: string, b: string[], c: boolean) =>
			new ActionToInputsMapping(a, b, c);

		var actionToInputsMappings =
		[
			atim
			(
				actions.ShowMenuPlayer.name,
				[ inputs.Escape.name, inputs.Tab.name ],
				inactivateFalse
			),

			atim
			(
				Movable.actionAccelerateAndFaceDown().name,
				[
					inputs.ArrowDown.name,
					inputs.s.name,
					inputs.GamepadMoveDown.name + "0"
				],
				inactivateFalse
			),
			atim
			(
				Movable.actionAccelerateAndFaceLeft().name,
				[
					inputs.ArrowLeft.name,
					inputs.a.name,
					inputs.GamepadMoveLeft.name + "0"
				],
				inactivateFalse
			),
			atim
			(
				Movable.actionAccelerateAndFaceRight().name,
				[
					inputs.ArrowRight.name,
					inputs.d.name,
					inputs.GamepadMoveRight.name + "0"
				],
				inactivateFalse
			),
			atim
			(
				Movable.actionAccelerateAndFaceUp().name,
				[
					inputs.ArrowUp.name,
					inputs.w.name,
					inputs.GamepadMoveUp.name + "0"
				],
				inactivateFalse
			),

			atim
			(
				"Fire", 
				[
					inputs.f.name,
					inputs.Enter.name,
					inputs.GamepadButton0.name + "0"
				],
				inactivateTrue
			),
			atim
			(
				"Hide",
				[
					inputs.h.name,
					inputs.GamepadButton0.name + "3"
				],
				inactivateFalse
			),
			atim
			(
				"Jump",
				[
					inputs.Space.name,
					inputs.GamepadButton0.name + "1"
				],
				inactivateTrue
			),
			atim
			(
				"Pick Up", 
				[
					inputs.g.name,
					inputs.GamepadButton0.name + "4"
				],
				inactivateTrue
			),
			atim
			(
				"Run",
				[
					inputs.Shift.name,
					inputs.GamepadButton0.name + "2"
				],
				inactivateFalse
			),
			atim
			(
				"Sneak",
				[
					inputs.Control.name,
					inputs.GamepadButton0.name + "6"
				],
				inactivateFalse
			),
			atim
			(
				"Use",
				[
					inputs.e.name,
					inputs.GamepadButton0.name + "5"
				],
				inactivateTrue
			),
			atim
			(
				"Wait",
				[ inputs.p.name ],
				inactivateTrue
			),

			atim("Item0", 	[ inputs._0.name ], inactivateTrue),
			atim("Item1", 	[ inputs._1.name ], inactivateTrue),
			atim("Item2", 	[ inputs._2.name ], inactivateTrue),
			atim("Item3", 	[ inputs._3.name ], inactivateTrue),
			atim("Item4", 	[ inputs._4.name ], inactivateTrue),
			atim("Item5", 	[ inputs._5.name ], inactivateTrue),
			atim("Item6", 	[ inputs._6.name ], inactivateTrue),
			atim("Item7", 	[ inputs._7.name ], inactivateTrue),
			atim("Item8", 	[ inputs._8.name ], inactivateTrue),
			atim("Item9", 	[ inputs._9.name ], inactivateTrue),

			atim("Recording Start/Stop", [ inputs.Tilde.name ], inactivateTrue),
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
		var entityWieldableEquipped =
			equipmentUser.itemEntityInSocketWithName("Wielding");
		var actorHasWieldableEquipped =
			(entityWieldableEquipped != null);

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

	actionPerform_UseItemInSocketNumbered
	(
		uwpe: UniverseWorldPlaceEntities, socketIndex: number
	): void
	{
		var equipmentUser = EquipmentUser.of(uwpe.entity);
		equipmentUser.useItemInSocketNumbered(uwpe, socketIndex);
	}

	actionPerform_Wait(uwpe: UniverseWorldPlaceEntities): void
	{
		var actor = uwpe.entity;
		Actor.of(actor).activity.defnName = "Wait";
	};

}
