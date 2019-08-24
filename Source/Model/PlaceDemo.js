
function PlaceDemo(size, numberOfKeysToUnlockGoal)
{
	this.size = size;

	var cameraViewSize = this.size.clone().half();
	var cameraFocalLength = cameraViewSize.x;
	this.camera = new Camera
	(
		cameraViewSize,
		cameraFocalLength, // focalLength
		new Location
		(
			new Coords(0, 0, -cameraFocalLength),
			Orientation.Instances().ForwardZDownY.clone()
		)
	);

	var coordsInstances = Coords.Instances();

	this.actions =
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
	].addLookupsByName();

	this.inputToActionMappings =
	[
		new InputToActionMapping("Escape", "ShowMenu"),

		new InputToActionMapping("ArrowDown", "MoveDown"),
		new InputToActionMapping("ArrowLeft", "MoveLeft"),
		new InputToActionMapping("ArrowRight", "MoveRight"),
		new InputToActionMapping("ArrowUp", "MoveUp"),
		new InputToActionMapping("Enter", "Fire"),

		new InputToActionMapping("Gamepad0Down", "MoveDown"),
		new InputToActionMapping("Gamepad0Left", "MoveLeft"),
		new InputToActionMapping("Gamepad0Right", "MoveRight"),
		new InputToActionMapping("Gamepad0Up", "MoveUp"),
		new InputToActionMapping("Gamepad0Button0", "Fire"),

	].addLookups( function(x) { return x.inputName; } );

	// entities

	var entityDimension = 10;
	var entityDimensionHalf = entityDimension / 2;
	var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);

	var entities = [];

	// background
	var visualBackgroundDimension = 100;

	var visualBackgroundCellSize =
		new Coords(.5, .5, .01).multiplyScalar(visualBackgroundDimension);
	var visualBackgroundBottom = new VisualRepeating
	(
		visualBackgroundCellSize,
		this.camera.viewSize.clone(), // viewSize
		new VisualRectangle
		(
			visualBackgroundCellSize,
			null, "rgba(255, 255, 255, 0.02)"
		)
	);
	var entityBackgroundBottom = new Entity
	(
		"BackgroundBottom",
		[
			new Locatable(new Location(new Coords(0, 0, cameraFocalLength))),
			new Drawable(visualBackgroundBottom)
		]
	);
	entities.push(entityBackgroundBottom);

	visualBackgroundCellSize =
		new Coords(1, 1, .01).multiplyScalar(visualBackgroundDimension);
	var visualBackgroundTop = new VisualRepeating
	(
		visualBackgroundCellSize, // cellSize
		this.camera.viewSize.clone(), // viewSize
		new VisualRectangle
		(
			visualBackgroundCellSize,
			null, "rgba(255, 255, 255, 0.06)"
		)
	);
	var entityBackgroundTop = new Entity
	(
		"BackgroundTop",
		[
			new Locatable(new Location(new Coords(0, 0, 0))),
			new Drawable(visualBackgroundTop)
		]
	);
	entities.push(entityBackgroundTop);


	// player

	var playerPos = new Coords(30, 30);
	var playerLoc = new Location(playerPos);
	var playerCollider = new Sphere(playerLoc.pos, entityDimensionHalf);
	var playerColor = "Gray";
	var playerVisualBody = new VisualCircle(entityDimensionHalf, playerColor);
	var playerVisualDirectionalIndicator = new VisualDirectional
	(
		new VisualNone(),
		[
			new VisualRay
			(
				entityDimension * 1.25, // length
				playerColor
			)
		]
	);

	var visualRectangleSmall = new VisualRectangle
	(
		entitySize.clone().divideScalar(4), playerColor
	);

	var playerVisualMovementIndicator = new VisualDirectional
	(
		new VisualNone(),
		[
			new VisualAnimation
			(
				"MoveRight",
				5, // ticksPerFrame
				[
					new VisualOffset(visualRectangleSmall, new Coords(1, 0).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(1.5, 0).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(2, 0).multiplyScalar(entityDimension)),
				]
			),
			new VisualAnimation
			(
				"MoveDown",
				5, // ticksPerFrame
				[
					new VisualOffset(visualRectangleSmall, new Coords(0, 1).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(0, 1.5).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(0, 2).multiplyScalar(entityDimension)),
				]
			),
			new VisualAnimation
			(
				"MoveLeft",
				5, // ticksPerFrame
				[
					new VisualOffset(visualRectangleSmall, new Coords(-1, 0).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(-1.5, 0).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(-2, 0).multiplyScalar(entityDimension)),
				]
			),
			new VisualAnimation
			(
				"MoveUp",
				5, // ticksPerFrame
				[
					new VisualOffset(visualRectangleSmall, new Coords(0, -1).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(0, -1.5).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(0, -2).multiplyScalar(entityDimension)),
				]
			),
		]
	);

	var playerVisualName = new VisualOffset
	(
		new VisualText("Player", playerColor),
		new Coords(0, entityDimension)
	);

	var playerVisual = new VisualGroup
	([
		playerVisualDirectionalIndicator,
		playerVisualBody,
		playerVisualName,
		playerVisualMovementIndicator,
	]);

	var playerCollide = function(universe, world, place, entityPlayer, entityOther)
	{
		var messageToDisplay = null;

		if (entityOther.Damager != null)
		{
			universe.collisionHelper.collideCollidables(entityPlayer, entityOther);

			var playerAsKillable = entityPlayer.Killable;
			playerAsKillable.integrity -= entityOther.Damager.damagePerHit;
		}
		else if (entityOther.Goal != null)
		{
			var keysRequired =
				new Item("Key", entityOther.Goal.numberOfKeysToUnlock);
			if (entityPlayer.ItemHolder.hasItems(keysRequired))
			{
				var venueMessage = new VenueMessage
				(
					"You win!",
					new VenueControls(universe.controlBuilder.title(universe)), // venueNext
					universe.venueCurrent, // venuePrev
					universe.display.sizeDefault().clone().half()
				);
				universe.venueNext = venueMessage;
			}
		}
		else if (entityOther.Item != null)
		{
			entityPlayer.ItemHolder.itemEntityAdd(entityOther);
			place.entitiesToRemove.push(entityOther);
		}
		else if (entityOther.Talker != null)
		{
			entityOther.Collidable.ticksUntilCanCollide = 100;
			entityOther.Drawable.animationRuns["Friendly"].ticksSinceStarted = 0;

			var conversationDefnAsJSON =
				universe.mediaLibrary.textStringGetByName("Conversation").value;
			var conversationDefn = ConversationDefn.deserialize(conversationDefnAsJSON);
			var venueToReturnTo = universe.venueCurrent;
			var conversation = new ConversationRun
			(
				conversationDefn,
				function quit(conversationRun)
				{
					universe.venueNext = venueToReturnTo;
				}
			);
			var conversationSize = universe.display.sizeDefault().clone();
			var conversationAsControl =
				conversation.toControl(conversationSize, universe);

			var venueNext = new VenueControls(conversationAsControl);

			universe.venueNext = venueNext;
		}
	};

	var constraintSpeedMax5 = new Constraint("SpeedMax", 5);
	var constraintFriction = new Constraint("Friction", .03);

	var playerEntity = new Entity
	(
		"Player",
		[
			new Locatable(playerLoc),
			new Constrainable([constraintFriction, constraintSpeedMax5]),
			new Collidable
			(
				playerCollider,
				[ Collidable.name ], // entityPropertyNamesToCollideWith
				playerCollide
			),
			new Drawable(playerVisual),
			new ItemHolder(),
			new Playable(),
			new Idleable(),
			new Killable
			(
				5, // integrity
				function die(universe, world, place, entityKillable)
				{
					var venueMessage = new VenueMessage
					(
						"You lose!",
						new VenueControls(universe.controlBuilder.title(universe)), // venueNext
						universe.venueCurrent, // venuePrev
						universe.display.sizeDefault().clone().half()
					);
					universe.venueNext = venueMessage;
				}
			)
		]
	);

	entities.push(playerEntity);

	// friendly

	var friendlyColor = "Green";
	var friendlyPos = new Coords().randomize().multiply(this.size);
	var friendlyLoc = new Location(friendlyPos);

	var friendlyCollider = new Sphere(friendlyLoc.pos, entityDimensionHalf);

	var friendlyVisualNormal = new VisualEllipse
	(
		entityDimensionHalf, // semimajorAxis
		entityDimensionHalf * .8,
		.125, // rotationInTurns
		friendlyColor,
		null // colorBorder
	);

	var friendlyVisual = new VisualGroup
	([
		new VisualAnimation
		(
			"Friendly",
			100, // ticksPerFrame
			// children
			[
				new VisualAnimation
				(
					"Blinking",
					3, // ticksPerFrame
					[
						new VisualNone(),
						friendlyVisualNormal
					]
				),

				friendlyVisualNormal
			],
			false // isRepeating
		),
		new VisualOffset
		(
			new VisualText("Talker", friendlyColor),
			new Coords(0, entityDimension)
		)
	]);

	var constraintSpeedMax1 = new Constraint("SpeedMax", 1);

	var friendlyEntity = new Entity
	(
		"Friendly",
		[
			new Locatable(friendlyLoc),
			new Constrainable([constraintSpeedMax1]),
			new Collidable(friendlyCollider),
			new Drawable(friendlyVisual),
			new Talker("AnEveningWithProfessorSurly"),
			new Actor
			(
				function activity(universe, world, place, entityActor, target)
				{
					var actor = entityActor.Actor;
					var targetPos = actor.target;
					if (targetPos == null)
					{
						targetPos =
							new Coords().randomize().multiply(place.size);
						actor.target = targetPos;
					}

					var actorLoc = entityActor.Locatable.loc;
					var actorPos = actorLoc.pos;

					var distanceToTarget = targetPos.clone().subtract
					(
						actorPos
					).magnitude();

					if (distanceToTarget >= 2)
					{
						actorLoc.vel.overwriteWith
						(
							targetPos
						).subtract
						(
							actorPos
						).normalize();
					}
					else
					{
						actorPos.overwriteWith(targetPos);
						actor.target = null;
					}
				}
			),
		]
	);

	entities.push(friendlyEntity);

	// enemy

	var damagerColor = "Red";
	var enemyColor = damagerColor;
	var enemyPos = this.size.clone().subtract(playerLoc.pos);
	var enemyLoc = new Location(enemyPos);

	var enemyColliderAsFace = new Face([
		new Coords(0, -entityDimension).half(),
		new Coords(entityDimension, entityDimension).half(),
		new Coords(-entityDimension, entityDimension).half(),
	]);
	var enemyCollider = Mesh.fromFace
	(
		enemyPos, // center
		enemyColliderAsFace,
		1 // thickness
	);

	var enemyVisual = new VisualGroup
	([
		new VisualPolygon
		(
			new Path(enemyColliderAsFace.vertices),
			enemyColor,
			null // colorBorder
		),
		new VisualOffset
		(
			new VisualText("Chaser", enemyColor),
			new Coords(0, entityDimension)
		)
	]);

	var enemyEntity = new Entity
	(
		"Enemy",
		[
			new Locatable(enemyLoc),
			new Constrainable([constraintSpeedMax1]),
			new Collidable(enemyCollider),
			new Damager(1),
			new Killable(1),
			new Drawable(enemyVisual),
			new Actor
			(
				function activity(universe, world, place, actor, entityToTargetName)
				{
					var target = place.entities[entityToTargetName];
					var actorLoc = actor.Locatable.loc;

					actorLoc.accel.overwriteWith
					(
						target.Locatable.loc.pos
					).subtract
					(
						actorLoc.pos
					).normalize().multiplyScalar(.1);
				},
				"Player"
			),
		]
	);

	entities.push(enemyEntity);

	var obstacleColor = damagerColor;

	var numberOfWalls = 4;
	var wallThickness = 5;

	for (var i = 0; i < numberOfWalls; i++)
	{
		var obstacleWallSize;
		if (i % 2 == 0)
		{
			obstacleWallSize = new Coords(size.x, wallThickness, 1);
		}
		else
		{
			obstacleWallSize = new Coords(wallThickness, size.y, 1);
		}

		var obstacleWallPos = obstacleWallSize.clone().half().clearZ();
		if (i >= 2)
		{
			obstacleWallPos.invert().add(size);
		}

		var obstacleWallLoc = new Location(obstacleWallPos);
		var obstacleCollider =
			new Bounds(obstacleWallPos, obstacleWallSize);
		var obstacleWallVisual = new VisualRectangle
		(
			obstacleWallSize, obstacleColor
		);

		var obstacleWallEntity = new Entity
		(
			"ObstacleWall" + i,
			[
				new Locatable(obstacleWallLoc),
				new Collidable(obstacleCollider),
				new Damager(1),
				new Drawable(obstacleWallVisual)
			]
		);

		entities.push(obstacleWallEntity);
	}

	var obstacleMappedCellSource =
	[
		"....xxxx....",
		".....xx.....",
		".....xx....",
		"....xxxx....",
		"x..xx..xx..x",
		"xxxx.xx.xxxx",
		"xxxx.xx.xxxx",
		"x..xx..xx..x",
		"....xxxx....",
		".....xx.....",
		".....xx.....",
		"....xxxx....",
	];
	var obstacleMappedSizeInCells = new Coords
	(
		obstacleMappedCellSource[0].length,
		obstacleMappedCellSource.length,
		1
	);

	var obstacleMappedCellSize = new Coords(2, 2, 1);

	var obstacleMappedMap = new Map
	(
		obstacleMappedSizeInCells,
		obstacleMappedCellSize,
		new MapCell(), // cellPrototype
		function cellAtPosInCells(map, cellPosInCells, cellToOverwrite)
		{
			var cellCode = map.cellSource[cellPosInCells.y][cellPosInCells.x];
			var cellVisualName = (cellCode == "x" ? "Blocking" : "Open");
			var cellIsBlocking = (cellCode == "x");
			cellToOverwrite.visualName = cellVisualName;
			cellToOverwrite.isBlocking = cellIsBlocking;
			return cellToOverwrite;
		},
		obstacleMappedCellSource
	);

	var obstacleMappedVisualLookup =
	{
		"Blocking" : new VisualRectangle(obstacleMappedCellSize, obstacleColor),
		"Open" : new VisualNone()
	};
	var obstacleMappedVisual = new VisualGroup
	([
		new VisualMap(obstacleMappedMap, obstacleMappedVisualLookup),
		new VisualOffset
		(
			new VisualText("Mine", obstacleColor),
			new Coords(0, entityDimension)
		)
	]);

	var marginThickness = wallThickness * 4;
	var marginSize = new Coords(1, 1, 0).multiplyScalar(marginThickness);
	var sizeMinusMargins =
		this.size.clone().subtract(marginSize).subtract(marginSize);

	var numberOfMines = 48;
	var entitiesObstacles = [];
	for (var i = 0; i < numberOfMines; i++)
	{
		var obstacleMappedPos =
			new Coords().randomize().multiply(sizeMinusMargins).add(marginSize);
		var obstacleMappedLoc = new Location(obstacleMappedPos);

		var obstacleMappedEntity = new Entity
		(
			"ObstacleMapped",
			[
				new Locatable(obstacleMappedLoc),
				new Collidable(new MapLocated(obstacleMappedMap, obstacleMappedLoc)),
				new Damager(1),
				new Drawable(obstacleMappedVisual)
			]
		);

		entitiesObstacles.push(obstacleMappedEntity);
		entities.push(obstacleMappedEntity);
	}

	// obstacleBar

	var obstacleBarSize = new Coords(6, 2).multiplyScalar(entityDimension);
	var obstaclePos = playerPos.clone().add(obstacleBarSize).add(obstacleBarSize);
	var obstacleLoc = new Location(obstaclePos);
	var obstacleCollider = new Bounds
	(
		obstaclePos,
		obstacleBarSize
	);

	var obstacleBarEntity = new Entity
	(
		"ObstacleBar",
		[
			new Locatable(obstacleLoc),
			new Collidable(obstacleCollider),
			new Damager(1),
			new Drawable
			(
				new VisualGroup
				([
					new VisualRectangle
					(
						obstacleCollider.size,
						obstacleColor, obstacleColor
					),
					new VisualOffset
					(
						new VisualText("Bar", obstacleColor),
						new Coords(0, obstacleCollider.size.y)
					)
				])
			)
		]
	);

	entities.push(obstacleBarEntity);

	var itemKeyColor = "Yellow";
	var itemKeyVisual = new VisualGroup
	([
		new VisualCircle(entityDimensionHalf, itemKeyColor),
		new VisualOffset
		(
			new VisualText("Key", itemKeyColor),
			new Coords(0, entityDimension)
		)
	]);

	var obstacleExclusionRadius = 32;
	var displacement = new Coords();

	for (var i = 0; i < numberOfKeysToUnlockGoal; i++)
	{
		var itemKeyPos =
			new Coords().randomize().multiply(sizeMinusMargins).add(marginSize);

		for (var j = 0; j < entitiesObstacles.length; j++)
		{
			var obstaclePos = entitiesObstacles[j].Locatable.loc.pos;
			var distanceFromObstacle =
				displacement.overwriteWith(obstaclePos).magnitude();
			if (distanceFromObstacle < obstacleExclusionRadius)
			{
				displacement.normalize().multiplyScalar(obstacleExclusionRadius);
				obstaclePos.add(displacement);
			}
		}

		var itemKeyCollider = new Sphere(itemKeyPos, entityDimensionHalf);

		var itemKeyEntity = new Entity
		(
			"Key" + i,
			[
				new Item("Key", 1),
				new Locatable( new Location(itemKeyPos) ),
				new Collidable(itemKeyCollider),
				new Drawable(itemKeyVisual)
			]
		);

		entities.push(itemKeyEntity);
	}

	var itemWeaponColor = "Cyan";
	var itemWeaponVisual = new VisualGroup
	([
		new VisualCircle(entityDimensionHalf, itemWeaponColor),
		new VisualOffset
		(
			new VisualText("Weapon", itemWeaponColor),
			new Coords(0, entityDimension)
		)
	]);

	var itemWeaponPos =
		//new Coords().randomize().multiply(sizeMinusMargins);
		playerPos.clone().double();
	var itemWeaponCollider = new Sphere(itemWeaponPos, entityDimensionHalf);

	var itemWeaponDevice = Device.gun();

	var itemWeaponEntity = new Entity
	(
		"Weapon",
		[
			new Item("Weapon", 1),
			new Locatable( new Location(itemWeaponPos) ),
			new Collidable(itemWeaponCollider),
			new Drawable(itemWeaponVisual),
			itemWeaponDevice
		]
	);

	entities.push(itemWeaponEntity);

	// goal

	var goalPos = new Coords().randomize().multiplyScalar
	(
		.5
	).addDimensions
	(
		.25, .25, 0
	).multiply
	(
		this.size
	);
	var goalLoc = new Location(goalPos);
	var goalColor = "Green";
	var goalEntity = new Entity
	(
		"Goal",
		[
			new Locatable(goalLoc),
			new Collidable(new Bounds(goalPos, entitySize)),
			new Drawable
			(
				new VisualGroup
				([
					new VisualRectangle(entitySize, goalColor),
					new VisualText("" + numberOfKeysToUnlockGoal, itemKeyColor),
					new VisualOffset
					(
						new VisualText("Exit", goalColor),
						new Coords(0, entityDimension)
					)
				])
			),
			new Goal(numberOfKeysToUnlockGoal),
		]
	);

	entities.push(goalEntity);

	// obstacleRing

	var obstaclePos = goalEntity.Locatable.loc.pos;
	var obstacleLoc = new Location(obstaclePos);
	obstacleLoc.spin.angleInTurnsRef.value = 0.002;
	var obstacleCollider = new Arc
	(
		new Shell
		(
			new Sphere(obstaclePos, entityDimension * 3), // sphereOuter
			entityDimension * 2 // radiusInner
		),
		new Wedge
		(
			obstaclePos,
			obstacleLoc.orientation.forward, //new Coords(1, 0, 0), // directionMin
			.85 // angleSpannedInTurns
		)
	);

	var obstacleRingEntity = new Entity
	(
		"ObstacleRing",
		[
			new Locatable(obstacleLoc),
			new Collidable(obstacleCollider),
			new Damager(1),
			new Drawable
			(
				new VisualArc
				(
					obstacleCollider,
					obstacleColor, obstacleColor
				)
			)
		]
	);

	entities.push(obstacleRingEntity);

	// Add camera projection to all visuals.

	for (var i = 0; i < entities.length; i++)
	{
		var entity = entities[i];
		var entityDrawable = entity.Drawable;
		if (entityDrawable != null)
		{
			var entityVisual = entityDrawable.visual;
			entityDrawable.visual =
				new VisualCamera(entityVisual, this.camera);
		}
	}

	var controlStatus = new ControlLabel
	(
		"labelHealth",
		new Coords(8, 5), //pos,
		new Coords(100, 0), //size,
		false, // isTextCentered,
		new DataBinding(playerEntity.Killable, "integrity"), // text,
		10, // fontHeightInPixels
	);
	this.venueControls = new VenueControls(controlStatus);

	Place.call(this, entities);

	// Helper variables.

	this.drawPos = new Coords();
	this.drawLoc = new Location(this.drawPos);
}
{
	PlaceDemo.prototype = Object.create(Place.prototype);
	PlaceDemo.prototype.constructor = PlaceDemo;

	PlaceDemo.prototype.draw_FromSuperclass = Place.prototype.draw;
	PlaceDemo.prototype.draw = function(universe, world)
	{
		var display = universe.display;

		display.drawBackground("Gray", "Black");

		var drawLoc = this.drawLoc;
		var drawPos = drawLoc.pos;

		var player = this.entities["Player"];
		var playerLoc = player.Locatable.loc;

		var camera = this.camera;
		camera.loc.pos.overwriteWith
		(
			playerLoc.pos
		).trimToRangeMinMax
		(
			camera.viewSizeHalf,
			this.size.clone().subtract(camera.viewSizeHalf)
		).subtract
		(
			new Coords(0, 0, camera.focalLength)
		);

		this.draw_FromSuperclass(universe, world);

		// todo
		this.venueControls.draw(universe);
	};

	PlaceDemo.prototype.entityAccelerateInDirection = function
	(
		world, entity, directionToMove
	)
	{
		var entityLoc = entity.Locatable.loc;

		entityLoc.orientation.forwardSet(directionToMove);
		var vel = entityLoc.vel;
		if (vel.equals(directionToMove) == false)
		{
			entityLoc.timeOffsetInTicks = world.timerTicksSoFar;
		}
		entityLoc.accel.overwriteWith(directionToMove).multiplyScalar
		(
			.5 // hack
		);
	};
}
