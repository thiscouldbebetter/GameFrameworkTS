
function PlaceDemo(size, playerPos, numberOfKeysToUnlockGoal)
{
	this.size = size;

	this.actions =
	[
		Action.Instances.DoNothing,
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
					world, actor, Coords.Instances.ZeroOneZero
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
					world, actor, Coords.Instances.MinusOneZeroZero
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
					world, actor, Coords.Instances.OneZeroZero
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
					world, actor, Coords.Instances.ZeroMinusOneZero
				);
			}
		),
	].addLookups("name");

	this.inputToActionMappings =
	[
		new InputToActionMapping("Escape", "ShowMenu"),

		new InputToActionMapping("ArrowDown", "MoveDown"),
		new InputToActionMapping("ArrowLeft", "MoveLeft"),
		new InputToActionMapping("ArrowRight", "MoveRight"),
		new InputToActionMapping("ArrowUp", "MoveUp"),

		new InputToActionMapping("Gamepad0Down", "MoveDown"),
		new InputToActionMapping("Gamepad0Left", "MoveLeft"),
		new InputToActionMapping("Gamepad0Right", "MoveRight"),
		new InputToActionMapping("Gamepad0Up", "MoveUp"),

	].addLookups("inputName");

	// entities

	var entityDimension = 10;
	var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);

	// player

	var playerLoc = new Location(playerPos);
	var playerCollider = new Sphere(playerLoc.pos, entityDimension / 2);
	var playerColor = "Gray";
	var playerVisualBody = new VisualCircle(entityDimension / 2, playerColor);
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
				5, // ticksPerFrame
				[
					new VisualOffset(visualRectangleSmall, new Coords(1, 0).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(1.5, 0).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(2, 0).multiplyScalar(entityDimension)),
				]
			),
			new VisualAnimation
			(
				5, // ticksPerFrame
				[
					new VisualOffset(visualRectangleSmall, new Coords(0, 1).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(0, 1.5).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(0, 2).multiplyScalar(entityDimension)),
				]
			),
			new VisualAnimation
			(
				5, // ticksPerFrame
				[
					new VisualOffset(visualRectangleSmall, new Coords(-1, 0).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(-1.5, 0).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(-2, 0).multiplyScalar(entityDimension)),
				]
			),
			new VisualAnimation
			(
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

		if (entityOther.damager != null)
		{
			messageToDisplay = "You lose!";
		}
		else if (entityOther.goal != null)
		{
			var keysRequired =
				new Item("Key", entityOther.goal.numberOfKeysToUnlock);
			if (entityPlayer.itemHolder.hasItems(keysRequired))
			{
				messageToDisplay = "You win!";
			}
		}
		else if (entityOther.item != null)
		{
			var item = entityOther.item;
			entityPlayer.itemHolder.itemAdd(item);
			place.entitiesToRemove.push(entityOther);
		}

		if (messageToDisplay != null)
		{
			var venueMessage = new VenueMessage
			(
				messageToDisplay,
				new VenueControls(universe.controlBuilder.title(universe)), // venueNext
				universe.venueCurrent, // venuePrev
				universe.display.sizeDefault.clone().half()
			);
			universe.venueNext = venueMessage;
		}
	}

	var constraintSpeedMax = new Constraint("SpeedMax", 5);
	var constraintFriction = new Constraint("Friction", .03);

	var playerEntity = new Entity
	(
		"Player",
		[
			new Locatable(playerLoc),
			new Constrainable([constraintFriction, constraintSpeedMax]),
			new Collidable
			(
				playerCollider,
				[ "collidable" ], // entityPropertyNamesToCollideWith
				playerCollide
			),
			new Drawable(playerVisual),
			new ItemHolder(),
			new Playable(),
		]
	);

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
			enemyColliderAsFace.vertices,
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
			new Constrainable([constraintSpeedMax]),
			new Collidable(enemyCollider),
			new Damager(),
			new Drawable(enemyVisual),
			new Actor
			(
				function activity(universe, world, place, actor)
				{
					var entityToTargetName = "Player";
					var target = place.entities[entityToTargetName];
					var actorLoc = actor.locatable.loc;

					actorLoc.vel.overwriteWith
					(
						target.locatable.loc.pos
					).subtract
					(
						actorLoc.pos
					).normalize();
				}
			),
		]
	);

	var obstacleColor = damagerColor;

	var obstacleMappedCellSize = new Coords(2, 2, 1);

	var obstacleMappedMap = new Map
	(
		new Coords(16, 16, 1), //sizeInCells,
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
		// cellSource
		[
			"xxxx............",
			"x..x............",
			"x..x............",
			"x..x............",
			"x..x............",
			"x..x............",
			"x..xxxxxxxxxxxxx",
			"x..............x",
			"x..............x",
			"xxxxxxxxxxxxx..x",
			"............x..x",
			"............x..x",
			"............x..x",
			"............x..x",
			"............x..x",
			"............xxxx",
		]
	);

	var obstacleMappedPos =
		playerLoc.pos.clone().addDimensions(playerLoc.pos.x, this.size.y / 2, 0);
	var obstacleMappedLoc = new Location(obstacleMappedPos);

	var obstacleMappedVisualLookup =
	{
		"Blocking" : new VisualRectangle(obstacleMappedCellSize, obstacleColor),
		"Open" : new VisualNone()
	};
	var obstacleMappedEntity = new Entity
	(
		"ObstacleMapped",
		[
			new Locatable(obstacleMappedLoc),
			new Collidable(new MapLocated(obstacleMappedMap, obstacleMappedLoc)),
			new Damager(),
			new Drawable(new VisualMap(obstacleMappedMap, obstacleMappedVisualLookup))
		]
	);
	this.camera = new Camera
	(
		this.size.clone(),
		null, // focalLength
		new Location
		(
			new Coords(0, 0, 0),
			Orientation.Instances.ForwardZDownY.clone()
		)
	);

	var entities =
	[
		playerEntity,
		enemyEntity,
		obstacleMappedEntity,
	];

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
				new Damager(),
				new Drawable(obstacleWallVisual)
			]
		);

		entities.push(obstacleWallEntity);
	}

	var itemColor = "Yellow";
	var itemVisual = new VisualGroup
	([
		new VisualCircle(entityDimension / 2, itemColor),
		new VisualOffset
		(
			new VisualText("Key", itemColor),
			new Coords(0, entityDimension)
		)
	]);

	var marginThickness = wallThickness * 3;
	var sizeMinusMargins =
		this.size.clone().subtract(new Coords(1, 1, 0).multiplyScalar(marginThickness));
	for (var i = 0; i < numberOfKeysToUnlockGoal; i++)
	{
		var itemPos = new Coords().randomize().multiply(sizeMinusMargins);
		var itemCollider = new Sphere(itemPos, entityDimension / 2);

		var itemEntity = new Entity
		(
			"Item" + i,
			[
				new Item("Key", 1),
				new Locatable( new Location(itemPos) ),
				new Collidable(itemCollider),
				new Drawable(itemVisual)
			]
		);

		entities.push(itemEntity);
	}

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
					new VisualText("" + numberOfKeysToUnlockGoal, itemColor),					
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

	var obstaclePos = goalEntity.locatable.loc.pos;
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
		"Obstacle",
		[
			new Locatable(obstacleLoc),
			new Collidable(obstacleCollider),
			new Damager(),
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

	this.placeInner = new Place(entities);
	this.placeInner.parent = this;

	// Helper variables.

	this.drawPos = new Coords();
	this.drawLoc = new Location(this.drawPos);
}
{
	PlaceDemo.prototype.draw = function(universe, world)
	{
		var display = universe.display;

		display.drawBackground("Gray", "Black");

		var drawLoc = this.drawLoc;
		var drawPos = drawLoc.pos;

		var player = this.placeInner.entities["Player"];
		var playerLoc = player.locatable.loc;

		var camera = this.camera;
		camera.loc.pos.overwriteWith
		(
			playerLoc.pos
		).trimToRangeMinMax
		(
			camera.viewSizeHalf,
			this.size.clone().subtract(camera.viewSizeHalf)
		);

		this.placeInner.draw(universe, world);
	}

	PlaceDemo.prototype.entityAccelerateInDirection = function
	(
		world, entity, directionToMove
	)
	{
		var entityLoc = entity.locatable.loc;

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
	}

	PlaceDemo.prototype.initialize = function(universe, world)
	{
		this.placeInner.initialize(universe, world);
	}

	PlaceDemo.prototype.updateForTimerTick = function(universe, world)
	{
		this.placeInner.updateForTimerTick(universe, world);
	}
}
