
class PlaceBuilderDemo
{
	build
	(
		namePrefix, size, cameraViewSize, placeNameToReturnTo, randomizer,
		itemDefns, placePos, areNeighborsConnectedESWN, isGoal
	)
	{
		var name = namePrefix + (placePos == null ? "" : placePos.toStringXY());
		this.size = size.clearZ();
		this.randomizer = randomizer || RandomizerLCG.default();

		var entities = [];

		var entityDimension = 10;

		var entityDefns = this.entityDefnsBuild();

		var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);

		var wallThickness = this.entityBuildObstacleWalls
		(
			entities, "Red", areNeighborsConnectedESWN, namePrefix, placePos
		);

		var marginThickness = wallThickness * 8;
		var marginSize = new Coords(1, 1, 0).multiplyScalar(marginThickness);
		this.marginSize = marginSize;

		if (placeNameToReturnTo != null)
		{
			entities.push(this.entityBuildFromDefn(entityDefns["Player"]));

			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Book"], 1));

			var exit = this.entityBuildFromDefn(entityDefns["Exit"]);
			exit.portal.destinationPlaceName = placeNameToReturnTo;
			exit.portal.destinationEntityName = "Base";
			entities.push(exit);

			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Friendly"], 1));
		}
		else
		{
			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["EnemyGenerator"], 1));
			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Bar"], 1));
			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Mine"], 48));

			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Armor"], 1));
			//entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Coin"], 10));
			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Crystal"], 3));
			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Flower"], 3));
			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Material"], 5));
			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Medicine"], 5));
			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Mushroom"], 3));
			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Speed Booster"], 1));
			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Toolset"], 1));
			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Weapon"], 1));
			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Ammo"], 10));
			entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Container"], 1));
			
			var shouldIncludeBase = (placePos.x == 0 && placePos.y == 0);
			if (shouldIncludeBase)
			{
				entities.push(this.entityBuildFromDefn(entityDefns["Base"]));
			}
			entities.push(this.entityBuildFromDefn(entityDefns["Store"]));

			if (isGoal)
			{
				var numberOfKeysToUnlockGoal = 5;
				var goalEntity = this.entityBuildGoal
				(
					entities, entityDimension, entitySize, numberOfKeysToUnlockGoal
				);
				var entityRing = this.entityBuildFromDefn(entityDefns["Ring"]);
				var ringLoc = entityRing.locatable.loc;
				ringLoc.pos.overwriteWith(goalEntity.locatable.loc.pos);
				ringLoc.spin.angleInTurnsRef.value = .001;

				entities.push(entityRing);
			}
		}

		entities.forEach(x => { if (x.locatable != null) { x.locatable.loc.pos.z = 0; } })

		var cameraEntity = this.entityBuildCamera(cameraViewSize);
		entities.push(cameraEntity);
		var camera = cameraEntity.camera;
		entities.splice(0, 0, ...this.entityBuildBackground(camera));

		//this.entitiesAllAddCameraProjection(entities);

		var place = new Place(name, "Demo", size, entities);
		return place;
	};

	// Constructor helpers.

	entityBuildCamera(cameraViewSize)
	{
		var viewSizeHalf = cameraViewSize.clone().half();

		var cameraHeightAbovePlayfield = cameraViewSize.x;
		var cameraZ = 0 - cameraHeightAbovePlayfield;

		var cameraPosBox = new Box().fromMinAndMax
		(
			viewSizeHalf.clone().zSet(cameraZ),
			this.size.clone().subtract(viewSizeHalf).zSet(cameraZ)
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
			cameraHeightAbovePlayfield, // focalLength
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

	entityBuildBackground(camera)
	{
		var returnValues = [];

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
				new Drawable(visualBackgroundBottom),
				new DrawableCamera()
			]
		);
		returnValues.push(entityBackgroundBottom);

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
				new Drawable(visualBackgroundTop),
				new DrawableCamera()
			]
		);
		returnValues.push(entityBackgroundTop);

		return returnValues;
	};

	entitiesBuildFromDefnAndCount
	(
		entityDefn, entityCount
	)
	{
		var returnEntities = [];

		for (var i = 0; i < entityCount; i++)
		{
			var entity = this.entityBuildFromDefn(entityDefn);
			returnEntities.push(entity);
		}

		return returnEntities;
	};

	entityBuildFromDefn(entityDefn)
	{
		var entity = entityDefn.clone();
		if (entity.locatable != null)
		{
			var sizeMinusMargins =
				this.size.clone().subtract(this.marginSize).subtract(this.marginSize);

			entity.locatable.loc.pos.randomize
			(
				this.randomizer
			).multiply
			(
				sizeMinusMargins
			).add
			(
				this.marginSize
			);
		}

		return entity;
	};

	entityBuildGoal
	(
		entities, entityDimension, entitySize, numberOfKeysToUnlockGoal
	)
	{
		var itemKeyColor = "Yellow";
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
				new DrawableCamera(),
				new Goal(numberOfKeysToUnlockGoal),
			]
		);

		entities.push(goalEntity);

		return goalEntity;
	};

	entityBuildKeys
	(
		places, entityDimension, numberOfKeysToUnlockGoal, marginSize
	)
	{
		var entityDimensionHalf = entityDimension / 2;
		var sizeMinusMargins = marginSize.clone().double().invert().add(this.size);

		var itemDefnKeyName = "Key";
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

		for (var i = 0; i < numberOfKeysToUnlockGoal; i++)
		{
			var itemKeyPos =
				new Coords().randomize(this.randomizer).multiply(sizeMinusMargins).add(marginSize);

			var itemKeyCollider = new Sphere(new Coords(0, 0), entityDimensionHalf);

			var itemKeyEntity = new Entity
			(
				itemDefnKeyName + i,
				[
					new Item(itemDefnKeyName, 1),
					new Locatable( new Location(itemKeyPos) ),
					new Collidable(itemKeyCollider),
					new Drawable(itemKeyVisual),
					new DrawableCamera()
				]
			);

			var place = places.random(this.randomizer);

			place.entitiesToSpawn.push(itemKeyEntity);
		}
	};

	entityBuildObstacleWalls
	(
		entities, wallColor, areNeighborsConnectedESWN, placeNamePrefix, placePos
	)
	{
		var numberOfWalls = 4;
		var wallThickness = 5;
		var doorwayWidthHalf = wallThickness * 4;
		var portalSize = new Coords(1, 1).multiplyScalar(2 * doorwayWidthHalf);

		var neighborOffsets =
		[
			new Coords(1, 0), new Coords(0, 1), new Coords(-1, 0), new Coords(0, -1)
		];

		for (var i = 0; i < numberOfWalls; i++)
		{
			var wallSize;
			var isNorthOrSouthWall = (i % 2 == 1);
			if (isNorthOrSouthWall)
			{
				wallSize = new Coords(this.size.x, wallThickness, 1);
			}
			else
			{
				wallSize = new Coords(wallThickness, this.size.y, 1);
			}

			var wallPos = wallSize.clone().half().clearZ();
			var isEastOrSouthWall = (i < 2);
			if (isEastOrSouthWall)
			{
				wallPos.invert().add(this.size);
			}

			var isNeighborConnected = areNeighborsConnectedESWN[i];

			if (isNeighborConnected)
			{
				if (isNorthOrSouthWall)
				{
					wallSize.x = wallSize.x / 2 - doorwayWidthHalf;
				}
				else
				{
					wallSize.y = wallSize.y / 2 - doorwayWidthHalf;
				}
			}

			var wallCollider = new Box(new Coords(0, 0), wallSize);
			var wallVisual = new VisualRectangle(wallSize, wallColor);

			var numberOfWallPartsOnSide = (isNeighborConnected ? 2 : 1);
			for (var d = 0; d < numberOfWallPartsOnSide; d++)
			{
				var wallPartPos = wallPos.clone();
				if (isNeighborConnected)
				{
					if (isNorthOrSouthWall)
					{
						wallPartPos.x = wallSize.x / 2;
						if (d == 1)
						{
							wallPartPos.x *= -1;
							wallPartPos.x += this.size.x;
						}
					}
					else
					{
						wallPartPos.y = wallSize.y / 2;
						if (d == 1)
						{
							wallPartPos.y *= -1;
							wallPartPos.y += this.size.y;
						}
					}
				}

				var wallPartLoc = new Location(wallPartPos);

				var wallEntity = new Entity
				(
					"ObstacleWall" + i + "_" + d,
					[
						new Locatable(wallPartLoc),
						new Collidable(wallCollider),
						new Damager(10),
						new Drawable(wallVisual),
						new DrawableCamera()
					]
				);

				entities.push(wallEntity);
			}

			if (isNeighborConnected)
			{
				var portalPos = wallPos.clone();
				var neighborOffset = neighborOffsets[i];
				portalPos.add(neighborOffset.clone().multiply(portalSize));
				var neighborPos = placePos.clone().add(neighborOffset);
				var neighborName = placeNamePrefix + neighborPos.toStringXY();

				var portalEntity = new Entity
				(
					"PortalToNeighbor" + i,
					[
						new Collidable(new Box(new Coords(0, 0), portalSize)),
						new Locatable(new Location(portalPos)),
						new Portal(neighborName, "PortalToNeighbor" + ((i + 2) % 4), false),
						new Drawable(new VisualRectangle(portalSize, "Violet")),
						new DrawableCamera()
					]
				);

				entities.push(portalEntity);
			}

		}

		return wallThickness;
	};

	entityDefnBuildStore(entityDimension)
	{
		var storeColor = "Brown";
		var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);
		var storeEntityDefn = new Entity
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
				new DrawableCamera(),
				new ItemStore("Coin"),
				ItemHolder.fromItems
				([
					new Item("Coin", 100),
					new Item("Key", 10),
					new Item("Medicine", 100),
					new Item("Weapon", 1)
				]),
				new Locatable()
			]
		);

		return storeEntityDefn;
	};

	// Entity definitions.

	entityDefnBuildAccessory(entityDimension)
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnAccessoryName = "Speed Booster";
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

		var itemAccessoryEntityDefn = new Entity
		(
			itemDefnAccessoryName,
			[
				new Item(itemDefnAccessoryName, 1),
				new Locatable(),
				new Collidable(itemAccessoryCollider),
				new Drawable(itemAccessoryVisual),
				new DrawableCamera()
			]
		);

		return itemAccessoryEntityDefn;
	};

	entityDefnBuildArmor(entityDimension)
	{
		var itemDefnArmorName = "Armor";
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
		var itemArmorCollider = new Sphere(new Coords(0, 0), entityDimension / 2);
		var collidable = new Collidable(itemArmorCollider);
		var box = new Box().ofPoints(path.points);
		box.center = collidable.collider.center;
		var boundable = new Boundable(box);

		var itemArmorEntityDefn = new Entity
		(
			itemDefnArmorName,
			[
				new Armor(.5),
				boundable,
				collidable,
				new Item(itemDefnArmorName, 1),
				new Locatable( new Location( new Coords() ) ),
				new Drawable(itemArmorVisual),
				new DrawableCamera()
			]
		);

		return itemArmorEntityDefn;
	};

	entityDefnBuildBase(entityDimension)
	{
		var baseColor = "Brown";

		var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);

		var visual = new VisualGroup
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
		]);

		var baseEntityDefn = new Entity
		(
			"Base",
			[
				new Collidable(new Box(new Coords(0, 0), entitySize)),
				new Drawable(visual),
				new DrawableCamera(),
				new Locatable(),
				new Portal( "Base", "Exit" )
			]
		);

		return baseEntityDefn;
	};

	entityDefnBuildBook(entityDimension)
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnBookName = "Book";
		var itemBookColor = "Blue";
		var itemBookVisual = new VisualGroup
		([
			new VisualRectangle
			(
				new Coords(1, 1.25).multiplyScalar(entityDimension), itemBookColor
			),
			new VisualOffset
			(
				new VisualRectangle
				(
					new Coords(.1, 1.1).multiplyScalar(entityDimension), "White"
				),
				new Coords(.4, 0).multiplyScalar(entityDimension)
			),
			new VisualOffset
			(
				new VisualText(itemDefnBookName, itemBookColor),
				new Coords(0, entityDimension)
			)
		]);
		var itemBookCollider = new Sphere(new Coords(0, 0), entityDimensionHalf);

		var itemBookEntityDefn = new Entity
		(
			itemDefnBookName,
			[
				new Item(itemDefnBookName, 1),
				new Locatable(),
				new Collidable(itemBookCollider),
				new Drawable(itemBookVisual),
				new DrawableCamera()
			]
		);

		return itemBookEntityDefn;
	}

	entityDefnBuildCoin(entityDimension)
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnCoinName = "Coin";
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

		var itemCoinEntityDefn = new Entity
		(
			itemDefnCoinName,
			[
				new Item(itemDefnCoinName, 1),
				new Locatable( new Location(new Coords()) ),
				new Collidable(itemCoinCollider),
				new Drawable(itemCoinVisual),
				new DrawableCamera()
			]
		);

		return itemCoinEntityDefn;
	};

	entityDefnBuildContainer(entityDimension, entitySize)
	{
		var containerColor = "Orange";
		var visual = new VisualGroup
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
		]);

		var containerEntityDefn = new Entity
		(
			"Container",
			[
				new Collidable(new Box(new Coords(0, 0), entitySize)),
				new Drawable(visual),
				new DrawableCamera(),
				new ItemContainer(),
				new ItemHolder(),
				new Locatable()
			]
		);

		return containerEntityDefn;
	};

	entityDefnBuildCrystal(entityDimension)
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnCrystalName = "Crystal";
		var itemCrystalColor = "Cyan";
		var itemCrystalVisual = new VisualGroup
		([
			new VisualPolygon
			(
				new Path
				([
					new Coords(1, 0), new Coords(0, 1), new Coords(-1, 0), new Coords(0, -1)
				]).transform
				(
					new Transform_Scale
					(
						new Coords(1, 1, 1).multiplyScalar(entityDimension / 2)
					)
				),
				itemCrystalColor,
				"White"
			),
			new VisualPolygon
			(
				new Path
				([
					new Coords(1, 0), new Coords(0, 1), new Coords(-1, 0), new Coords(0, -1)
				]).transform
				(
					new Transform_Scale
					(
						new Coords(1, 1, 1).multiplyScalar(entityDimension / 4)
					)
				),
				"White"
			),
			new VisualOffset
			(
				new VisualText(itemDefnCrystalName, itemCrystalColor),
				new Coords(0, entityDimension)
			)
		]);
		var itemCrystalCollider = new Sphere(new Coords(0, 0), entityDimensionHalf);

		var itemCrystalEntityDefn = new Entity
		(
			itemDefnCrystalName,
			[
				new Collidable(itemCrystalCollider),
				new Drawable(itemCrystalVisual),
				new DrawableCamera(),
				new Item(itemDefnCrystalName, 1),
				new Locatable( new Location(new Coords()) )
			]
		);

		return itemCrystalEntityDefn;
	};

	entityDefnBuildExit(entityDimension)
	{
		var exitColor = "Brown";
		var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);

		var visual = new VisualGroup
		([
			new VisualPolygon
			(
				new Path
				([
					new Coords(0.5, 0.75),
					new Coords(-0.5, 0.75),
					new Coords(-0.5, -0.75),
					new Coords(0.5, -0.75)
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				exitColor
			),
			new VisualOffset
			(
				new VisualCircle(entityDimension / 8, "Yellow"),
				new Coords(entityDimension / 4, 0)
			),
			new VisualOffset
			(
				new VisualText("Exit", exitColor),
				new Coords(0, entityDimension)
			)
		]);

		var exitEntityDefn = new Entity
		(
			"Exit",
			[
				new Collidable(new Box(new Coords(0, 0), entitySize)),
				new Drawable(visual),
				new DrawableCamera(),
				new Locatable(),
				new Portal() // Must be set ouside this method.
			]
		);

		return exitEntityDefn;
	};

	entityDefnBuildEnemyGenerator(entityDimension)
	{
		var enemyColor = "Red";
		var visualEyeRadius = entityDimension * .75 / 2;
		var visualBuilder = new VisualBuilder();
		var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);

		var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);

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

		var enemyActivity = function(universe, world, place, actor, entityToTargetName)
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
			).normalize().multiplyScalar(.1).clearZ();

			actorLoc.orientation.forwardSet(actorLoc.accel.clone().normalize());
		};

		var enemyKillable = new Killable
		(
			10,
			null, // damageApply
			function die(universe, world, place, entityDying)
			{
				var chanceOfDroppingCoin = 1;
				var doesDropCoin = (Math.random() < chanceOfDroppingCoin);
				if (doesDropCoin)
				{
					var entityDefns = world.defns.entitys;
					var entityDefnCoin = entityDefns["Coin"];
					var entityCoin = entityDefnCoin.clone();
					entityCoin.locatable = entityDying.locatable.clone();
					entityCoin.locatable.loc.vel.clear();
					place.entitySpawn(universe, world, entityCoin);
				}

				var entityPlayer = place.player();
				var learner = entityPlayer.skillLearner;
				var learningMessage =
					learner.learningIncrement(world.defns.skills, 1);
				if (learningMessage != null)
				{
					place.entitySpawn
					(
						universe, world,
						universe.entityBuilder.messageFloater
						(
							learningMessage, entityPlayer.locatable.loc.pos
						)
					);
				}
			}
		);


		var enemyEntityPrototype = new Entity
		(
			"Enemy",
			[
				new Actor(enemyActivity, "Player"),
				new Constrainable([constraintSpeedMax1]),
				new Collidable(enemyCollider),
				new Damager(10),
				new Drawable(enemyVisual),
				new DrawableCamera(),
				new Enemy(),
				enemyKillable,
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

		var enemyGeneratorEntityDefn = new Entity
		(
			"EnemyGenerator",
			[
				new Actor(generatorActivity)
			]
		);

		return enemyGeneratorEntityDefn;
	};

	entityDefnBuildFlower(entityDimension)
	{
		entityDimension *= .5;
		var itemDefnName = "Flower";
		var color = "Pink";
		var visual = new VisualGroup
		([
			new VisualPolygon
			(
				new Path
				([
					new Coords(1, 0),
					new Coords(.3, .3),
					new Coords(0, 1),
					new Coords(-.3, .3),
					new Coords(-1, 0),
					new Coords(-.3, -.3),
					new Coords(0, -1),
					new Coords(.3, -.3)
				]).transform
				(
					new Transform_Scale
					(
						new Coords(1, 1, 1).multiplyScalar(entityDimension)
					)
				),
				color,
				"Red"
			),
			new VisualOffset
			(
				new VisualText(itemDefnName, color),
				new Coords(0, entityDimension)
			)
		]);
		var collider = new Sphere(new Coords(0, 0), entityDimension);

		var entityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				new Locatable( new Location(new Coords()) ),
				new Collidable(collider),
				new Drawable(visual),
				new DrawableCamera()
			]
		);

		return entityDefn;
	};

	entityDefnBuildFriendly(entityDimension)
	{
		var friendlyColor = "Green";
		var friendlyDimension = entityDimension;

		var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);

		var friendlyCollider = new Sphere(new Coords(0, 0), friendlyDimension);

		var visualEyeRadius = entityDimension * .75 / 2;
		var visualBuilder = new VisualBuilder();
		var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);

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

		var friendlyEntityDefn = new Entity
		(
			"Friendly",
			[
				new Locatable(),
				new Constrainable([constraintSpeedMax1]),
				new Collidable(friendlyCollider),
				new Drawable(friendlyVisual),
				new DrawableCamera(),
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
				ItemHolder.fromItems
				([
					new Item("Ammo", 5),
					new Item("Coin", 200),
					new Item("Key", 1),
					new Item("Material", 3),
					new Item("Medicine", 4),
					new Item("Weapon", 1),
				]),
			]
		);

		return friendlyEntityDefn;
	};

	entityDefnBuildMaterial(entityDimension)
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnMaterialName = "Material";
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

		var itemMaterialEntityDefn = new Entity
		(
			itemDefnMaterialName,
			[
				new Item(itemDefnMaterialName, 1),
				new Locatable( new Location(new Coords()) ),
				new Collidable(itemMaterialCollider),
				new Drawable(itemMaterialVisual),
				new DrawableCamera()
			]
		);

		return itemMaterialEntityDefn;
	};

	entityDefnBuildMedicine(entityDimension)
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnMedicineName = "Medicine";
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

		var itemMedicineEntityDefn = new Entity
		(
			itemDefnMedicineName,
			[
				new Item(itemDefnMedicineName, 1),
				new Locatable( new Location(new Coords()) ),
				new Collidable(itemMedicineCollider),
				new Drawable(itemMedicineVisual),
				new DrawableCamera()
			]
		);

		return itemMedicineEntityDefn;
	};

	entityDefnBuildMushroom(entityDimension)
	{
		entityDimension /= 2;
		var itemDefnName = "Mushroom";

		var colorStem = "Gray";
		var colorCap = "Purple";
		var itemMushroomVisual = new VisualGroup
		([
			new VisualOffset
			(
				new VisualArc
				(
					entityDimension, // radiusOuter
					0, // radiusInner
					new Coords(-1, 0), // directionMin
					.5, // angleSpannedInTurns
					colorCap
				),
				new Coords(0, 0)
			),
			new VisualOffset
			(
				new VisualRectangle
				(
					new Coords(entityDimension / 2, entityDimension), colorStem
				),
				new Coords(0, entityDimension / 2)
			),
			new VisualOffset
			(
				new VisualText(itemDefnName, colorCap),
				new Coords(0, entityDimension)
			)
		]);

		var itemMushroomCollider = new Sphere(new Coords(0, 0), entityDimension / 2);

		var itemMushroomEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				new Locatable( new Location(new Coords()) ),
				new Collidable(itemMushroomCollider),
				new Drawable(itemMushroomVisual),
				new DrawableCamera()
			]
		);

		return itemMushroomEntityDefn;
	};

	entityDefnBuildObstacleBar(entityDimension)
	{
		var obstacleColor = "Red";
		var entityDimensionHalf = entityDimension / 2;

		var obstacleBarSize = new Coords(6, 2, 1).multiplyScalar(entityDimension);
		var obstacleRotationInTurns = .0625;
		var obstacleCollider = new BoxRotated
		(
			new Box(new Coords(0, 0, 0), obstacleBarSize), obstacleRotationInTurns
		);
		var obstacleCollidable = new Collidable(obstacleCollider);
		var obstacleBounds = obstacleCollidable.collider.sphereSwept();
		var obstacleBoundable = new Boundable(obstacleBounds);

		var visual = new VisualRotate
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
		);

		var obstacleBarEntityDefn = new Entity
		(
			"Bar",
			[
				obstacleBoundable,
				obstacleCollidable,
				new Damager(10),
				new Drawable(visual),
				new DrawableCamera(),
				new Locatable()
			]
		);

		return obstacleBarEntityDefn;
	};

	entityDefnBuildObstacleMine(entityDimension)
	{
		var obstacleColor = "Red";
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
			"Mine",
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

		var obstacleCollidable = new Collidable
		(
			new MapLocated(obstacleMappedMap, new Location(new Coords(0, 0, 0)))
		);
		var obstacleBounds = new Box(obstacleCollidable.collider.loc.pos, obstacleMappedMap.size);
		var obstacleBoundable = new Boundable(obstacleBounds);

		var obstacleMappedEntityDefn = new Entity
		(
			"Mine",
			[
				obstacleBoundable,
				obstacleCollidable,
				new Damager(10),
				new Drawable(obstacleMappedVisual),
				new DrawableCamera(),
				new Locatable(new Location(new Coords()))
			]
		);

		return obstacleMappedEntityDefn;
	};

	entityDefnBuildObstacleRing(entityDimension)
	{
		var obstacleColor = "Red";
		var obstacleRadiusOuter = entityDimension * 3.5;
		var obstacleRadiusInner = obstacleRadiusOuter - entityDimension;
		var obstacleAngleSpannedInTurns = .85;
		var obstacleLoc = new Location();
		var obstacleCollider = new Arc
		(
			new Shell
			(
				new Sphere(new Coords(0, 0), obstacleRadiusOuter), // sphereOuter
				obstacleRadiusInner
			),
			new Wedge
			(
				new Coords(0, 0), // vertex
				obstacleLoc.orientation.forward, //new Coords(1, 0, 0), // directionMin
				obstacleAngleSpannedInTurns
			)
		);

		var obstacleRingVisual = new VisualArc
		(
			obstacleRadiusOuter,
			obstacleRadiusInner,
			new Coords(1, 0, 0), // directionMin
			obstacleAngleSpannedInTurns,
			obstacleColor
		);

		var obstacleRingEntityDefn = new Entity
		(
			"Ring",
			[
				new Locatable(obstacleLoc),
				new Collidable(obstacleCollider),
				new Damager(10),
				new Drawable(obstacleRingVisual),
				new DrawableCamera()
			]
		);

		return obstacleRingEntityDefn;
	};

	entityDefnBuildPlayer(entityDimension)
	{
		var visualEyeRadius = entityDimension * .75 / 2;
		var visualBuilder = new VisualBuilder();
		var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);

		var playerHeadRadius = entityDimension * .75;
		var playerCollider = new Sphere(new Coords(0, 0), playerHeadRadius);
		var playerColor = "Gray";

		var playerVisualBodyNormal = visualBuilder.circleWithEyes
		(
			playerHeadRadius, playerColor, visualEyeRadius, visualEyesBlinking
		);
		var playerVisualBodyHidden = visualBuilder.circleWithEyes
		(
			playerHeadRadius, "Black", visualEyeRadius, visualEyesBlinking
		);
		var playerVisualBodyHidable = new VisualSelect
		(
			function selectChildName(u, w, display, e)
			{
				return (e.playable.isHiding ? "Hidden" : "Normal");
			},
			[ "Normal", "Hidden" ],
			[ playerVisualBodyNormal, playerVisualBodyHidden ]
		);
		var playerVisualBodyJumpable = new VisualJump2D
		(
			playerVisualBodyHidable,
			new VisualEllipse(playerHeadRadius, playerHeadRadius / 2, 0, "DarkGray", "Black")
		);
		var playerVisualName = new VisualOffset
		(
			new VisualText("Player", playerColor),
			new Coords(0, playerHeadRadius * 2)
		);

		var playerVisual = new VisualGroup
		([
			playerVisualBodyJumpable, playerVisualName
		]);

		var playerCollide = function(universe, world, place, entityPlayer, entityOther)
		{
			var messageToDisplay = null;

			if (entityOther.damager != null)
			{
				universe.collisionHelper.collideCollidables(entityPlayer, entityOther);

				var damage = entityPlayer.killable.damageApply(universe, world, place, entityOther, entityPlayer);

				var messageEntity = universe.entityBuilder.messageFloater
				(
					"-" + damage,
					entityPlayer.locatable.loc.pos
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
				var itemDefnKeyName = "Key";
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
						universe.display.sizeDefault().clone(),//.half(),
						true // showMessageOnly
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
				var messageBoxSize = universe.display.sizeDefault();
				var venueMessage = new VenueMessage
				(
					"Portal to: " + portal.destinationPlaceName,
					function acknowledge(universe)
					{
						portal.use
						(
							universe, universe.world, universe.world.placeCurrent, entityPlayer
						);
						universe.venueNext = new VenueFader(venueCurrent);
					},
					venueCurrent, // venuePrev
					messageBoxSize,
					true // showMessageOnly
				);
				universe.venueNext = venueMessage;
			}
			else if (entityOther.talker != null)
			{
				entityOther.collidable.ticksUntilCanCollide = 100;
				//entityOther.drawable.animationRuns["Friendly"].ticksSinceStarted = 0;

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
					},
					entityPlayer,
					entityOther // entityTalker
				);
				var conversationSize = universe.display.sizeDefault().clone();
				var conversationAsControl =
					conversation.toControl(conversationSize, universe);

				var venueNext = new VenueControls(conversationAsControl);

				universe.venueNext = venueNext;
			}
		};

		var constrainable = new Constrainable
		([
			new Constraint_Gravity(new Coords(0, 0, 1)),
			new Constraint_ContainInHemispace(new Hemispace(new Plane(new Coords(0, 0, 1), 0))),
			new Constraint_SpeedMaxXY(5),
			new Constraint_Conditional
			(
				(u, w, p, entity) => ( entity.locatable.loc.pos.z >= 0 ),
				new Constraint_FrictionXY(.03)
			),
		]);

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
					universe.display.sizeDefault().clone(),//.half(),
					true // showMessageOnly
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
			),
			new CraftingRecipe
			(
				"Potion",
				[
					new Item("Crystal", 1),
					new Item("Flower", 1),
					new Item("Mushroom", 1)
				],
				[
					new Entity
					(
						"Potion", // name
						[
							new Item("Potion", 1),
						]
					)
				]
			)
		]);

		var controllable = new Controllable
		(
			function toControl(universe, size, entity, venuePrev)
			{
				var itemHolderAsControl = entity.itemHolder.toControl
				(
					universe, size, entity, venuePrev, false // includeTitle
				);

				var equipmentUserAsControl = entity.equipmentUser.toControl
				(
					universe, size, entity, venuePrev, false // includeTitle
				);

				var crafterAsControl = entity.itemCrafter.toControl
				(
					universe, size, entity, venuePrev, false // includeTitle
				);

				var skillLearnerAsControl = entity.skillLearner.toControl
				(
					universe, size, entity, venuePrev, false // includeTitle
				);

				var returnValue = new ControlTabbed
				(
					"tabbedItems",
					new Coords(0, 0), // pos
					size,
					[
						itemHolderAsControl,
						equipmentUserAsControl,
						crafterAsControl,
						skillLearnerAsControl
					]
				);
				return returnValue;
			}
		);

		var playerEntityDefn = new Entity
		(
			"Player",
			[
				new Locatable(),
				new Collidable
				(
					playerCollider,
					[ Collidable.name ], // entityPropertyNamesToCollideWith
					playerCollide
				),
				constrainable,
				controllable,
				new Drawable(playerVisual),
				new DrawableCamera(),
				equipmentUser,
				new Idleable(),
				itemCrafter,
				ItemHolder.fromItems
				([
					new Item("Coin", 100),
				]),
				killable,
				movable,
				new Playable(),
				new SkillLearner()
			]
		);

		var controlStatus = new ControlLabel
		(
			"infoStatus",
			new Coords(8, 5), //pos,
			new Coords(150, 0), //size,
			false, // isTextCentered,
			new DataBinding
			(
				playerEntityDefn,
				function get(c)
				{
					var player = c;
					var itemHolder = player.itemHolder;
					var statusText = "H:" + player.killable.integrity
						+ "   A:" + itemHolder.itemQuantityByDefnName("Ammo")
						+ "   K:" + itemHolder.itemQuantityByDefnName("Key")
						+ "   $:" + itemHolder.itemQuantityByDefnName("Coin")
						+ "   X:" + player.skillLearner.learningAccumulated;
					return statusText;
				}
			), // text,
			10 // fontHeightInPixels
		);
		var playerVisualStatus = new VisualControl(controlStatus);
		playerVisual.children.push(playerVisualStatus);

		return playerEntityDefn;
	};

	entityDefnBuildPotion(entityDimension)
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnPotionName = "Potion";
		var itemPotionColor = "Blue";
		var itemPotionVisual = new VisualGroup
		([
			new VisualPolygon
			(
				new Path
				([
					new Coords(1, 1),
					new Coords(-1, 1),
					new Coords(-.2, 0),
					new Coords(-.2, -.5),
					new Coords(.2, -.5),
					new Coords(.2, 0)
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				itemPotionColor,
				"White"
			),
			new VisualOffset
			(
				new VisualText(itemDefnPotionName, itemPotionColor),
				new Coords(0, entityDimension)
			)
		]);
		var itemPotionCollider = new Sphere(new Coords(0, 0), entityDimensionHalf);

		var itemPotionEntityDefn = new Entity
		(
			itemDefnPotionName,
			[
				new Item(itemDefnPotionName, 1),
				new Locatable( new Location(new Coords()) ),
				new Collidable(itemPotionCollider),
				new Drawable(itemPotionVisual),
				new DrawableCamera()
			]
		);

		return itemPotionEntityDefn;
	};

	entityDefnBuildToolset(entityDimension)
	{
		var itemDefnName = "Toolset";

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

		var itemToolsetCollider = new Sphere(new Coords(0, 0), entityDimension / 2);

		var itemToolsetEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				new Locatable( new Location(new Coords()) ),
				new Collidable(itemToolsetCollider),
				new Drawable(itemToolsetVisual),
				new DrawableCamera()
			]
		);

		return itemToolsetEntityDefn;
	};

	entityDefnBuildWeapon(entityDimension)
	{
		entityDimension = entityDimension * 2;
		var itemDefnName = "Weapon";

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
				new VisualText(itemDefnName, itemWeaponColor),
				new Coords(0, entityDimension)
			)
		]);

		var itemWeaponCollider = new Sphere(new Coords(0, 0), entityDimension / 2);

		var itemWeaponDevice = Device.gun();

		var itemWeaponEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				new Locatable( new Location(new Coords()) ),
				new Collidable(itemWeaponCollider),
				new Drawable(itemWeaponVisual),
				new DrawableCamera(),
				itemWeaponDevice
			]
		);

		return itemWeaponEntityDefn;
	};

	entityDefnBuildWeaponAmmo(entityDimension)
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

		var itemDefnAmmoName = "Ammo";
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

		var collidable = new Collidable(itemAmmoCollider);
		var bounds = new Box(collidable.collider.center, ammoSize);
		var boundable = new Boundable(bounds);

		var roundsPerPile = 5;

		var itemAmmoEntityDefn = new Entity
		(
			itemDefnAmmoName,
			[
				boundable,
				collidable,
				new Drawable(itemAmmoVisual),
				new DrawableCamera(),
				new Item(itemDefnAmmoName, roundsPerPile),
				new Locatable( new Location( new Coords() ) ),
			]
		);

		return itemAmmoEntityDefn;
	};

	entityDefnsBuild()
	{
		var entityDimension = 10;
		var entityDefns =
		[
			this.entityDefnBuildAccessory(entityDimension),
			this.entityDefnBuildArmor(entityDimension),
			this.entityDefnBuildBase(entityDimension),
			this.entityDefnBuildBook(entityDimension),
			this.entityDefnBuildCoin(entityDimension),
			this.entityDefnBuildContainer(entityDimension),
			this.entityDefnBuildCrystal(entityDimension),
			this.entityDefnBuildEnemyGenerator(entityDimension),
			this.entityDefnBuildExit(entityDimension),
			this.entityDefnBuildFlower(entityDimension),
			this.entityDefnBuildFriendly(entityDimension),
			this.entityDefnBuildMaterial(entityDimension),
			this.entityDefnBuildMedicine(entityDimension),
			this.entityDefnBuildMushroom(entityDimension),
			this.entityDefnBuildObstacleBar(entityDimension),
			this.entityDefnBuildObstacleMine(entityDimension),
			this.entityDefnBuildObstacleRing(entityDimension),
			this.entityDefnBuildPlayer(entityDimension),
			this.entityDefnBuildPotion(entityDimension),
			this.entityDefnBuildStore(entityDimension),
			this.entityDefnBuildToolset(entityDimension),
			this.entityDefnBuildWeapon(entityDimension),
			this.entityDefnBuildWeaponAmmo(entityDimension)
		].addLookupsByName();
		return entityDefns;
	};

}
