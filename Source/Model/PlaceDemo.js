
function PlaceDemo(size, numberOfKeysToUnlockGoal, numberOfObstacles)
{
	this.size = size;

	this.cameraBuild();

	// entities

	var entityDimension = 10;
	var entityDimensionHalf = entityDimension / 2;
	var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);

	var entities = [];

	this.entityBuildBackground(entities);

	var visualEyeRadius = entityDimension * .75 / 2;
	var visualEyesBlinking = this.visualEyesBlinkingBuild(visualEyeRadius);

	var playerEntity = this.entityBuildPlayer(entities, entityDimension, visualEyeRadius, visualEyesBlinking);
	var playerPos = playerEntity.Locatable.loc.pos;

	var constraintSpeedMax1 = new Constraint("SpeedMax", 1);

	this.entityBuildFriendly(entities, entityDimension, constraintSpeedMax1, visualEyesBlinking);

	var damagerColor = this.entityBuildEnemy
	(
		entities, entityDimension, constraintSpeedMax1, playerPos, visualEyeRadius, visualEyesBlinking
	);

	var obstacleColor = damagerColor;

	var wallThickness = this.entityBuildObstacleWalls(entities, obstacleColor);
	var marginThickness = wallThickness * 8;
	var marginSize = new Coords(1, 1, 0).multiplyScalar(marginThickness);

	var entitiesObstacles = this.entityBuildObstacleMines
	(
		entities, entityDimension, numberOfObstacles, obstacleColor, marginSize
	);

	this.entityBuildObstacleBar(entities, entityDimension, obstacleColor, playerPos);

	var itemKeyColor = this.entityBuildKeys
	(
		entities, entityDimension, numberOfKeysToUnlockGoal, entitiesObstacles, marginSize
	);

	this.entityBuildCoins(entities, entityDimension, marginSize);

	this.entityBuildWeapon(entities, entityDimension, playerPos);

	var goalEntity = this.entityBuildGoal
	(
		entities, entityDimension, entitySize, numberOfKeysToUnlockGoal, itemKeyColor
	);

	this.entityBuildObstacleRing(entities, entityDimension, goalEntity, obstacleColor);

	this.entityBuildContainer(entities, entityDimension, entitySize);

	this.entityBuildStore(entities, entityDimension, entitySize);

	this.entitiesAllAddCameraProjection(entities);

	this.venueControlsBuild(playerEntity);

	Place.call(this, "Demo", entities);

	// Helper variables.

	this.drawPos = new Coords();
	this.drawLoc = new Location(this.drawPos);
}
{
	PlaceDemo.prototype = Object.create(Place.prototype);
	PlaceDemo.prototype.constructor = PlaceDemo;

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

	// Constructor helpers.

	PlaceDemo.prototype.cameraBuild = function()
	{
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
	};

	PlaceDemo.prototype.entitiesAllAddCameraProjection = function(entities)
	{
		// Add camera projection to all visuals.

		for (var i = 0; i < entities.length; i++)
		{
			var entity = entities[i];
			var entityDrawable = entity.Drawable;
			if (entityDrawable != null)
			{
				var entityVisual = entityDrawable.visual;
				entityDrawable.visual = new VisualCamera
				(
					entityVisual,
					(universe, world) => world.place.camera
				);
			}
		}
	};

	PlaceDemo.prototype.entityBuildBackground = function(entities)
	{
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
				new Locatable(new Location(new Coords(0, 0, this.camera.focalLength))),
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
	};

	PlaceDemo.prototype.entityBuildCoins = function
	(
		entities, entityDimension, marginSize
	)
	{
		var entityDimensionHalf = entityDimension / 2;
		var sizeMinusMargins = marginSize.clone().double().invert().add(this.size);

		var itemCoinColor = "Yellow";
		var itemCoinVisual = new VisualGroup
		([
			new VisualCircle
			(
				entityDimensionHalf, itemCoinColor
			),
			new VisualCircle
			(
				entityDimensionHalf * .75, null, "Gray"
			),
			new VisualOffset
			(
				new VisualText("Coin", itemCoinColor),
				new Coords(0, entityDimension)
			)
		]);
		var itemCoinCollider = new Sphere(new Coords(0, 0), entityDimensionHalf);

		var displacement = new Coords();

		var numberOfCoins = 10;
		for (var i = 0; i < numberOfCoins; i++)
		{
			var itemCoinPos =
				new Coords().randomize().multiply(sizeMinusMargins).add(marginSize);

			var itemCoinEntity = new Entity
			(
				"Coin" + i,
				[
					new Item("Coin", 1),
					new Locatable( new Location(itemCoinPos) ),
					new Collidable(itemCoinCollider),
					new Drawable(itemCoinVisual)
				]
			);

			entities.push(itemCoinEntity);
		}
	};

	PlaceDemo.prototype.entityBuildContainer = function
	(
		entities, entityDimension, entitySize
	)
	{
		var containerPos = new Coords().randomize().multiplyScalar(.5).multiply
		(
			this.size
		);
		var containerLoc = new Location(containerPos);
		var containerColor = "Orange";
		var containerEntity = new Entity
		(
			"Container",
			[
				new Collidable(new Bounds(new Coords(0, 0), entitySize)),
				new Drawable
				(
					new VisualGroup
					([
						new VisualRectangle
						(
							new Coords(1.5, 1).multiplyScalar(entityDimension),
							containerColor
						),
						new VisualRectangle
						(
							new Coords(1.5 * entityDimension, 1), "Gray"
						),
						new VisualRectangle
						(
							new Coords(.5, .5).multiplyScalar(entityDimension), "Gray"
						),
						new VisualOffset
						(
							new VisualText("Container", containerColor),
							new Coords(0, entityDimension)
						)
					])
				),
				new ItemContainer(),
				new ItemHolder(),
				new Locatable(containerLoc)
			]
		);

		entities.push(containerEntity);

		return containerEntity;
	};

	PlaceDemo.prototype.entityBuildEnemy = function
	(
		entities, entityDimension, constraintSpeedMax1, playerPos, visualEyeRadius, visualEyesBlinking
	)
	{
		var damagerColor = "Red";
		var enemyColor = damagerColor;
		var enemyDimension = entityDimension * 2;

		var enemyColliderAsFace = new Face([
			new Coords(-.5, -1).multiplyScalar(enemyDimension).half(),
			new Coords(.5, -1).multiplyScalar(enemyDimension).half(),
			new Coords(1, 1).multiplyScalar(enemyDimension).half(),
			new Coords(-1, 1).multiplyScalar(enemyDimension).half(),
		]);
		var enemyCollider = Mesh.fromFace
		(
			new Coords(0, 0), // center
			enemyColliderAsFace,
			1 // thickness
		);

		var enemyVisualArm = new VisualPolars
		(
			[ new Polar(0, enemyDimension) ],
			enemyColor,
			2 // lineThickness
		);

		var visualEyesBlinkingWithBrows = new VisualGroup
		([
			visualEyesBlinking,
			new VisualPath
			(
				new Path([new Coords(-8, -8), new Coords(0, 0), new Coords(8, -8)]),
				"rgb(64, 64, 64)",
				3 // lineThickness
			),
		]);

		var visualEyesWithBrowsDirectional = new VisualDirectional
		(
			visualEyesBlinking, // visualForNoDirection
			[
				new VisualOffset(visualEyesBlinkingWithBrows, new Coords(1, 0).multiplyScalar(visualEyeRadius)),
				new VisualOffset(visualEyesBlinkingWithBrows, new Coords(0, 1).multiplyScalar(visualEyeRadius)),
				new VisualOffset(visualEyesBlinkingWithBrows, new Coords(-1, 0).multiplyScalar(visualEyeRadius)),
				new VisualOffset(visualEyesBlinkingWithBrows, new Coords(0, -1).multiplyScalar(visualEyeRadius))
			]
		);

		var enemyVisual = new VisualGroup
		([
			new VisualDirectional
			(
				new VisualNone(),
				[
					new VisualGroup
					([
						new VisualOffset
						(
							enemyVisualArm, new Coords(-enemyDimension / 4, 0)
						),
						new VisualOffset
						(
							enemyVisualArm, new Coords(enemyDimension / 4, 0)
						)
					])
				]
			),
			new VisualPolygon
			(
				new Path(enemyColliderAsFace.vertices),
				enemyColor,
				null // colorBorder
			),
			visualEyesWithBrowsDirectional,
			new VisualOffset
			(
				new VisualText("Chaser", enemyColor),
				new Coords(0, enemyDimension)
			)
		]);

		enemyVisual = new VisualCamera
		(
			enemyVisual,
			(universe, world) => world.place.camera
		);

		var enemyActivity = function (universe, world, place, actor, entityToTargetName)
		{
			var target = place.entities[entityToTargetName];
			if (target == null)
			{
				return;
			}

			var actorLoc = actor.Locatable.loc;

			actorLoc.accel.overwriteWith
			(
				target.Locatable.loc.pos
			).subtract
			(
				actorLoc.pos
			).normalize().multiplyScalar(.1);

			actorLoc.orientation.forwardSet(actorLoc.accel.clone().normalize());
		};

		var enemyEntityPrototype = new Entity
		(
			"Enemy",
			[
				new Actor(enemyActivity, "Player"),
				new Constrainable([constraintSpeedMax1]),
				new Collidable(enemyCollider),
				new Damager(1),
				new Drawable(enemyVisual),
				new Enemy(),
				new Killable(1),
				new Locatable(new Location(new Coords())),
			]
		);

		var generatorActivity = function(universe, world, place, actor, entityToTargetName)
		{
			var enemyCount = place.enemies().length;
			var enemyCountMax = 3;
			if (enemyCount < enemyCountMax)
			{
				var enemyEntityToPlace = enemyEntityPrototype.clone(universe);

				var placeSizeHalf = place.size.clone().half();
				var directionFromCenter = new Polar(Math.random(), 1);
				var offsetFromCenter =
					directionFromCenter.toCoords(new Coords()).multiply
					(
						placeSizeHalf
					).double();

				var enemyPosToStartAt =
					offsetFromCenter.trimToRangeMinMax
					(
						placeSizeHalf.clone().invert(),
						placeSizeHalf
					);

				enemyPosToStartAt.multiplyScalar(1.1);

				enemyPosToStartAt.add(placeSizeHalf);

				enemyEntityToPlace.Locatable.loc.pos.overwriteWith(enemyPosToStartAt);

				place.entitiesToSpawn.push(enemyEntityToPlace);
			}
		};

		var enemyGeneratorEntity = new Entity
		(
			"EnemyGenerator",
			[
				new Actor(generatorActivity)
			]
		);

		entities.push(enemyGeneratorEntity);

		return damagerColor;
	};

	PlaceDemo.prototype.entityBuildFriendly = function(entities, entityDimension, constraintSpeedMax1, visualEyesBlinking)
	{
		var friendlyColor = "Green";
		var friendlyPos = new Coords().randomize().multiply(this.size);
		var friendlyLoc = new Location(friendlyPos);
		var friendlyDimension = entityDimension;

		var friendlyCollider = new Sphere(new Coords(0, 0), friendlyDimension);

		var friendlyVisualNormal = new VisualGroup
		([
			new VisualEllipse
			(
				friendlyDimension, // semimajorAxis
				friendlyDimension * .8,
				.25, // rotationInTurns
				friendlyColor,
				null // colorBorder
			),

			new VisualOffset(visualEyesBlinking, new Coords(0, -friendlyDimension / 3)),

			new VisualOffset
			(
				new VisualArc
				(
					friendlyDimension / 2, // radiusOuter
					0, // radiusInner
					new Coords(1, 0, 0), // directionMin
					.5, // angleSpannedInTurns
					"White"
				),
				new Coords(0, friendlyDimension / 3) // offset
			)
		]);

		var friendlyVisual = new VisualGroup
		([
			new VisualAnimation
			(
				"Friendly",
				[ 100, 100 ], // ticksToHoldFrames
				// children
				[
					new VisualAnimation
					(
						"Blinking",
						[ 3, 3 ], // ticksToHoldFrames
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
				new Coords(0, friendlyDimension * 2)
			)
		]);

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
	};

	PlaceDemo.prototype.entityBuildGoal = function
	(
		entities, entityDimension, entitySize, numberOfKeysToUnlockGoal, itemKeyColor
	)
	{
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
				new Collidable(new Bounds(new Coords(0, 0), entitySize)),
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

		return goalEntity;
	};

	PlaceDemo.prototype.entityBuildKeys = function
	(
		entities, entityDimension, numberOfKeysToUnlockGoal, entitiesObstacles, marginSize
	)
	{
		var entityDimensionHalf = entityDimension / 2;
		var sizeMinusMargins = marginSize.clone().double().invert().add(this.size);

		var itemKeyColor = "Yellow";
		var itemKeyVisual = new VisualGroup
		([
			new VisualArc
			(
				entityDimensionHalf, // radiusOuter
				entityDimensionHalf / 2, // radiusInner
				Coords.Instances().Ones, // directionMin
				1, // angleSpannedInTurns
				itemKeyColor
			),
			new VisualOffset
			(
				new VisualPolars
				(
					[
						new Polar(0, entityDimensionHalf),
						new Polar(.25, entityDimensionHalf / 2)
					],
					itemKeyColor,
					entityDimensionHalf / 2 // lineThickness
				),
				new Coords(entityDimensionHalf, 0)
			),
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

			var itemKeyCollider = new Sphere(new Coords(0, 0), entityDimensionHalf);

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

		return itemKeyColor;
	};

	PlaceDemo.prototype.entityBuildObstacleBar = function(entities, entityDimension, obstacleColor, playerPos)
	{
		var entityDimensionHalf = entityDimension / 2;

		var obstacleBarSize = new Coords(6, 2).multiplyScalar(entityDimension);
		var obstaclePos = playerPos.clone().add(obstacleBarSize).add(obstacleBarSize);
		var obstacleLoc = new Location(obstaclePos);
		var obstacleRotationInTurns = .0625;
		var obstacleCollider = new RectangleRotated
		(
			new Bounds(new Coords(0, 0), obstacleBarSize), obstacleRotationInTurns
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
					new VisualRotate
					(
						obstacleRotationInTurns,
						new VisualGroup
						([
							new VisualRectangle
							(
								obstacleCollider.bounds.size,
								obstacleColor, obstacleColor
							),
							new VisualOffset
							(
								new VisualText("Bar", obstacleColor),
								new Coords(0, obstacleCollider.bounds.size.y)
							)
						])
					)
				)
			]
		);

		entities.push(obstacleBarEntity);
	};

	PlaceDemo.prototype.entityBuildObstacleMines = function(
		entities, entityDimension, numberOfObstacles, obstacleColor, marginSize
	)
	{
		var obstacleMappedCellSource =
		[
			"....xxxx....",
			".....xx.....",
			".....xx.....",
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

		var sizeMinusMargins =
			this.size.clone().subtract(marginSize).subtract(marginSize);

		var entitiesObstacles = [];
		for (var i = 0; i < numberOfObstacles; i++)
		{
			var obstacleMappedPos =
				new Coords().randomize().multiply(sizeMinusMargins).add(marginSize);
			var obstacleMappedLoc = new Location(obstacleMappedPos);

			var obstacleMappedEntity = new Entity
			(
				"ObstacleMapped",
				[
					new Locatable(obstacleMappedLoc),
					new Collidable
					(
						new MapLocated(obstacleMappedMap, new Location(new Coords(0, 0)))
					),
					new Damager(1),
					new Drawable(obstacleMappedVisual)
				]
			);

			entitiesObstacles.push(obstacleMappedEntity);
			entities.push(obstacleMappedEntity);
		}

		return entitiesObstacles;
	};

	PlaceDemo.prototype.entityBuildObstacleRing = function(entities, entityDimension, goalEntity, obstacleColor)
	{
		// obstacleRing

		var obstaclePos = goalEntity.Locatable.loc.pos;
		var obstacleLoc = new Location(obstaclePos);
		obstacleLoc.spin.angleInTurnsRef.value = 0.002;
		var obstacleCollider = new Arc
		(
			new Shell
			(
				new Sphere(new Coords(0, 0), entityDimension * 3), // sphereOuter
				entityDimension * 2 // radiusInner
			),
			new Wedge
			(
				new Coords(0, 0), // vertex
				obstacleLoc.orientation.forward, //new Coords(1, 0, 0), // directionMin
				.85 // angleSpannedInTurns
			)
		);

		var obstacleRingVisual = new VisualArc
		(
			entityDimension * 3, // radiusOuter
			entityDimension * 2, // radiusInner
			new Coords(1, 0, 0), // directionMin
			.85, // angleSpannedInTurns
			obstacleColor
		);

		var obstacleRingEntity = new Entity
		(
			"ObstacleRing",
			[
				new Locatable(obstacleLoc),
				new Collidable(obstacleCollider),
				new Damager(1),
				new Drawable(obstacleRingVisual)
			]
		);

		entities.push(obstacleRingEntity);
	};

	PlaceDemo.prototype.entityBuildObstacleWalls = function(entities, obstacleColor)
	{
		var numberOfWalls = 4;
		var wallThickness = 5;

		for (var i = 0; i < numberOfWalls; i++)
		{
			var obstacleWallSize;
			if (i % 2 == 0)
			{
				obstacleWallSize = new Coords(this.size.x, wallThickness, 1);
			}
			else
			{
				obstacleWallSize = new Coords(wallThickness, this.size.y, 1);
			}

			var obstacleWallPos = obstacleWallSize.clone().half().clearZ();
			if (i >= 2)
			{
				obstacleWallPos.invert().add(this.size);
			}

			var obstacleWallLoc = new Location(obstacleWallPos);
			var obstacleCollider =
				new Bounds(new Coords(0, 0), obstacleWallSize);
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

		return wallThickness;
	};

	PlaceDemo.prototype.entityBuildPlayer = function(entities, entityDimension, visualEyeRadius, visualEyesBlinking)
	{
		var visualEyesDirectional = new VisualDirectional
		(
			visualEyesBlinking, // visualForNoDirection
			[
				new VisualOffset(visualEyesBlinking, new Coords(1, 0).multiplyScalar(visualEyeRadius)),
				new VisualOffset(visualEyesBlinking, new Coords(0, 1).multiplyScalar(visualEyeRadius)),
				new VisualOffset(visualEyesBlinking, new Coords(-1, 0).multiplyScalar(visualEyeRadius)),
				new VisualOffset(visualEyesBlinking, new Coords(0, -1).multiplyScalar(visualEyeRadius))
			]
		);

		var playerPos = new Coords(30, 30);
		var playerLoc = new Location(playerPos);
		var playerHeadRadius = entityDimension * .75;
		var playerCollider = new Sphere(new Coords(0, 0), playerHeadRadius);
		var playerColor = "Gray";

		var playerVisualName = new VisualOffset
		(
			new VisualText("Player", playerColor),
			new Coords(0, playerHeadRadius * 2)
		);

		var playerVisual = new VisualGroup
		([
			new VisualCircle(playerHeadRadius, playerColor),
			visualEyesDirectional,
			playerVisualName
		]);

		var playerCollide = function(universe, world, place, entityPlayer, entityOther)
		{
			var messageToDisplay = null;

			if (entityOther.Damager != null)
			{
				universe.collisionHelper.collideCollidables(entityPlayer, entityOther);

				var playerAsKillable = entityPlayer.Killable;
				var damagePerHit = entityOther.Damager.damagePerHit;
				playerAsKillable.integrity -= damagePerHit;

				var messageEntity = new Entity
				(
					"Message" + universe.idHelper.idNext(),
					[
						new Drawable
						(
							new VisualCamera
							(
								new VisualText("-" + damagePerHit, "Red"),
								(universe, world) => world.place.camera
							)
						),
						new Ephemeral(20),
						new Locatable
						(
							new Location(entityPlayer.Locatable.loc.pos.clone()).velSet
							(
								new Coords(0, -1)
							)
						),
					]
				);
				place.entitySpawn(universe, world, messageEntity);
			}
			else if (entityOther.ItemContainer != null)
			{
				entityOther.Collidable.ticksUntilCanCollide = 50; // hack
				var tradeSession = new ItemTradeSession
				(
					[ entityPlayer, entityOther ],
					universe.venueCurrent
				);
				var tradeSessionAsControl = tradeSession.toControl
				(
					universe, universe.display.sizeInPixels
				);
				var venueNext = new VenueControls(tradeSessionAsControl);
				venueNext = new VenueFader(venueNext);
				universe.venueNext = venueNext;
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

		return playerEntity;
	};

	PlaceDemo.prototype.entityBuildStore = function
	(
		entities, entityDimension, entitySize
	)
	{
		var storePos = new Coords().randomize().multiplyScalar(.5).multiply
		(
			this.size
		);
		var storeLoc = new Location(storePos);
		var storeColor = "Brown";
		var storeEntity = new Entity
		(
			"Store",
			[
				new Collidable(new Bounds(new Coords(0, 0), entitySize)),
				new Drawable
				(
					new VisualGroup
					([
						new VisualRectangle
						(
							new Coords(1, 1.5).multiplyScalar(entityDimension),
							storeColor
						),
						new VisualOffset
						(
							new VisualText("Store", storeColor),
							new Coords(0, entityDimension)
						)
					])
				),
				new ItemContainer(),
				new ItemHolder(),
				new Locatable(storeLoc)
			]
		);

		entities.push(storeEntity);

		return storeEntity;
	};

	PlaceDemo.prototype.entityBuildWeapon = function(entities, entityDimension, playerPos)
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemWeaponColor = "rgb(0, 128, 128)";
		var itemWeaponVisual = new VisualGroup
		([
			new VisualCircle(entityDimensionHalf, itemWeaponColor),
			new VisualOffset
			(
				new VisualText("Weapon", itemWeaponColor),
				new Coords(0, entityDimension)
			)
		]);

		var itemWeaponPos = playerPos.clone().double();
		var itemWeaponCollider = new Sphere(new Coords(0, 0), entityDimensionHalf);

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
	};

	PlaceDemo.prototype.venueControlsBuild = function(playerEntity)
	{
		var controlStatus = new ControlLabel
		(
			"labelHealth",
			new Coords(8, 5), //pos,
			new Coords(100, 0), //size,
			false, // isTextCentered,
			new DataBinding
			(
				playerEntity.Killable,
				function get(c) { return c.integrity; }
			), // text,
			10, // fontHeightInPixels
		);
		this.venueControls = new VenueControls(controlStatus);
	};

	PlaceDemo.prototype.visualEyesBlinkingBuild = function(visualEyeRadius)
	{
		var visualPupilRadius = visualEyeRadius / 2;

		var visualEye = new VisualGroup
		([
			new VisualCircle(visualEyeRadius, "White"),
			new VisualCircle(visualPupilRadius, "Black")
		]);

		var visualEyes = new VisualGroup
		([
			new VisualOffset
			(
				visualEye, new Coords(-visualEyeRadius, 0)
			),
			new VisualOffset
			(
				visualEye, new Coords(visualEyeRadius, 0)
			)
		]);

		var visualEyesBlinking = new VisualAnimation
		(
			"EyesBlinking",
			[ 50, 5 ], // ticksToHoldFrames
			[ visualEyes, new VisualNone() ],
		);

		return visualEyesBlinking;
	};

	Place.prototype.player = function()
	{
		return this.entitiesByPropertyName(Playable.name)[0];
	}

	Place.prototype.enemies = function()
	{
		return this.entitiesByPropertyName(Enemy.name);
	}

	// Place implementation.

	PlaceDemo.prototype.draw_FromSuperclass = Place.prototype.draw;
	PlaceDemo.prototype.draw = function(universe, world)
	{
		var display = universe.display;

		display.drawBackground("Gray", "Black");

		var drawLoc = this.drawLoc;
		var drawPos = drawLoc.pos;

		var player = this.player();
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
}
