
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
		new Action
		(
			"Fire",
			function perform(universe, world, place, actor)
			{
				var itemWeapon = new Item("Weapon", 1);
				var actorHasWeapon = actor.itemHolder.hasItems(itemWeapon);

				if (actorHasWeapon == false) { return; }

				var actorLoc = actor.locatable.loc;
				var actorPos = actorLoc.pos;
				var actorVel = actorLoc.vel;
				var actorSpeed = actorVel.magnitude();
				if (actorSpeed == 0) { return; }

				var itemProjectileColor = "Cyan";
				var itemProjectileRadius = 3;
				var itemProjectileVisual = new VisualGroup
				([
					new VisualCircle(itemProjectileRadius, itemProjectileColor),
					new VisualOffset
					(
						new VisualText("Projectile", itemProjectileColor),
						new Coords(0, itemProjectileRadius)
					)
				]);

				var actorDirection = actorVel.clone().normalize();
				var actorRadius = actor.collidable.collider.radius;
				var itemProjectilePos = actorPos.clone().add
				(
					actorDirection.clone().multiplyScalar(actorRadius).double().double()
				); 
				var itemProjectileLoc = new Location(itemProjectilePos);
				itemProjectileLoc.vel.overwriteWith(actorVel).double();

				var itemProjectileCollider = 
					new Sphere(itemProjectilePos, itemProjectileRadius);

				var itemProjectileCollide = function(universe, world, place, entityPlayer, entityOther)
				{
					if (entityOther.killable != null)
					{
						place.entitiesToRemove.push(entityOther);
					}
				}

				var itemProjectileEntity = new Entity
				(
					"Projectile",
					[
						new Damager(),
						new Ephemeral(32),
						new Locatable( itemProjectileLoc ),
						new Collidable
						(
							itemProjectileCollider, 
							[ "killable" ],
							itemProjectileCollide
						),
						new Drawable(itemProjectileVisual)
					]
				);

				place.entitiesToSpawn.push(itemProjectileEntity);
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
		new InputToActionMapping("Enter", "Fire"),

		new InputToActionMapping("Gamepad0Down", "MoveDown"),
		new InputToActionMapping("Gamepad0Left", "MoveLeft"),
		new InputToActionMapping("Gamepad0Right", "MoveRight"),
		new InputToActionMapping("Gamepad0Up", "MoveUp"),
		new InputToActionMapping("Gamepad0Button0", "Fire"),

	].addLookups("inputName");

	// entities

	var entityDimension = 10;
	var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);

	var entities = [];

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

	entities.push(playerEntity);

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
			new Constrainable([constraintSpeedMax]),
			new Collidable(enemyCollider),
			new Damager(),
			new Killable(),
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

	entities.push(enemyEntity);

	var obstacleColor = damagerColor;

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

	var numberOfMines = 3;
	for (var i = 0; i < numberOfMines; i++)
	{
		var obstacleMappedPos = new Coords().randomize().multiply(size);
		var obstacleMappedLoc = new Location(obstacleMappedPos);

		var obstacleMappedEntity = new Entity
		(
			"ObstacleMapped",
			[
				new Locatable(obstacleMappedLoc),
				new Collidable(new MapLocated(obstacleMappedMap, obstacleMappedLoc)),
				new Damager(),
				new Drawable(obstacleMappedVisual)
			]
		);

		entities.push(obstacleMappedEntity);
	}

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

	var itemKeyColor = "Yellow";
	var itemKeyVisual = new VisualGroup
	([
		new VisualCircle(entityDimension / 2, itemKeyColor),
		new VisualOffset
		(
			new VisualText("Key", itemKeyColor),
			new Coords(0, entityDimension)
		)
	]);

	var marginThickness = wallThickness * 3;
	var sizeMinusMargins =
		this.size.clone().subtract(new Coords(1, 1, 0).multiplyScalar(marginThickness));

	for (var i = 0; i < numberOfKeysToUnlockGoal; i++)
	{
		var itemKeyPos = new Coords().randomize().multiply(sizeMinusMargins);
		var itemKeyCollider = new Sphere(itemKeyPos, entityDimension / 2);

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
		new VisualCircle(entityDimension / 2, itemWeaponColor),
		new VisualOffset
		(
			new VisualText("Weapon", itemWeaponColor),
			new Coords(0, entityDimension)
		)
	]);

	var itemWeaponPos = new Coords().randomize().multiply(sizeMinusMargins);
	var itemWeaponCollider = new Sphere(itemWeaponPos, entityDimension / 2);

	var itemWeaponEntity = new Entity
	(
		"Weapon",
		[
			new Item("Weapon", 1),
			new Locatable( new Location(itemWeaponPos) ),
			new Collidable(itemWeaponCollider),
			new Drawable(itemWeaponVisual)
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

	Place.call(this, entities);

	// Helper variables.

	this.drawPos = new Coords();
	this.drawLoc = new Location(this.drawPos);
}
{
	PlaceDemo.prototype = Object.create(Place.prototype);
	PlaceDemo.prototype.constructor = PlaceDemo;

	PlaceDemo.prototype.draw_FromSuperclass = PlaceDemo.prototype.draw;
	PlaceDemo.prototype.draw = function(universe, world)
	{
		var display = universe.display;

		display.drawBackground("Gray", "Black");

		var drawLoc = this.drawLoc;
		var drawPos = drawLoc.pos;

		var player = this.entities["Player"];
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

		this.draw_FromSuperclass(universe, world);
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
}
