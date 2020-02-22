
function PlaceBuilderDemo()
{
	// Do nothing.
}

{
	PlaceBuilderDemo.prototype.build = function
	(
		name, size, cameraViewSize, placeNameToReturnTo, randomizer, itemDefns
	)
	{
		this.name = name;
		this.size = size.clearZ();
		this.randomizer = randomizer || RandomizerLCG.default();

		var entities = [];

		var cameraEntity = this.entityBuildCamera(cameraViewSize);
		entities.push(cameraEntity);

		var camera = cameraEntity.camera;
		this.entityBuildBackground(entities, camera);

		var entityDimension = 10;
		var entityDimensionHalf = entityDimension / 2;
		var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);

		var visualEyeRadius = entityDimension * .75 / 2;
		var visualBuilder = new VisualBuilder();
		var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);

		var playerEntity = this.entityBuildPlayer
		(
			entities, entityDimension, visualEyeRadius, visualEyesBlinking
		);
		var playerPos = playerEntity.locatable.loc.pos;
		var damagerColor = "Red";
		var obstacleColor = damagerColor;
		var wallThickness = this.entityBuildObstacleWalls(entities, obstacleColor);

		if (placeNameToReturnTo != null)
		{
			this.entityBuildBaseExit(entities, entityDimension, entitySize, placeNameToReturnTo);
		}
		else
		{
			var numberOfKeysToUnlockGoal = 5;
			var numberOfObstacles = 48;

			var constraintSpeedMax1 = new Constraint_SpeedMax(1);
			this.entityBuildFriendly
			(
				entities, entityDimension, constraintSpeedMax1, visualEyesBlinking
			);
			this.entityBuildEnemy
			(
				entities, entityDimension, constraintSpeedMax1, playerPos,
				visualEyeRadius, visualEyesBlinking, damagerColor
			);
			var marginThickness = wallThickness * 8;
			var marginSize = new Coords(1, 1, 0).multiplyScalar(marginThickness);
			var entitiesObstacles = this.entityBuildObstacleMines
			(
				entities, entityDimension, numberOfObstacles, obstacleColor, marginSize
			);
			this.entityBuildObstacleBar(entities, entityDimension, obstacleColor, playerPos);
			this.entityBuildAccessory(entities, entityDimension, marginSize, randomizer, itemDefns);
			this.entityBuildArmor(entities, entityDimension, marginSize, randomizer, itemDefns);
			this.entityBuildCoins(entities, entityDimension, marginSize, randomizer, itemDefns);
			var itemKeyColor = this.entityBuildKeys
			(
				entities, entityDimension, numberOfKeysToUnlockGoal, entitiesObstacles, marginSize, itemDefns
			);
			this.entityBuildMaterial(entities, entityDimension, marginSize, randomizer, itemDefns);
			this.entityBuildMedicine(entities, entityDimension, marginSize, randomizer, itemDefns);
			this.entityBuildToolset(entities, entityDimension, playerPos, itemDefns);
			this.entityBuildWeapon(entities, entityDimension, playerPos, itemDefns);
			this.entityBuildWeaponAmmo(entities, entityDimension, size, itemDefns, 10, 5);
			this.entityBuildContainer(entities, entityDimension, entitySize);
			this.entityBuildBase(entities, entityDimension, entitySize, randomizer);
			this.entityBuildStore(entities, entityDimension, entitySize, itemDefns);
			var goalEntity = this.entityBuildGoal
			(
				entities, entityDimension, entitySize, numberOfKeysToUnlockGoal, itemKeyColor
			);
			this.entityBuildObstacleRing(entities, entityDimension, goalEntity, obstacleColor);
		}

		this.entitiesAllAddCameraProjection(entities);

		var entityControls = this.entityControlsBuild(playerEntity, itemDefns);
		entities.push(entityControls);

		entities.forEach(x => { if (x.locatable != null) { x.locatable.loc.pos.z = 0; } })

		var place = new Place(name, "Demo", size, entities);
		return place;
	};

	// Constructor helpers.

	PlaceBuilderDemo.prototype.entityBuildCamera = function(cameraViewSize)
	{
		var viewSizeHalf = cameraViewSize.clone().half();

		var cameraPosBox = new Box().fromMinAndMax
		(
			viewSizeHalf.clone(),
			this.size.clone().subtract(viewSizeHalf)
		);

		var cameraPos = viewSizeHalf.clone();
		var cameraLoc = new Location
		(
			cameraPos,
			Orientation.Instances().ForwardZDownY.clone()
		);
		var camera = new Camera
		(
			cameraViewSize,
			null, // focalLength
			cameraLoc
		);

		var cameraEntity = new Entity
		(
			Camera.name,
			[
				camera,
				new Constrainable
				([
					new Constraint_AttachToEntityWithName("Player"),
					new Constraint_ContainInBox(cameraPosBox)
				]),
				new Locatable(cameraLoc)
			]
		);
		return cameraEntity;
	};

	PlaceBuilderDemo.prototype.entitiesAllAddCameraProjection = function(entities)
	{
		// Add camera projection to all visuals.

		for (var i = 0; i < entities.length; i++)
		{
			var entity = entities[i];
			var entityDrawable = entity.drawable;
			if (entityDrawable != null)
			{
				var entityVisual = entityDrawable.visual;
				entityDrawable.visual = new VisualCamera
				(
					entityVisual,
					(universe, world) => world.placeCurrent.camera()
				);
			}
		}
	};

	PlaceBuilderDemo.prototype.entityBuildAccessory = function
	(
		entities, entityDimension, marginSize, randomizer, itemDefns
	)
	{
		var entityDimensionHalf = entityDimension / 2;
		var sizeMinusMargins = marginSize.clone().double().invert().add(this.size);

		var itemDefnAccessoryName = itemDefns["Speed Booster"].name;
		var itemAccessoryColor = "Green";
		var itemAccessoryVisual = new VisualGroup
		([
			new VisualPolygon
			(
				new Path
				([
					new Coords(.5, 0),
					new Coords(-.5, .5),
					new Coords(-.5, -.5),
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				itemAccessoryColor
			),
			new VisualOffset
			(
				new VisualText(itemDefnAccessoryName, itemAccessoryColor),
				new Coords(0, entityDimension)
			)
		]);
		var itemAccessoryCollider = new Sphere(new Coords(0, 0), entityDimensionHalf);

		var displacement = new Coords();

		var itemAccessoryPos =
			new Coords().randomize(this.randomizer).multiply(sizeMinusMargins).half().add(marginSize);

		var itemAccessoryEntity = new Entity
		(
			itemDefnAccessoryName,
			[
				new Item(itemDefnAccessoryName, 1),
				new Locatable( new Location(itemAccessoryPos) ),
				new Collidable(itemAccessoryCollider),
				new Drawable(itemAccessoryVisual)
			]
		);

		entities.push(itemAccessoryEntity);
	};

	PlaceBuilderDemo.prototype.entityBuildArmor = function
	(
		entities, entityDimension, marginSize, randomizer, itemDefns
	)
	{
		var entityDimensionHalf = entityDimension / 2;
		var sizeMinusMargins = marginSize.clone().double().invert().add(this.size);

		var itemDefnArmorName = itemDefns["Armor"].name;
		var itemArmorColor = "Green";
		var path = new Path
		([
			new Coords(0, 0.5),
			new Coords(-.5, 0),
			new Coords(-.5, -.5),
			new Coords(.5, -.5),
			new Coords(.5, 0),
		]).transform
		(
			Transform_Scale.fromScalar(entityDimension)
		);
		var itemArmorVisual = new VisualGroup
		([
			new VisualPolygon
			(
				path,
				itemArmorColor
			),
			new VisualOffset
			(
				new VisualText(itemDefnArmorName, itemArmorColor),
				new Coords(0, entityDimension)
			)
		]);
		var itemArmorCollider = new Sphere(new Coords(0, 0), entityDimensionHalf);
		var collidable = new Collidable(itemArmorCollider);
		var box = new Box().ofPoints(path.points);
		box.center = collidable.collider.center;
		var boundable = new Boundable(box);

		var displacement = new Coords();

		var itemArmorPos =
			new Coords().randomize(this.randomizer).multiply(sizeMinusMargins).half().add(marginSize);

		var itemArmorEntity = new Entity
		(
			itemDefnArmorName,
			[
				new Armor(.5),
				boundable,
				collidable,
				new Item(itemDefnArmorName, 1),
				new Locatable( new Location(itemArmorPos) ),
				new Drawable(itemArmorVisual)
			]
		);

		entities.push(itemArmorEntity);
	};

	PlaceBuilderDemo.prototype.entityBuildBackground = function(entities, camera)
	{
		var visualBackgroundDimension = 100;

		var visualBackgroundCellSize =
			new Coords(.5, .5, .01).multiplyScalar(visualBackgroundDimension);
		var visualBackgroundBottom = new VisualRepeating
		(
			visualBackgroundCellSize,
			camera.viewSize.clone(), // viewSize
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
				new Locatable(new Location(new Coords(0, 0, camera.focalLength))),
				new Drawable(visualBackgroundBottom)
			]
		);
		entities.push(entityBackgroundBottom);

		visualBackgroundCellSize =
			new Coords(1, 1, .01).multiplyScalar(visualBackgroundDimension);
		var visualBackgroundTop = new VisualRepeating
		(
			visualBackgroundCellSize, // cellSize
			camera.viewSize.clone(), // viewSize
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

	PlaceBuilderDemo.prototype.entityBuildBase = function
	(
		entities, entityDimension, entitySize, randomizer
	)
	{
		var basePos = new Coords().randomize(randomizer).multiplyScalar(.5).multiply
		(
			this.size
		);
		var baseLoc = new Location(basePos);
		var baseColor = "Brown";
		var baseEntity = new Entity
		(
			"Base",
			[
				new Collidable(new Box(new Coords(0, 0), entitySize)),
				new Drawable
				(
					new VisualGroup
					([
						new VisualPolygon
						(
							new Path
							([
								new Coords(0.5, 0.5),
								new Coords(-0.5, 0.5),
								new Coords(-0.5, -0.5),
								new Coords(0, -1),
								new Coords(0.5, -0.5)
							]).transform
							(
								Transform_Scale.fromScalar(entityDimension)
							),
							baseColor
						),
						new VisualOffset
						(
							new VisualText("Base", baseColor),
							new Coords(0, entityDimension)
						)
					])
				),
				new Locatable(baseLoc),
				new Portal( "Base", new Coords(.5, .5).multiply(this.size.clone()) )
			]
		);

		entities.push(baseEntity);

		return baseEntity;
	};

	PlaceBuilderDemo.prototype.entityBuildBaseExit = function
	(
		entities, entityDimension, entitySize, placeNameToReturnTo
	)
	{
		var exitPos = new Coords(.5, .9).multiply
		(
			this.size
		);
		var exitLoc = new Location(exitPos);
		var exitColor = "Brown";

		var exitPortal = new Portal( placeNameToReturnTo, this.size.clone().half() ); // todo

		var exitEntity = new Entity
		(
			"Exit",
			[
				new Collidable(new Box(new Coords(0, 0), entitySize)),
				new Drawable
				(
					new VisualGroup
					([
						new VisualPolygon
						(
							new Path
							([
								new Coords(0.5, 0.5),
								new Coords(-0.5, 0.5),
								new Coords(-0.5, -0.5),
								new Coords(0.5, -0.5)
							]).transform
							(
								Transform_Scale.fromScalar(entityDimension)
							),
							exitColor
						),
						new VisualOffset
						(
							new VisualText("Exit", exitColor),
							new Coords(0, entityDimension)
						)
					])
				),
				new Locatable(exitLoc),
				exitPortal
			]
		);

		entities.push(exitEntity);

		return exitEntity;
	};

	PlaceBuilderDemo.prototype.entityBuildCoins = function
	(
		entities, entityDimension, marginSize, randomizer, itemDefns
	)
	{
		var entityDimensionHalf = entityDimension / 2;
		var sizeMinusMargins = marginSize.clone().double().invert().add(this.size);

		var itemDefnCoinName = itemDefns["Coin"].name;
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
				new VisualText(itemDefnCoinName, itemCoinColor),
				new Coords(0, entityDimension)
			)
		]);
		var itemCoinCollider = new Sphere(new Coords(0, 0), entityDimensionHalf);

		var displacement = new Coords();

		var numberOfCoins = 10;
		for (var i = 0; i < numberOfCoins; i++)
		{
			var itemCoinPos =
				new Coords().randomize(this.randomizer).multiply(sizeMinusMargins).add(marginSize);

			var itemCoinEntity = new Entity
			(
				itemDefnCoinName + i,
				[
					new Item(itemDefnCoinName, 1),
					new Locatable( new Location(itemCoinPos) ),
					new Collidable(itemCoinCollider),
					new Drawable(itemCoinVisual)
				]
			);

			entities.push(itemCoinEntity);
		}
	};

	PlaceBuilderDemo.prototype.entityBuildContainer = function
	(
		entities, entityDimension, entitySize
	)
	{
		var containerPos = new Coords().randomize(this.randomizer).multiplyScalar(.5).multiply
		(
			this.size
		);
		var containerLoc = new Location(containerPos);
		var containerColor = "Orange";
		var containerEntity = new Entity
		(
			"Container",
			[
				new Collidable(new Box(new Coords(0, 0), entitySize)),
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

	PlaceBuilderDemo.prototype.entityBuildEnemy = function
	(
		entities, entityDimension, constraintSpeedMax1, playerPos, visualEyeRadius, visualEyesBlinking, damagerColor
	)
	{
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
				new Path
				([
					// todo - Scale.
					new Coords(-8, -8), new Coords(0, 0), new Coords(8, -8)
				]),
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
			(universe, world) => world.placeCurrent.camera()
		);

		var enemyActivity = function (universe, world, place, actor, entityToTargetName)
		{
			var target = place.entities[entityToTargetName];
			if (target == null)
			{
				return;
			}

			var actorLoc = actor.locatable.loc;

			actorLoc.accel.overwriteWith
			(
				target.locatable.loc.pos
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
				new Damager(10),
				new Drawable(enemyVisual),
				new Enemy(),
				new Killable(10),
				new Locatable(new Location(new Coords())),
			]
		);

		var generatorActivity = function(universe, world, place, actor, entityToTargetName)
		{
			var enemyCount = place.entitiesByPropertyName(Enemy.name).length;
			var enemyCountMax = 3;
			if (enemyCount < enemyCountMax)
			{
				var enemyEntityToPlace = enemyEntityPrototype.clone();

				var placeSizeHalf = place.size.clone().half();
				var directionFromCenter = new Polar(universe.randomizer.getNextRandom(), 1);
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

				enemyEntityToPlace.locatable.loc.pos.overwriteWith(enemyPosToStartAt);

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

	PlaceBuilderDemo.prototype.entityBuildFriendly = function(entities, entityDimension, constraintSpeedMax1, visualEyesBlinking)
	{
		var friendlyColor = "Green";
		var friendlyPos = new Coords().randomize(this.randomizer).multiply(this.size);
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
					// todo - Fix blinking.
					new VisualAnimation
					(
						"Blinking",
						[ 5 ],// , 5 ], // ticksToHoldFrames
						[
							//new VisualNone(),
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

		var randomizer = this.randomizer;

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
						var actor = entityActor.actor;
						var targetPos = actor.target;
						if (targetPos == null)
						{
							targetPos =
								new Coords().randomize(randomizer).multiply(place.size);
							actor.target = targetPos;
						}

						var actorLoc = entityActor.locatable.loc;
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

	PlaceBuilderDemo.prototype.entityBuildGoal = function
	(
		entities, entityDimension, entitySize, numberOfKeysToUnlockGoal, itemKeyColor
	)
	{
		var goalPos = new Coords().randomize(this.randomizer).multiplyScalar
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
				new Collidable(new Box(new Coords(0, 0), entitySize)),
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

	PlaceBuilderDemo.prototype.entityBuildKeys = function
	(
		entities, entityDimension, numberOfKeysToUnlockGoal, entitiesObstacles, marginSize, itemDefns
	)
	{
		var entityDimensionHalf = entityDimension / 2;
		var sizeMinusMargins = marginSize.clone().double().invert().add(this.size);

		var itemDefnKeyName = itemDefns["Key"].name;
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
				new VisualText(itemDefnKeyName, itemKeyColor),
				new Coords(0, entityDimension)
			)
		]);

		var obstacleExclusionRadius = 32;
		var displacement = new Coords();

		for (var i = 0; i < numberOfKeysToUnlockGoal; i++)
		{
			var itemKeyPos =
				new Coords().randomize(this.randomizer).multiply(sizeMinusMargins).add(marginSize);

			for (var j = 0; j < entitiesObstacles.length; j++)
			{
				var obstaclePos = entitiesObstacles[j].locatable.loc.pos;
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
				itemDefnKeyName + i,
				[
					new Item(itemDefnKeyName, 1),
					new Locatable( new Location(itemKeyPos) ),
					new Collidable(itemKeyCollider),
					new Drawable(itemKeyVisual)
				]
			);

			entities.push(itemKeyEntity);
		}

		return itemKeyColor;
	};

	PlaceBuilderDemo.prototype.entityBuildMaterial = function
	(
		entities, entityDimension, marginSize, randomizer, itemDefns
	)
	{
		var entityDimensionHalf = entityDimension / 2;
		var sizeMinusMargins = marginSize.clone().double().invert().add(this.size);

		var itemDefnMaterialName = itemDefns["Material"].name;
		var itemMaterialColor = "Gray";
		var itemMaterialVisual = new VisualGroup
		([
			new VisualPolygon
			(
				new Path
				([
					new Coords(-0.5, 0.5),
					new Coords(0.5, 0.5),
					new Coords(0.2, -0.5),
					new Coords(-0.2, -0.5),
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				itemMaterialColor
			),
			new VisualOffset
			(
				new VisualText(itemDefnMaterialName, itemMaterialColor),
				new Coords(0, entityDimension)
			)
		]);
		var itemMaterialCollider = new Sphere(new Coords(0, 0), entityDimensionHalf);

		var displacement = new Coords();

		var numberOfMaterials = 5;
		for (var i = 0; i < numberOfMaterials; i++)
		{
			var itemMaterialPos =
				new Coords().randomize(this.randomizer).multiply(sizeMinusMargins).add(marginSize);

			var itemMaterialEntity = new Entity
			(
				itemDefnMaterialName + i,
				[
					new Item(itemDefnMaterialName, 1),
					new Locatable( new Location(itemMaterialPos) ),
					new Collidable(itemMaterialCollider),
					new Drawable(itemMaterialVisual)
				]
			);

			entities.push(itemMaterialEntity);
		}
	};

	PlaceBuilderDemo.prototype.entityBuildMedicine = function
	(
		entities, entityDimension, marginSize, randomizer, itemDefns
	)
	{
		var entityDimensionHalf = entityDimension / 2;
		var sizeMinusMargins = marginSize.clone().double().invert().add(this.size);

		var itemDefnMedicineName = itemDefns["Medicine"].name;
		var itemMedicineColor = "Green";
		var itemMedicineVisual = new VisualGroup
		([
			new VisualPolygon
			(
				new Path
				([
					new Coords(-0.5, -0.2),
					new Coords(-0.2, -0.2),
					new Coords(-0.2, -0.5),
					new Coords(0.2, -0.5),
					new Coords(0.2, -0.2),
					new Coords(0.5, -0.2),
					new Coords(0.5, 0.2),
					new Coords(0.2, 0.2),
					new Coords(0.2, 0.5),
					new Coords(-0.2, 0.5),
					new Coords(-0.2, 0.2),
					new Coords(-0.5, 0.2)
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				itemMedicineColor
			),
			new VisualOffset
			(
				new VisualText(itemDefnMedicineName, itemMedicineColor),
				new Coords(0, entityDimension)
			)
		]);
		var itemMedicineCollider = new Sphere(new Coords(0, 0), entityDimensionHalf);

		var displacement = new Coords();

		var numberOfMedicines = 5;
		for (var i = 0; i < numberOfMedicines; i++)
		{
			var itemMedicinePos =
				new Coords().randomize(this.randomizer).multiply(sizeMinusMargins).add(marginSize);

			var itemMedicineEntity = new Entity
			(
				itemDefnMedicineName + i,
				[
					new Item(itemDefnMedicineName, 1),
					new Locatable( new Location(itemMedicinePos) ),
					new Collidable(itemMedicineCollider),
					new Drawable(itemMedicineVisual)
				]
			);

			entities.push(itemMedicineEntity);
		}
	};

	PlaceBuilderDemo.prototype.entityBuildObstacleBar = function(entities, entityDimension, obstacleColor, playerPos)
	{
		var entityDimensionHalf = entityDimension / 2;

		var obstacleBarSize = new Coords(6, 2, 1).multiplyScalar(entityDimension);
		var obstaclePos = playerPos.clone().add(obstacleBarSize).add(obstacleBarSize);
		var obstacleLoc = new Location(obstaclePos);
		var obstacleRotationInTurns = .0625;
		var obstacleCollider = new BoxRotated
		(
			new Box(new Coords(0, 0, 0), obstacleBarSize), obstacleRotationInTurns
		);
		var obstacleCollidable = new Collidable(obstacleCollider);
		var obstacleBounds = obstacleCollidable.collider.sphereSwept();
		var obstacleBoundable = new Boundable(obstacleBounds);

		var obstacleBarEntity = new Entity
		(
			"ObstacleBar",
			[
				obstacleBoundable,
				obstacleCollidable,
				new Damager(10),
				new Drawable
				(
					new VisualRotate
					(
						obstacleRotationInTurns,
						new VisualGroup
						([
							new VisualRectangle
							(
								obstacleCollider.box.size,
								obstacleColor, obstacleColor
							),
							new VisualOffset
							(
								new VisualText("Bar", obstacleColor),
								new Coords(0, obstacleCollider.box.size.y)
							)
						])
					)
				),
				new Locatable(obstacleLoc)
			]
		);

		entities.push(obstacleBarEntity);
	};

	PlaceBuilderDemo.prototype.entityBuildObstacleMines = function(
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
		var obstacleMappedSizeInPixels =
			obstacleMappedSizeInCells.clone().multiply(obstacleMappedCellSize);

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
				new Coords().randomize(this.randomizer).multiply(sizeMinusMargins).add(marginSize);
			var obstacleMappedLoc = new Location(obstacleMappedPos);
			var obstacleCollidable = new Collidable
			(
				new MapLocated(obstacleMappedMap, new Location(new Coords(0, 0, 0)))
			);
			var obstacleBounds = new Box(obstacleCollidable.collider.loc.pos, obstacleMappedMap.size);
			var obstacleBoundable = new Boundable(obstacleBounds);

			var obstacleMappedEntity = new Entity
			(
				"ObstacleMapped",
				[
					obstacleBoundable,
					obstacleCollidable,
					new Damager(10),
					new Drawable(obstacleMappedVisual),
					new Locatable(obstacleMappedLoc)
				]
			);

			entitiesObstacles.push(obstacleMappedEntity);
			entities.push(obstacleMappedEntity);
		}

		return entitiesObstacles;
	};

	PlaceBuilderDemo.prototype.entityBuildObstacleRing = function(entities, entityDimension, goalEntity, obstacleColor)
	{
		// obstacleRing

		var obstaclePos = goalEntity.locatable.loc.pos;
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
				new Damager(10),
				new Drawable(obstacleRingVisual)
			]
		);

		entities.push(obstacleRingEntity);
	};

	PlaceBuilderDemo.prototype.entityBuildObstacleWalls = function(entities, obstacleColor)
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
				new Box(new Coords(0, 0), obstacleWallSize);
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
					new Damager(10),
					new Drawable(obstacleWallVisual)
				]
			);

			entities.push(obstacleWallEntity);
		}

		return wallThickness;
	};

	PlaceBuilderDemo.prototype.entityBuildPlayer = function
	(
		entities, entityDimension, visualEyeRadius, visualEyesBlinking
	)
	{
		var playerPos = new Coords(30, 30);
		var playerLoc = new Location(playerPos);
		var playerHeadRadius = entityDimension * .75;
		var playerCollider = new Sphere(new Coords(0, 0), playerHeadRadius);
		var playerColor = "Gray";

		var playerVisualBody = new VisualBuilder().circleWithEyes
		(
			playerHeadRadius, playerColor, visualEyeRadius, visualEyesBlinking
		);
		var playerVisualName = new VisualOffset
		(
			new VisualText("Player", playerColor),
			new Coords(0, playerHeadRadius * 2)
		);

		var playerVisual = new VisualGroup
		([
			playerVisualBody, playerVisualName
		]);

		var playerCollide = function(universe, world, place, entityPlayer, entityOther)
		{
			var messageToDisplay = null;

			if (entityOther.damager != null)
			{
				universe.collisionHelper.collideCollidables(entityPlayer, entityOther);

				var damage = entityPlayer.killable.damageApply(universe, world, place, entityOther, entityPlayer);

				var messageEntity = new Entity
				(
					"Message" + universe.idHelper.idNext(),
					[
						new Drawable
						(
							new VisualCamera
							(
								new VisualText("-" + damage, "Red"),
								(universe, world) => world.placeCurrent.camera()
							)
						),
						new Ephemeral(20),
						new Locatable
						(
							new Location(entityPlayer.locatable.loc.pos.clone()).velSet
							(
								new Coords(0, -1)
							)
						),
					]
				);
				place.entitySpawn(universe, world, messageEntity);
			}
			else if (entityOther.itemContainer != null)
			{
				entityOther.collidable.ticksUntilCanCollide = 50; // hack
				var itemContainerAsControl = entityOther.itemContainer.toControl
				(
					universe, universe.display.sizeInPixels,
					entityPlayer, entityOther,
					universe.venueCurrent
				);
				var venueNext = new VenueControls(itemContainerAsControl);
				venueNext = new VenueFader(venueNext);
				universe.venueNext = venueNext;
			}
			else if (entityOther.itemStore != null)
			{
				entityOther.collidable.ticksUntilCanCollide = 50; // hack
				var storeAsControl = entityOther.itemStore.toControl
				(
					universe, universe.display.sizeInPixels,
					entityPlayer, entityOther,
					universe.venueCurrent
				);
				var venueNext = new VenueControls(storeAsControl);
				venueNext = new VenueFader(venueNext);
				universe.venueNext = venueNext;
			}
			else if (entityOther.goal != null)
			{
				var keysRequired =
					new Item(itemDefnKeyName, entityOther.goal.numberOfKeysToUnlock);
				if (entityPlayer.itemHolder.hasItem(keysRequired))
				{
					var venueMessage = new VenueMessage
					(
						"You win!",
						function acknowledge(universe)
						{
							universe.venueNext = new VenueFader
							(
								new VenueControls(universe.controlBuilder.title(universe))
							);
						},
						universe.venueCurrent, // venuePrev
						universe.display.sizeDefault().clone().half()
					);
					universe.venueNext = venueMessage;
				}
			}
			else if (entityOther.item != null)
			{
				entityPlayer.itemHolder.itemEntityAdd(entityOther);
				place.entitiesToRemove.push(entityOther);
			}
			else if (entityOther.portal != null)
			{
				entityOther.collidable.ticksUntilCanCollide = 50; // hack
				var portal = entityOther.portal;
				var venueCurrent = universe.venueCurrent;
				var venueMessage = new VenueMessage
				(
					"Portal to: " + portal.destinationPlaceName,
					function acknowledge(universe)
					{
						var world = universe.world;
						world.placeCurrent = world.places[portal.destinationPlaceName];
						entityPlayer.locatable.loc.pos.overwriteWith(portal.destinationPos);
						universe.venueNext = new VenueFader(venueCurrent); // todo
					},
					venueCurrent, // venuePrev
					universe.display.sizeDefault().clone().half()
				);
				universe.venueNext = venueMessage;
			}
			else if (entityOther.talker != null)
			{
				entityOther.collidable.ticksUntilCanCollide = 100;
				entityOther.drawable.animationRuns["Friendly"].ticksSinceStarted = 0;

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

		var constraintSpeedMax5 = new Constraint_SpeedMax(5);
		var constraintFriction = new Constraint_Friction(.03);
		var constrainable = new Constrainable([constraintFriction, constraintSpeedMax5]);

		var itemCategoriesForQuickSlots =
		[
			"Consumable"
		];

		var equipmentSocketDefnGroup = new EquipmentSocketDefnGroup
		(
			"Equippable",
			[
				new EquipmentSocketDefn( "Weapon", [ "Weapon" ] ),
				new EquipmentSocketDefn( "Armor", [ "Armor" ] ),
				new EquipmentSocketDefn( "Accessory", [ "Accessory" ] ),

				new EquipmentSocketDefn( "Item0", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item1", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item2", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item3", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item4", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item5", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item6", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item7", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item8", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item9", itemCategoriesForQuickSlots ),

			]
		);
		var equipmentUser = new EquipmentUser(equipmentSocketDefnGroup);

		var killable = new Killable
		(
			50, // integrity
			function damageApply(universe, world, place, entityDamager, entityKillable)
			{
				var damage = entityDamager.damager.damagePerHit;
				var equipmentUser = entityKillable.equipmentUser;
				var armorEquipped = equipmentUser.itemEntityInSocketWithName("Armor");
				if (armorEquipped != null)
				{
					var armor = armorEquipped.armor;
					damage *= armor.damageMultiplier;
				}
				entityKillable.killable.integrityAdd(0 - damage);
				return damage;
			},
			function die(universe, world, place, entityKillable)
			{
				var venueMessage = new VenueMessage
				(
					"You lose!",
					function acknowledge(universe)
					{
						universe.venueNext = new VenueFader
						(
							new VenueControls(universe.controlBuilder.title(universe))
						);
					},
					universe.venueCurrent, // venuePrev
					universe.display.sizeDefault().clone().half()
				);
				universe.venueNext = venueMessage;
			}
		);

		var movable = new Movable
		(
			0.5, // accelerationPerTick
			function accelerate(universe, world, place, entityMovable)
			{
				var accelerationToApply = entityMovable.movable.accelerationPerTick;
				var equipmentUser = entityMovable.equipmentUser;
				var accessoryEquipped =
					equipmentUser.itemEntityInSocketWithName("Accessory");
				var isSpeedBoosterEquipped =
				(
					accessoryEquipped != null
					&& accessoryEquipped.item.defnName == "Speed Booster"
				);
				if (isSpeedBoosterEquipped)
				{
					accelerationToApply *= 2;
				}
				entityMovable.movable.accelerateForward
				(
					universe, world, place, entityMovable, accelerationToApply
				);
			}
		);

		var itemCrafter = new ItemCrafter
		([
			new CraftingRecipe
			(
				"Enhanced Armor",
				[
					new Item("Armor", 1),
					new Item("Material", 1),
					new Item("Toolset", 1)
				],
				[
					new Entity
					(
						"", // name
						[
							new Item("Enhanced Armor", 1),
							new Armor(.3)
						]
					),
					new Entity
					(
						"", // name
						[
							new Item("Toolset", 1)
						]
					)
				]
			)
		]);

		var playerEntity = new Entity
		(
			"Player",
			[
				new Locatable(playerLoc),
				constrainable,
				new Collidable
				(
					playerCollider,
					[ Collidable.name ], // entityPropertyNamesToCollideWith
					playerCollide
				),
				new Drawable(playerVisual),
				equipmentUser,
				new Idleable(),
				itemCrafter,
				new ItemHolder(),
				killable,
				movable,
				new Playable(),
			]
		);

		entities.push(playerEntity);

		return playerEntity;
	};

	PlaceBuilderDemo.prototype.entityBuildStore = function
	(
		entities, entityDimension, entitySize, itemDefns
	)
	{
		var storePos = new Coords().randomize(this.randomizer).multiplyScalar(.5).multiply
		(
			this.size
		);
		var storeLoc = new Location(storePos);
		var storeColor = "Brown";
		var storeEntity = new Entity
		(
			"Store",
			[
				new Collidable(new Box(new Coords(0, 0), entitySize)),
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
				new ItemStore(itemDefns["Coin"].name),
				new ItemHolder
				(
					[
						new Item(itemDefns["Coin"].name, 100),
						new Item(itemDefns["Key"].name, 10),
						new Item(itemDefns["Medicine"].name, 100),
						new Item(itemDefns["Weapon"].name, 1)
					].map
					(
						x => new Entity(x.defnName, [ x ])
					)
				),
				new Locatable(storeLoc)
			]
		);

		entities.push(storeEntity);

		return storeEntity;
	};

	PlaceBuilderDemo.prototype.entityBuildToolset = function(entities, entityDimension, playerPos, itemDefns)
	{
		entityDimension = entityDimension;

		var itemDefnName = itemDefns["Toolset"].name;

		var itemToolsetColor = "Gray";
		var itemToolsetVisual = new VisualGroup
		([
			new VisualOffset
			(
				new VisualRectangle
				(
					new Coords(entityDimension / 4, entityDimension), "Brown"
				),
				new Coords(0, entityDimension / 2)
			),
			new VisualRectangle
			(
				new Coords(entityDimension, entityDimension / 2), itemToolsetColor
			),
			new VisualOffset
			(
				new VisualText(itemDefnName, itemToolsetColor),
				new Coords(0, entityDimension)
			)
		]);

		var itemToolsetPos = playerPos.clone().double().double();
		var itemToolsetCollider = new Sphere(new Coords(0, 0), entityDimension / 2);

		var itemToolsetEntity = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				new Locatable( new Location(itemToolsetPos) ),
				new Collidable(itemToolsetCollider),
				new Drawable(itemToolsetVisual),
			]
		);

		entities.push(itemToolsetEntity);
	};

	PlaceBuilderDemo.prototype.entityBuildWeapon = function(entities, entityDimension, playerPos, itemDefns)
	{
		entityDimension = entityDimension * 2;

		var itemWeaponColor = "rgb(0, 128, 128)";
		var itemWeaponVisual = new VisualGroup
		([
			new VisualPath
			(
				new Path
				([
					new Coords(-0.3, 0.2),
					new Coords(-0.3, -0.2),
					new Coords(0.3, -0.2)
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				itemWeaponColor,
				5 // lineThickness
			),
			new VisualOffset
			(
				new VisualText(itemDefns["Weapon"].name, itemWeaponColor),
				new Coords(0, entityDimension)
			)
		]);

		var itemWeaponPos = playerPos.clone().double();
		var itemWeaponCollider = new Sphere(new Coords(0, 0), entityDimension / 2);

		var itemWeaponDevice = Device.gun();

		var itemWeaponEntity = new Entity
		(
			itemDefns["Weapon"].name,
			[
				new Item(itemDefns["Weapon"].name, 1),
				new Locatable( new Location(itemWeaponPos) ),
				new Collidable(itemWeaponCollider),
				new Drawable(itemWeaponVisual),
				itemWeaponDevice
			]
		);

		entities.push(itemWeaponEntity);
	};

	PlaceBuilderDemo.prototype.entityBuildWeaponAmmo = function(entities, entityDimension, size, itemDefns, numberOfPiles, roundsPerPile)
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemAmmoColor = "rgb(0, 128, 128)";
		var path = new Path
		([
			new Coords(0, -0.5),
			new Coords(.5, 0.5),
			new Coords(-.5, 0.5)
		]).transform
		(
			Transform_Scale.fromScalar(entityDimension)
		);
		var ammoSize = new Box().ofPoints(path.points).size;

		var itemDefnAmmoName = itemDefns["Ammo"].name;
		var itemAmmoVisual = new VisualGroup
		([
			new VisualPolygon
			(
				path,
				itemAmmoColor
			),
			new VisualOffset
			(
				new VisualText(itemDefnAmmoName, itemAmmoColor),
				new Coords(0, entityDimension)
			)
		]);

		var itemAmmoCollider = new Sphere(new Coords(0, 0), entityDimensionHalf);

		for (var i = 0; i < numberOfPiles; i++)
		{
			var pos = new Coords().randomize(this.randomizer).multiply(size);

			var collidable = new Collidable(itemAmmoCollider);
			var bounds = new Box(collidable.collider.center, ammoSize);
			var boundable = new Boundable(bounds);

			var itemAmmoEntity = new Entity
			(
				itemDefnAmmoName + i,
				[
					boundable,
					collidable,
					new Drawable(itemAmmoVisual),
					new Item(itemDefnAmmoName, roundsPerPile),
					new Locatable( new Location( pos ) ),
				]
			);

			entities.push(itemAmmoEntity);
		}
	};

	PlaceBuilderDemo.prototype.entityControlsBuild = function(playerEntity, itemDefns)
	{
		var controlStatus = new ControlLabel
		(
			"infoStatus",
			new Coords(8, 5), //pos,
			new Coords(100, 0), //size,
			false, // isTextCentered,
			new DataBinding
			(
				playerEntity,
				function get(c)
				{
					var itemHolder = c.itemHolder;
					var statusText = "H:" + c.killable.integrity
						+ "   A:" + itemHolder.itemQuantityByDefnName(itemDefns["Ammo"].name)
						+ "   K:" + itemHolder.itemQuantityByDefnName(itemDefns["Key"].name)
						+ "   $:" + itemHolder.itemQuantityByDefnName(itemDefns["Coin"].name);
					return statusText;
				}
			), // text,
			10 // fontHeightInPixels
		);

		var visualControl = new VisualControl(controlStatus);
		var entityControls = new Entity("Controls", [ new Drawable(visualControl) ]);
		return entityControls;
	};
}
