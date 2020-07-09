
class PlaceBuilderDemo
{
	randomizer: any;
	cameraViewSize: Coords;
	itemDefns: any;

	entities: any;
	entityDefns: any;
	entityDefnsByName: any;
	name: string;
	size: Coords;
	marginSize: Coords;

	constructor(randomizer: any, cameraViewSize: Coords, itemDefns: ItemDefn[])
	{
		this.randomizer = randomizer || RandomizerLCG.default();
		this.cameraViewSize = cameraViewSize;
		this.itemDefns = itemDefns;
		this.entityDefns = this.entityDefnsBuild();
		this.entityDefnsByName = ArrayHelper.addLookupsByName(this.entityDefns);
	}

	buildBase(size: Coords, placeNameToReturnTo: string)
	{
		this.build_Interior("Base", size, placeNameToReturnTo);

		this.entities.push(this.entityBuildFromDefn(this.entityDefnsByName["Player"]));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName["Book"], 1));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName["Container"], 1));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName["Friendly"], 1));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName["Sword"], 1));

		var place = new Place(this.name, "Demo", size, this.entities);

		return place;
	}

	buildBattlefield
	(
		size: Coords, placePos: Coords, areNeighborsConnectedESWN: boolean[],
		isGoal: boolean, placeNamesToIncludePortalsTo: string[]
	)
	{
		this.name = "Battlefield" + placePos.toStringXY();
		this.size = size;
		this.entities = [];

		this.build_SizeWallsAndMargins(this.name, placePos, areNeighborsConnectedESWN);
		this.build_Exterior(placePos, placeNamesToIncludePortalsTo);
		if (isGoal)
		{
			var entityDimension = 10;
			this.build_Goal(entityDimension);
		}
		this.entitiesAllGround();
		var camera = this.build_Camera(this.cameraViewSize);
		this.entities.splice(0, 0, ...this.entityBuildBackground(camera));
		var place = new Place(this.name, "Demo", size, this.entities);
		return place;
	}

	buildTerrarium(size: Coords, placeNameToReturnTo: string)
	{
		size = size.clone().multiplyScalar(2);
		this.build_Interior("Terrarium", size, placeNameToReturnTo);

		// todo

		var mapCellSource =
		[
			"~~~~~~~~~~~~~~~~....::::QQAA****",
			"~~~~~~~~~~~~~~~~.....:::QQAAA***",
			"~~........~~~~.....:QQQQQQAAAAAA",
			"~~........~~~~....::QQQQQQAAAAAA",
			"~~......~~~~~~....::QQQQQQQQQQQQ",
			"~~......~~~~~~.....:QQQQQQQQQQQQ",
			"~~~~~~..~~~~~~~~....:::::::QQQ::",
			"~~~~~~..~~~~~~~~....:..::::::Q::",
			"~~~~~~~~~~~~~~~~~~......::::::::",
			"~~~~~~~~~~~~~~~~~~......::::::::",
			"~~~~~...~~~~~~..............::::",
			"~~~~~.~.~~~~~~..............::::",
			"~~~~~...~~~~~~~~~~..............",
			"~~~~~~~~~~~~~~~~~~...........:::",
			"~~~~~~~~~~~~~~~~~~~~~~~~...~~~~~",
			"~~~~~~~~~~~~~~~~~~~.....~~~...::",
			"~~~~~~~~~~~~~~~~................",
			"~~~~~~~~~~~~~~~~................",
			"~~~~~~~~~~~~~~..........::::::::",
			"~~~~~~~~~~~~~~..........::::::::",
			"~~~~~~~~~~~~~~.......:::::::::::",
			"~~~~~~~~~~~~~~........::::::::::",
			"~~~~~~~~~~~~........::::::::::::",
			"~~~~~~~~~~~~.......:::::::::::::",
		];
		var mapSizeInCells = new Coords
		(
			mapCellSource[0].length,
			mapCellSource.length,
			1
		);
		var mapCellSize = size.clone().divide(mapSizeInCells).ceiling();

		var neighborOffsets =
		[
			// e, se, s, sw, w, nw, n, ne
			new Coords(1, 0, 0), new Coords(1, 1, 0), new Coords(0, 1, 0),
			new Coords(-1, 1, 0), new Coords(-1, 0, 0), new Coords(-1, -1, 0),
			new Coords(0, -1, 0), new Coords(1, -1, 0)
		];

		var colorToTerrainVisualsByName = (color: string) =>
		{
			var borderWidthAsFraction = .25;
			var borderSizeCorner = mapCellSize.clone().multiplyScalar
			(
				borderWidthAsFraction
			).ceiling();
			var borderSizeVerticalHalf = mapCellSize.clone().multiply
			(
				new Coords(borderWidthAsFraction, .5, 0)
			).ceiling();
			var borderSizeHorizontalHalf = mapCellSize.clone().multiply
			(
				new Coords(.5, borderWidthAsFraction, 0)
			).ceiling();

			var isCenteredFalse = false;

			var visualsByName = new Map<string,Visual>
			([
				[ "Center", new VisualRectangle(mapCellSize, color, null, isCenteredFalse) ],

				[
					"InsideSE",
					new VisualGroup
					([
						// s
						new VisualOffset
						(
							new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse),
							new Coords(mapCellSize.x / 2, mapCellSize.y - borderSizeCorner.y, 0)
						),
						// e
						new VisualOffset
						(
							new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse),
							new Coords(mapCellSize.x - borderSizeCorner.x, mapCellSize.y / 2, 0)
						)
					])
				],
				[
					"InsideSW",
					new VisualGroup
					([
						// s
						new VisualOffset
						(
							new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse),
							new Coords(0, mapCellSize.y - borderSizeCorner.y, 0)
						),
						// w
						new VisualOffset
						(
							new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse),
							new Coords(0, mapCellSize.y / 2, 0)
						)
					])
				],
				[
					"InsideNW",
					new VisualGroup
					([
						// n
						new VisualOffset
						(
							new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse),
							new Coords(0, 0, 0)
						),
						// w
						new VisualOffset
						(
							new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse),
							new Coords(0, 0, 0)
						)
					])
				],
				[
					"InsideNE",
					new VisualGroup
					([
						// n
						new VisualOffset
						(
							new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse),
							new Coords(mapCellSize.x / 2, 0, 0)
						),
						// e
						new VisualOffset
						(
							new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse),
							new Coords(mapCellSize.x - borderSizeCorner.x, 0, 0)
						),
					])
				],
				[
					"OutsideSE",
					new VisualOffset
					(
						new VisualRectangle(borderSizeCorner, color, null, isCenteredFalse),
						new Coords(0, 0, 0)
					)
				],
				[
					"OutsideSW",
					new VisualOffset
					(
						new VisualRectangle(borderSizeCorner, color, null, isCenteredFalse),
						new Coords(mapCellSize.x - borderSizeCorner.x, 0, 0)
					)
				],
				[
					"OutsideNW",
					new VisualOffset
					(
						new VisualRectangle(borderSizeCorner, color, null, isCenteredFalse),
						new Coords(mapCellSize.x - borderSizeCorner.x, mapCellSize.y - borderSizeCorner.y, 0)
					)
				],
				[
					"OutsideNE",
					new VisualOffset
					(
						new VisualRectangle(borderSizeCorner, color, null, isCenteredFalse),
						new Coords(0, mapCellSize.y - borderSizeCorner.y, 0)
					)
				],

				[
					"ETop",
					new VisualOffset
					(
						new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse),
						new Coords(mapCellSize.x - borderSizeCorner.x, 0, 0)
					)
				],
				[
					"EBottom",
					new VisualOffset
					(
						new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse),
						new Coords(mapCellSize.x - borderSizeCorner.x, mapCellSize.y / 2, 0)
					)
				],
				[
					"SRight",
					new VisualOffset
					(
						new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse),
						new Coords(mapCellSize.x / 2, mapCellSize.y - borderSizeCorner.y, 0)
					)
				],
				[
					"SLeft",
					new VisualOffset
					(
						new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse),
						new Coords(0, mapCellSize.y - borderSizeCorner.y, 0)
					)
				],
				[
					"WBottom",
					new VisualOffset
					(
						new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse),
						new Coords(0, mapCellSize.y / 2, 0)
					)
				],
				[
					"WTop",
					new VisualOffset
					(
						new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse),
						new Coords(0, 0, 0)
					)
				],
				[
					"NLeft",
					new VisualOffset
					(
						new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse),
						new Coords(0, 0, 0)
					)
				],
				[
					"NRight",
					new VisualOffset
					(
						new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse),
						new Coords(mapCellSize.x / 2, 0, 0)
					)
				]
			]);

			var visualNamesInOrder =
			[
				"Center",
				// se
				"EBottom",
				"InsideSE",
				"OutsideNW",
				"SRight",
				// sw
				"SLeft",
				"InsideSW",
				"OutsideNE",
				"WBottom",
				// nw
				"WTop",
				"InsideNW",
				"OutsideSE",
				"NLeft",
				// ne
				"NRight",
				"InsideNE",
				"OutsideSW",
				"ETop"
			];

			var visualsInOrder = visualNamesInOrder.map( (x: string) => visualsByName.get(x));

			return visualsInOrder;
		};

		var terrains =
		[
						//name, codeChar, level, isBlocking, visual
			new Terrain("Water", 	"~", 0, true, colorToTerrainVisualsByName("Blue")),
			new Terrain("Sand", 	".", 1, false, colorToTerrainVisualsByName("Tan")),
			new Terrain("Grass", 	":", 2, false, colorToTerrainVisualsByName("Green")),
			new Terrain("Trees", 	"Q", 3, false, colorToTerrainVisualsByName("DarkGreen")),
			new Terrain("Rock", 	"A", 4, false, colorToTerrainVisualsByName("Gray")),
			new Terrain("Snow", 	"*", 5, false, colorToTerrainVisualsByName("White")),
		]
		var terrainsByName = ArrayHelper.addLookupsByName(terrains);
		var terrainsByCodeChar: any = ArrayHelper.addLookups(terrains, (x: Terrain) => x.codeChar);

		var map = new MapOfCells
		(
			"Terrarium",
			mapSizeInCells,
			mapCellSize,
			new MapCell(), // cellPrototype
			(map: MapOfCells, cellPosInCells: any, cellToOverwrite: MapCell) => // cellAtPosInCells
			{
				if (cellPosInCells.isInRangeMax(map.sizeInCellsMinusOnes))
				{
					var cellCode = map.cellSource[cellPosInCells.y][cellPosInCells.x];
					var cellTerrain = (terrainsByCodeChar[cellCode] || terrains[0]);
					var cellVisualName = cellTerrain.name;
					var cellIsBlocking = cellTerrain.isBlocking;
					var cellToOverwriteAsAny: any = cellToOverwrite;
					cellToOverwriteAsAny.visualName = cellVisualName;
					cellToOverwriteAsAny.isBlocking = cellIsBlocking;
				}
				else
				{
					cellToOverwrite = null;
				}
				return cellToOverwrite;
			},
			mapCellSource
		);

		var mapAndCellPosToEntity = (map: MapOfCells, cellPosInCells: any) =>
		{
			var cellVisuals = [];

			var cell = map.cellAtPosInCells(cellPosInCells);
			var cellTerrain = terrainsByName[cell.visualName];
			var cellTerrainVisuals = cellTerrain.visuals;
			cellVisuals.push(cellTerrainVisuals[0]);

			var cellPosInPixels = cellPosInCells.clone().multiply(map.cellSize);

			var neighborTerrains = [];
			var neighborPos = new Coords(0, 0, 0);
			for (var n = 0; n < neighborOffsets.length; n++)
			{
				var neighborOffset = neighborOffsets[n];
				neighborPos.overwriteWith(cellPosInCells).add(neighborOffset);
				var cellNeighbor = map.cellAtPosInCells(neighborPos);
				var cellNeighborTerrain;
				if (cellNeighbor == null)
				{
					cellNeighborTerrain = cellTerrain;
				}
				else
				{
					cellNeighborTerrain = terrainsByName[cellNeighbor.visualName];
				}
				neighborTerrains.push(cellNeighborTerrain);
			}

			var borderTypeCount = 4; // straight0, inside corner, outside corner, straight1

			for (var n = 1; n < neighborTerrains.length; n += 2) // corners
			{
				var nPrev = NumberHelper.wrapToRangeMax(n - 1, neighborTerrains.length);
				var nNext = NumberHelper.wrapToRangeMax(n + 1, neighborTerrains.length);

				var neighborPrevTerrain = neighborTerrains[nPrev];
				var neighborCurrentTerrain = neighborTerrains[n];
				var neighborNextTerrain = neighborTerrains[nNext];

				var borderTypeIndex = null;
				if (neighborCurrentTerrain.level > cellTerrain.level)
				{
					var neighborIndexToUse = n;
					if (neighborPrevTerrain == neighborCurrentTerrain)
					{
						if (neighborNextTerrain == neighborCurrentTerrain)
						{
							borderTypeIndex = 1; // inside corner
						}
						else
						{
							borderTypeIndex = 0; // straight0
						}
					}
					else
					{
						if (neighborNextTerrain == neighborCurrentTerrain)
						{
							borderTypeIndex = 3; // straight1
						}
						else
						{
							borderTypeIndex = 2; // outside corner
						}
					}
				}
				else if (neighborPrevTerrain.level > cellTerrain.level)
				{
					neighborIndexToUse = nPrev;
					if (neighborNextTerrain != neighborPrevTerrain)
					{
						borderTypeIndex = 0; // straight0
					}
				}
				else if (neighborNextTerrain.level > cellTerrain.level)
				{
					neighborIndexToUse = nNext;
					if (neighborNextTerrain != neighborPrevTerrain)
					{
						borderTypeIndex = 3; // straight0
					}
				}


				if (borderTypeIndex != null)
				{
					var neighborTerrainToUse = neighborTerrains[neighborIndexToUse];
					var borderVisualIndex =
						1 + ( (n - 1) / 2) * borderTypeCount + borderTypeIndex;
					var visualForBorder = neighborTerrainToUse.visuals[borderVisualIndex];
					cellVisuals.push(visualForBorder);
				}
			}

			var cellVisual = new VisualGroup(cellVisuals);

			var cellAsEntity = new Entity
			(
				this.name + cellPosInCells.toString(),
				[
					new Drawable(cellVisual, null),
					new DrawableCamera(),
					new Locatable(new Disposition(cellPosInPixels, null, null))
				]
			);
			return cellAsEntity;
		};

		var mapCellsAsEntities = map.cellsAsEntities(mapAndCellPosToEntity);
		this.entities.push(...mapCellsAsEntities);

		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName["Flower"], 1));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName["Mushroom"], 1));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName["Tree"], 1));

		var place = new Place(this.name, "Demo", size, this.entities);
		return place;
	}

	build_Camera(cameraViewSize: Coords): Camera
	{
		var cameraEntity = this.entityBuildCamera(cameraViewSize);
		this.entities.push(cameraEntity);
		return cameraEntity.camera();
	};

	build_Exterior(placePos: Coords, placeNamesToIncludePortalsTo: string[])
	{
		var entityDefns = this.entityDefnsByName;
		var entities = this.entities;

		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["EnemyGenerator"], 1));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Bar"], 1));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Mine"], 48));

		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Tree"], 10));

		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Ammo"], 10));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Armor"], 1));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Crystal"], 3));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Flower"], 3));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Material"], 5));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Medicine"], 5));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Mushroom"], 3));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Speed Boots"], 1));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Toolset"], 1));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns["Flower"], 3));

		var entityRadioMessage =
			this.entityBuildRadioMessage(entityDefns["Friendly"].drawable().visual, "This is " + this.name + ".");
		entities.push(entityRadioMessage);

		placeNamesToIncludePortalsTo.forEach(placeName =>
		{
			var entityDefnPortal = this.entityDefnsByName["Portal"];
			var entityPortal = this.entityBuildFromDefn(entityDefnPortal);
			entityPortal.name = placeName;
			entityPortal.portal().destinationPlaceName = placeName;
			entities.push(entityPortal);
		});
		entities.push(this.entityBuildFromDefn(entityDefns["Store"]));
	}

	build_Goal(entityDimension: number)
	{
		var entityDefns = this.entityDefnsByName;
		var entities = this.entities;

		var entityDefns = this.entityDefnsByName;
		var entities = this.entities;

		var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);
		var numberOfKeysToUnlockGoal = 5;
		var goalEntity = this.entityBuildGoal
		(
			entities, entityDimension, entitySize, numberOfKeysToUnlockGoal
		);
		var entityRing = this.entityBuildFromDefn(entityDefns["Ring"]);
		var ringLoc = entityRing.locatable().loc;
		ringLoc.pos.overwriteWith(goalEntity.locatable().loc.pos);
		ringLoc.spin.angleInTurnsRef.value = .001;

		entities.push(entityRing);
	}

	build_Interior(name: string, size: Coords, placeNameToReturnTo: string)
	{
		this.name = name;
		this.size = size;

		this.entities = [];

		this.build_SizeWallsAndMargins(this.name, null, null);

		this.entityBuildExit(placeNameToReturnTo);

		this.entitiesAllGround();
		this.build_Camera(this.cameraViewSize);
	}

	build_SizeWallsAndMargins(namePrefix: string, placePos: Coords, areNeighborsConnectedESWN: boolean[])
	{
		this.size = this.size.clearZ();

		var wallThickness = this.entityBuildObstacleWalls
		(
			"Red", areNeighborsConnectedESWN, namePrefix, placePos
		);

		var marginThickness = wallThickness * 8;
		var marginSize = new Coords(1, 1, 0).multiplyScalar(marginThickness);
		this.marginSize = marginSize;
	}

	// Constructor helpers.

	entityBuildCamera(cameraViewSize: Coords)
	{
		var viewSizeHalf = cameraViewSize.clone().half();

		var cameraHeightAbovePlayfield = cameraViewSize.x;
		var cameraZ = 0 - cameraHeightAbovePlayfield;

		var cameraPosBox = new Box
		(
			new Coords(0, 0, 0), new Coords(0, 0, 0)
		).fromMinAndMax
		(
			viewSizeHalf.clone().zSet(cameraZ),
			this.size.clone().subtract(viewSizeHalf).zSet(cameraZ)
		);

		var cameraPos = viewSizeHalf.clone();
		var cameraLoc = new Disposition
		(
			cameraPos,
			Orientation.Instances().ForwardZDownY.clone(), null
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

	entityBuildBackground(camera: Camera)
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
				null, "rgba(255, 255, 255, 0.02)", null
			),
			true // expandViewStartAndEndByCell
		);
		var entityBackgroundBottom = new Entity
		(
			"BackgroundBottom",
			[
				new Locatable(new Disposition(new Coords(0, 0, camera.focalLength), null, null)),
				new Drawable(visualBackgroundBottom, null),
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
				null, "rgba(255, 255, 255, 0.06)", null
			),
			true // expandViewStartAndEndByCell
		);
		var entityBackgroundTop = new Entity
		(
			"BackgroundTop",
			[
				new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
				new Drawable(visualBackgroundTop, null),
				new DrawableCamera()
			]
		);
		returnValues.push(entityBackgroundTop);

		return returnValues;
	};

	entityBuildExit(placeNameToReturnTo: string)
	{
		var exit = this.entityBuildFromDefn(this.entityDefnsByName["Exit"]);
		exit.portal().destinationPlaceName = placeNameToReturnTo;
		exit.portal().destinationEntityName = this.name;
		this.entities.push(exit);
	}

	entitiesAllGround()
	{
		this.entities.forEach
		(
			(x: Entity) => { if (x.locatable() != null) { x.locatable().loc.pos.z = 0; } }
		);
	}

	entitiesBuildFromDefnAndCount(entityDefn: Entity, entityCount: number)
	{
		var returnEntities = [];

		for (var i = 0; i < entityCount; i++)
		{
			var entity = this.entityBuildFromDefn(entityDefn);
			returnEntities.push(entity);
		}

		return returnEntities;
	};

	entityBuildFromDefn(entityDefn: Entity): Entity
	{
		var entity = entityDefn.clone();
		if (entity.locatable() != null)
		{
			var sizeMinusMargins =
				this.size.clone().subtract(this.marginSize).subtract(this.marginSize);

			entity.locatable().loc.pos.randomize
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
		entities: Entity[], entityDimension: number, entitySize: Coords, numberOfKeysToUnlockGoal: number
	)
	{
		var itemKeyColor = "Yellow";
		var goalPos = new Coords(0, 0, 0).randomize(this.randomizer).multiplyScalar
		(
			.5
		).addDimensions
		(
			.25, .25, 0
		).multiply
		(
			this.size
		);
		var goalLoc = new Disposition(goalPos, null, null);
		var goalColor = "Green";
		var goalEntity = new Entity
		(
			"Goal",
			[
				new Locatable(goalLoc),
				new Collidable(new Box(new Coords(0, 0, 0), entitySize), null, null),
				new Drawable
				(
					new VisualGroup
					([
						new VisualRectangle(entitySize, goalColor, null, null),
						new VisualText
						(
							new DataBinding("" + numberOfKeysToUnlockGoal, null, null),
							itemKeyColor, null
						),
						new VisualOffset
						(
							new VisualText(new DataBinding("Exit", null, null), goalColor, null),
							new Coords(0, 0 - entityDimension * 2, 0)
						)
					]),
					null
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
		places: Place[], entityDimension: number, numberOfKeysToUnlockGoal: number, marginSize: Coords
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
				itemKeyColor,
				null
			),
			new VisualOffset
			(
				new VisualPolars
				(
					[
						new Polar(0, entityDimensionHalf, 0),
						new Polar(.25, entityDimensionHalf / 2, 0)
					],
					itemKeyColor,
					entityDimensionHalf / 2 // lineThickness
				),
				new Coords(entityDimensionHalf, 0, 0)
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemDefnKeyName, null, null), itemKeyColor, null),
				new Coords(0, 0 - entityDimension * 2, 0)
			)
		]);

		for (var i = 0; i < numberOfKeysToUnlockGoal; i++)
		{
			var itemKeyPos =
				new Coords(0, 0, 0).randomize(this.randomizer).multiply(sizeMinusMargins).add(marginSize);

			var itemKeyCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);

			var itemKeyEntity = new Entity
			(
				itemDefnKeyName + i,
				[
					new Item(itemDefnKeyName, 1),
					new Locatable( new Disposition(itemKeyPos, null, null) ),
					new Collidable(itemKeyCollider, null, null),
					new Drawable(itemKeyVisual, null),
					new DrawableCamera()
				]
			);

			var place = ArrayHelper.random(places, this.randomizer);

			place.entitiesToSpawn.push(itemKeyEntity);
		}
	};

	entityBuildObstacleWalls
	(
		wallColor: string, areNeighborsConnectedESWN: boolean[], placeNamePrefix: string, placePos: Coords
	)
	{
		areNeighborsConnectedESWN = areNeighborsConnectedESWN || [ false, false, false, false ];
		var entities = this.entities;
		var numberOfWalls = 4;
		var wallThickness = 5;
		var doorwayWidthHalf = wallThickness * 4;
		var portalSize = new Coords(1, 1, 0).multiplyScalar(2 * doorwayWidthHalf);

		var neighborOffsets =
		[
			new Coords(1, 0, 0),
			new Coords(0, 1, 0),
			new Coords(-1, 0, 0),
			new Coords(0, -1, 0)
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

			var wallCollider = new Box(new Coords(0, 0, 0), wallSize);
			var wallVisual = new VisualRectangle(wallSize, wallColor, null, null);

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

				var wallPartLoc = new Disposition(wallPartPos, null, null);

				var wallEntity = new Entity
				(
					"ObstacleWall" + i + "_" + d,
					[
						new Locatable(wallPartLoc),
						new Collidable(wallCollider, null, null),
						new Damager(10),
						new Drawable(wallVisual, null),
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
						new Collidable(new Box(new Coords(0, 0, 0), portalSize), null, null),
						new Locatable(new Disposition(portalPos, null, null)),
						new Portal(neighborName, "PortalToNeighbor" + ((i + 2) % 4), false),
						new Drawable
						(
							new VisualRectangle(portalSize, "Violet", null, null),
							null
						),
						new DrawableCamera()
					]
				);

				entities.push(portalEntity);
			}

		}

		return wallThickness;
	};

	entityBuildRadioMessage(visualForPortrait: Visual, message: string)
	{
		return new Entity
		(
			"RadioMessage",
			[
				new Recurrent
				(
					20, // ticksPerRecurrence
					1, // timesToRecur
					// recur
					(u: Universe, w: World, p: Place, e: Entity) =>
					{
						var player = p.player();
						var playerItemHolder = player.itemHolder();
						var itemRadio = new Item("Walkie-Talkie", 1);
						var doesPlayerHaveRadio = playerItemHolder.hasItem(itemRadio);
						if (doesPlayerHaveRadio == false)
						{
							e.recurrent().timesRecurredSoFar = 0;
						}
						else
						{
							var wordBubble = new WordBubble
							(
								visualForPortrait,
								[
									message
								]
							);
							var wordBubbleAsControl = wordBubble.toControl(u);
							var venuesForLayers: Venue[] =
							[
								u.venueCurrent,
								new VenueControls(wordBubbleAsControl)
							];

							u.venueNext = new VenueLayered
							(
								venuesForLayers,
								null
							);
						}
					}
				)
			]
		);
	};

	entityDefnBuildStore(entityDimension: number): Entity
	{
		var storeColor = "Brown";
		var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);
		var storeEntityDefn = new Entity
		(
			"Store",
			[
				new Collidable(new Box(new Coords(0, 0, 0), entitySize), null, null),
				new Drawable
				(
					new VisualGroup
					([
						new VisualRectangle
						(
							new Coords(1, 1.5, 0).multiplyScalar(entityDimension),
							storeColor, null, null
						),
						new VisualOffset
						(
							new VisualRectangle
							(
								new Coords(1.1, .2, 0).multiplyScalar(entityDimension),
								"Gray", null, null
							),
							new Coords(0, -.75, 0).multiplyScalar(entityDimension)
						),
						new VisualOffset
						(
							new VisualText(new DataBinding("Store", null, null), storeColor, null),
							new Coords(0, 0 - entityDimension * 2, 0)
						)
					]),
					null
				),
				new DrawableCamera(),
				new ItemStore("Coin"),
				ItemHolder.fromItems
				([
					new Item("Coin", 100),
					new Item("Gun", 1),
					new Item("Key", 10),
					new Item("Medicine", 100)
				]),
				new Locatable(new Disposition(new Coords(0, 0, 0), null, null))
			]
		);

		return storeEntityDefn;
	};

	// Entity definitions.

	entityDefnBuildAccessory(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnAccessoryName = "Speed Boots";
		var itemAccessoryColor = "Orange";
		var itemAccessoryVisual = new VisualGroup
		([
			new VisualPolygon
			(
				new Path
				([
					new Coords(0, 0, 0),
					new Coords(1, 0, 0),
					new Coords(.5, -.5, 0),
					new Coords(.5, -1, 0),
					new Coords(0, -1, 0),
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				itemAccessoryColor,
				null
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemDefnAccessoryName, null, null), itemAccessoryColor, null),
				new Coords(0, 0 - entityDimension * 2, 0)
			)
		]);
		var itemAccessoryCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);

		var itemAccessoryEntityDefn = new Entity
		(
			itemDefnAccessoryName,
			[
				new Item(itemDefnAccessoryName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemAccessoryCollider, null, null),
				new Drawable(itemAccessoryVisual, null),
				new DrawableCamera()
			]
		);

		return itemAccessoryEntityDefn;
	};

	entityDefnBuildArmor(entityDimension: number): Entity
	{
		var itemDefnArmorName = "Armor";
		var itemArmorColor = "Green";
		var path = new Path
		([
			new Coords(0, 0.5, 0),
			new Coords(-.5, 0, 0),
			new Coords(-.5, -.5, 0),
			new Coords(.5, -.5, 0),
			new Coords(.5, 0, 0),
		]).transform
		(
			Transform_Scale.fromScalar(entityDimension)
		);
		var itemArmorVisual = new VisualGroup
		([
			new VisualPolygon(path, itemArmorColor, null),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemDefnArmorName, null, null), itemArmorColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);
		var itemArmorCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);
		var collidable = new Collidable(itemArmorCollider, null, null);
		var box = new Box(new Coords(0, 0, 0), new Coords(0, 0, 0) ).ofPoints(path.points);
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
				new Locatable( new Disposition( new Coords(0, 0, 0), null, null ) ),
				new Drawable(itemArmorVisual, null),
				new DrawableCamera()
			]
		);

		return itemArmorEntityDefn;
	};

	entityDefnBuildBook(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnBookName = "Book";
		var itemBookColor = "Blue";
		var itemBookVisual = new VisualGroup
		([
			new VisualRectangle
			(
				new Coords(1, 1.25, 0).multiplyScalar(entityDimension),
				itemBookColor, null, null
			),
			new VisualOffset
			(
				new VisualRectangle
				(
					new Coords(.1, 1.1, 0).multiplyScalar(entityDimension),
					"White", null, null
				),
				new Coords(.4, 0, 0).multiplyScalar(entityDimension)
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemDefnBookName, null, null), itemBookColor, null),
				new Coords(0, 0 - entityDimension * 1.5, 0)
			)
		]);
		var itemBookCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);

		var itemBookEntityDefn = new Entity
		(
			itemDefnBookName,
			[
				new Item(itemDefnBookName, 1),
				new Locatable(new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemBookCollider, null, null),
				new Drawable(itemBookVisual, null),
				new DrawableCamera()
			]
		);

		return itemBookEntityDefn;
	}

	entityDefnBuildCoin(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnCoinName = "Coin";
		var itemCoinColor = "Yellow";
		var itemCoinVisual = new VisualGroup
		([
			new VisualCircle
			(
				entityDimensionHalf, itemCoinColor, null
			),
			new VisualCircle
			(
				entityDimensionHalf * .75, null, "Gray"
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemDefnCoinName, null, null), itemCoinColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);
		var itemCoinCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);

		var itemCoinEntityDefn = new Entity
		(
			itemDefnCoinName,
			[
				new Item(itemDefnCoinName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemCoinCollider, null, null),
				new Drawable(itemCoinVisual, null),
				new DrawableCamera()
			]
		);

		return itemCoinEntityDefn;
	};

	entityDefnBuildContainer(entityDimension: number): Entity
	{
		var containerColor = "Orange";
		var entitySize = new Coords(1.5, 1, 0).multiplyScalar(entityDimension);
		var visual = new VisualGroup
		([
			new VisualRectangle
			(
				entitySize, containerColor, null, null
			),
			new VisualRectangle
			(
				new Coords(1.5 * entityDimension, 1, 0), "Gray", null, null
			),
			new VisualRectangle
			(
				new Coords(.5, .5, 0).multiplyScalar(entityDimension),
				"Gray", null, null
			),
			new VisualOffset
			(
				new VisualText(new DataBinding("Container", null, null), containerColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);

		var containerEntityDefn = new Entity
		(
			"Container",
			[
				new Collidable(new Box(new Coords(0, 0, 0), entitySize), null, null),
				new Drawable(visual, null),
				new DrawableCamera(),
				new ItemContainer(),
				new ItemHolder([]),
				new Locatable(new Disposition(new Coords(0, 0, 0), null, null) )
			]
		);

		return containerEntityDefn;
	};

	entityDefnBuildCrystal(entityDimension: number): Entity
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
					new Coords(1, 0, 0),
					new Coords(0, 1, 0),
					new Coords(-1, 0, 0),
					new Coords(0, -1, 0)
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
					new Coords(1, 0, 0),
					new Coords(0, 1, 0),
					new Coords(-1, 0, 0),
					new Coords(0, -1, 0)
				]).transform
				(
					new Transform_Scale
					(
						new Coords(1, 1, 1).multiplyScalar(entityDimension / 4)
					)
				),
				"White",
				null
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemDefnCrystalName, null, null), itemCrystalColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);
		var itemCrystalCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);

		var itemCrystalEntityDefn = new Entity
		(
			itemDefnCrystalName,
			[
				new Collidable(itemCrystalCollider, null, null),
				new Drawable(itemCrystalVisual, null),
				new DrawableCamera(),
				new Item(itemDefnCrystalName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) )
			]
		);

		return itemCrystalEntityDefn;
	};

	entityDefnBuildExit(entityDimension: number): Entity
	{
		var exitColor = "Brown";
		var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);

		var visual = new VisualGroup
		([
			new VisualPolygon
			(
				new Path
				([
					new Coords(0.5, 0, 0),
					new Coords(-0.5, 0, 0),
					new Coords(-0.5, -1.5, 0),
					new Coords(0.5, -1.5, 0)
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				exitColor,
				null
			),
			new VisualOffset
			(
				new VisualCircle(entityDimension / 8, "Yellow", null),
				new Coords(entityDimension / 4, 0 - entityDimension / 2, 0)
			),
			new VisualOffset
			(
				new VisualText(new DataBinding("Exit", null, null), exitColor, null),
				new Coords(0, 0 - entityDimension * 2.5, 0)
			)
		]);

		var exitEntityDefn = new Entity
		(
			"Exit",
			[
				new Collidable(new Box(new Coords(0, 0, 0), entitySize), null, null),
				new Drawable(visual, null),
				new DrawableCamera(),
				new Locatable(new Disposition(new Coords(0, 0, 0), null, null) ),
				new Portal(null, null, null) // Must be set ouside this method.
			]
		);

		return exitEntityDefn;
	};

	entityDefnBuildEnemyGenerator(entityDimension: number): Entity
	{
		var enemyColor = "Red";
		var visualEyeRadius = entityDimension * .75 / 2;
		var visualBuilder = new VisualBuilder();
		var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);

		var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);

		var enemyDimension = entityDimension * 2;

		var enemyColliderAsFace = new Face([
			new Coords(-.5, -1, 0).multiplyScalar(enemyDimension).half(),
			new Coords(.5, -1, 0).multiplyScalar(enemyDimension).half(),
			new Coords(1, 1, 0).multiplyScalar(enemyDimension).half(),
			new Coords(-1, 1, 0).multiplyScalar(enemyDimension).half(),
		]);
		var enemyCollider = Mesh.fromFace
		(
			new Coords(0, 0, 0), // center
			enemyColliderAsFace,
			1 // thickness
		);

		var enemyVisualArm = new VisualPolars
		(
			[ new Polar(0, enemyDimension, 0) ],
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
					new Coords(-8, -8, 0), new Coords(0, 0, 0), new Coords(8, -8, 0)
				]),
				"rgb(64, 64, 64)",
				3, // lineThickness
				null
			),
		]);

		var visualEyesWithBrowsDirectional = new VisualDirectional
		(
			visualEyesBlinking, // visualForNoDirection
			[
				new VisualOffset(visualEyesBlinkingWithBrows, new Coords(1, 0, 0).multiplyScalar(visualEyeRadius)),
				new VisualOffset(visualEyesBlinkingWithBrows, new Coords(0, 1, 0).multiplyScalar(visualEyeRadius)),
				new VisualOffset(visualEyesBlinkingWithBrows, new Coords(-1, 0, 0).multiplyScalar(visualEyeRadius)),
				new VisualOffset(visualEyesBlinkingWithBrows, new Coords(0, -1, 0).multiplyScalar(visualEyeRadius))
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
							enemyVisualArm, new Coords(-enemyDimension / 4, 0, 0)
						),
						new VisualOffset
						(
							enemyVisualArm, new Coords(enemyDimension / 4, 0, 0)
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
				new VisualText(new DataBinding("Chaser", null, null), enemyColor, null),
				new Coords(0, 0 - enemyDimension, 0)
			)
		]);

		var enemyActivity = (universe: Universe, world: World, place: Place, actor: Entity, entityToTargetName: string) =>
		{
			var target = place.entitiesByName[entityToTargetName];
			if (target == null)
			{
				return;
			}

			var actorLoc = actor.locatable().loc;

			actorLoc.accel.overwriteWith
			(
				target.locatable().loc.pos
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
			(universe: Universe, world: World, place: Place, entityDying: Entity) => // die
			{
				var chanceOfDroppingCoin = 1;
				var doesDropCoin = (Math.random() < chanceOfDroppingCoin);
				if (doesDropCoin)
				{
					var entityDefns = world.defns.defnsByNameByTypeName[Entity.name];
					var entityDefnCoin = entityDefns["Coin"];
					var entityCoin = entityDefnCoin.clone();
					entityCoin.locatable().overwriteWith(entityDying.locatable());
					entityCoin.locatable().loc.vel.clear();
					place.entitySpawn(universe, world, entityCoin);
				}

				var entityPlayer = place.player();
				var learner = entityPlayer.skillLearner();
				var learningMessage =
					learner.learningIncrement(world.defns.defnsByNameByTypeName[Skill.name], 1);
				if (learningMessage != null)
				{
					place.entitySpawn
					(
						universe, world,
						universe.entityBuilder.messageFloater
						(
							learningMessage, entityPlayer.locatable().loc.pos
						)
					);
				}
			},
			null
		);


		var enemyEntityPrototype = new Entity
		(
			"Enemy",
			[
				new Actor(enemyActivity, "Player"),
				new Constrainable([constraintSpeedMax1]),
				new Collidable(enemyCollider, null, null),
				new Damager(10),
				new Drawable(enemyVisual, null),
				new DrawableCamera(),
				new Enemy(),
				enemyKillable,
				new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
			]
		);

		var generatorActivity = (universe: Universe, world: World, place: Place, actor: Entity, entityToTargetName: string) => 
		{
			var enemyCount = place.entitiesByPropertyName(Enemy.name).length;
			var enemyCountMax = 3;
			if (enemyCount < enemyCountMax)
			{
				var enemyEntityToPlace = enemyEntityPrototype.clone();

				var placeSizeHalf = place.size.clone().half();
				var directionFromCenter = new Polar
				(
					universe.randomizer.getNextRandom(), 1, 0
				);
				var offsetFromCenter =
					directionFromCenter.toCoords(new Coords(0, 0, 0)).multiply
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

				enemyEntityToPlace.locatable().loc.pos.overwriteWith(enemyPosToStartAt);

				place.entitiesToSpawn.push(enemyEntityToPlace);
			}
		};

		var enemyGeneratorEntityDefn = new Entity
		(
			"EnemyGenerator",
			[
				new Actor(generatorActivity, null)
			]
		);

		return enemyGeneratorEntityDefn;
	};

	entityDefnBuildFlower(entityDimension: number): Entity
	{
		entityDimension *= .5;
		var itemDefnName = "Flower";
		var color = "Pink";
		var visual = new VisualGroup
		([
			new VisualOffset
			(
				new VisualArc
				(
					entityDimension * 2, // radiusOuter
					entityDimension * 2 - 2, // radiusInner
					new Coords(-1, 1, 0).normalize(), // directionMin
					.25, // angleSpannedInTurns
					"Green",
					null
				),
				new Coords(.5, 1.75, 0).multiplyScalar(entityDimension)
			),
			new VisualPolygon
			(
				new Path
				([
					new Coords(1, 0, 0),
					new Coords(.3, .3, 0),
					new Coords(0, 1, 0),
					new Coords(-.3, .3, 0),
					new Coords(-1, 0, 0),
					new Coords(-.3, -.3, 0),
					new Coords(0, -1, 0),
					new Coords(.3, -.3, 0)
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
				new VisualText(new DataBinding(itemDefnName, null, null), color, null),
				new Coords(0, 0 - entityDimension * 2, 0)
			)
		]);
		var collider = new Sphere(new Coords(0, 0, 0), entityDimension);

		var entityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(collider, null, null),
				new Drawable(visual, null),
				new DrawableCamera()
			]
		);

		return entityDefn;
	};

	entityDefnBuildFriendly(entityDimension: number): Entity
	{
		var friendlyColor = "Green";
		var friendlyDimension = entityDimension;

		var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);

		var friendlyCollider = new Sphere(new Coords(0, 0, 0), friendlyDimension);

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

			new VisualOffset
			(
				visualEyesBlinking,
				new Coords(0, -friendlyDimension / 3, 0)
			),

			new VisualOffset
			(
				new VisualArc
				(
					friendlyDimension / 2, // radiusOuter
					0, // radiusInner
					new Coords(1, 0, 0), // directionMin
					.5, // angleSpannedInTurns
					"White",
					null // todo
				),
				new Coords(0, friendlyDimension / 3, 0) // offset
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
						new Array<Visual>
						(
							//new VisualNone(),
							friendlyVisualNormal
						),
						null
					),

					friendlyVisualNormal
				],
				false // isRepeating
			),
			new VisualOffset
			(
				new VisualText(new DataBinding("Talker", null, null), friendlyColor, null),
				new Coords(0, 0 - friendlyDimension * 2, 0)
			)
		]);

		var randomizer = this.randomizer;

		var friendlyEntityDefn = new Entity
		(
			"Friendly",
			[
				new Locatable(new Disposition(new Coords(0, 0, 0), null, null) ),
				new Constrainable([constraintSpeedMax1]),
				new Collidable(friendlyCollider, null, null),
				new Drawable(friendlyVisual, null),
				new DrawableCamera(),
				new Talker("AnEveningWithProfessorSurly"),
				new Actor
				(
					(universe: Universe, world: World, place: Place, entityActor: Entity, target: any) => // activity
					{
						var actor = entityActor.actor();
						var targetPos = actor.target;
						if (targetPos == null)
						{
							targetPos =
								new Coords(0, 0, 0).randomize(randomizer).multiply(place.size);
							actor.target = targetPos;
						}

						var actorLoc = entityActor.locatable().loc;
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
					},
					null
				),
				ItemHolder.fromItems
				([
					new Item("Ammo", 5),
					new Item("Coin", 200),
					new Item("Gun", 1),
					new Item("Key", 1),
					new Item("Material", 3),
					new Item("Medicine", 4),
				]),
			]
		);

		return friendlyEntityDefn;
	};

	entityDefnBuildGun(entityDimension: number): Entity
	{
		entityDimension = entityDimension * 2;
		var itemDefnName = "Gun";

		var itemWeaponColor = "rgb(0, 128, 128)";
		var itemWeaponVisual = new VisualGroup
		([
			new VisualPath
			(
				new Path
				([
					new Coords(-0.3, 0.2, 0),
					new Coords(-0.3, -0.2, 0),
					new Coords(0.3, -0.2, 0)
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				itemWeaponColor,
				5, // lineThickness
				null
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemDefnName, null, null), itemWeaponColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);

		var itemWeaponCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);

		var itemWeaponDevice = Device.gun();

		var itemWeaponEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemWeaponCollider, null, null),
				new Drawable(itemWeaponVisual, null),
				new DrawableCamera(),
				itemWeaponDevice
			]
		);

		return itemWeaponEntityDefn;
	};

	entityDefnBuildGunAmmo(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemAmmoColor = "rgb(0, 128, 128)";
		var path = new Path
		([
			new Coords(0, -0.5, 0),
			new Coords(.25, 0, 0),
			new Coords(.25, 0.5, 0),
			new Coords(-.25, 0.5, 0),
			new Coords(-.25, 0, 0),
		]).transform
		(
			Transform_Scale.fromScalar(entityDimension)
		);
		var ammoSize = new Box
		(
			new Coords(0, 0, 0), new Coords(0, 0, 0)
		).ofPoints(path.points).size;

		var itemDefnAmmoName = "Ammo";
		var itemAmmoVisual = new VisualGroup
		([
			new VisualPolygon
			(
				path, itemAmmoColor, null
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemDefnAmmoName, null, null), itemAmmoColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);

		var itemAmmoCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);

		var collidable = new Collidable(itemAmmoCollider, null, null);
		var bounds = new Box(collidable.collider.center, ammoSize);
		var boundable = new Boundable(bounds);

		var roundsPerPile = 5;

		var itemAmmoEntityDefn = new Entity
		(
			itemDefnAmmoName,
			[
				boundable,
				collidable,
				new Drawable(itemAmmoVisual, null),
				new DrawableCamera(),
				new Item(itemDefnAmmoName, roundsPerPile),
				new Locatable( new Disposition( new Coords(0, 0, 0), null, null ) ),
			]
		);

		return itemAmmoEntityDefn;
	};

	entityDefnBuildMaterial(entityDimension: number): Entity
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
					new Coords(-0.5, 0.5, 0),
					new Coords(0.5, 0.5, 0),
					new Coords(0.2, -0.5, 0),
					new Coords(-0.2, -0.5, 0),
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				itemMaterialColor,
				null
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemDefnMaterialName, null, null), itemMaterialColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);
		var itemMaterialCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);

		var itemMaterialEntityDefn = new Entity
		(
			itemDefnMaterialName,
			[
				new Item(itemDefnMaterialName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemMaterialCollider, null, null),
				new Drawable(itemMaterialVisual, null),
				new DrawableCamera()
			]
		);

		return itemMaterialEntityDefn;
	};

	entityDefnBuildMedicine(entityDimension: number): Entity
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
					new Coords(-0.5, -0.2, 0),
					new Coords(-0.2, -0.2, 0),
					new Coords(-0.2, -0.5, 0),
					new Coords(0.2, -0.5, 0),
					new Coords(0.2, -0.2, 0),
					new Coords(0.5, -0.2, 0),
					new Coords(0.5, 0.2, 0),
					new Coords(0.2, 0.2, 0),
					new Coords(0.2, 0.5, 0),
					new Coords(-0.2, 0.5, 0),
					new Coords(-0.2, 0.2, 0),
					new Coords(-0.5, 0.2, 0)
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				itemMedicineColor,
				null
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemDefnMedicineName, null, null), itemMedicineColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);
		var itemMedicineCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);

		var itemMedicineEntityDefn = new Entity
		(
			itemDefnMedicineName,
			[
				new Item(itemDefnMedicineName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemMedicineCollider, null, null),
				new Drawable(itemMedicineVisual, null),
				new DrawableCamera()
			]
		);

		return itemMedicineEntityDefn;
	};

	entityDefnBuildMushroom(entityDimension: number): Entity
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
					new Coords(-1, 0, 0), // directionMin
					.5, // angleSpannedInTurns
					colorCap,
					null
				),
				new Coords(0, -entityDimension / 2, 0)
			),
			new VisualOffset
			(
				new VisualRectangle
				(
					new Coords(entityDimension / 2, entityDimension, 0),
					colorStem, null, null
				),
				new Coords(0, 0, 0)
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemDefnName, null, null), colorCap, null),
				new Coords(0, 0 - entityDimension * 3, 0)
			)
		]);

		var itemMushroomCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);

		var itemMushroomEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemMushroomCollider, null, null),
				new Drawable(itemMushroomVisual, null),
				new DrawableCamera()
			]
		);

		return itemMushroomEntityDefn;
	};

	entityDefnBuildObstacleBar(entityDimension: number): Entity
	{
		var obstacleColor = "Red";

		var obstacleBarSize = new Coords(6, 2, 1).multiplyScalar(entityDimension);
		var obstacleRotationInTurns = .0625;
		var obstacleCollider = new BoxRotated
		(
			new Box(new Coords(0, 0, 0), obstacleBarSize), obstacleRotationInTurns
		);
		var obstacleCollidable = new Collidable(obstacleCollider, null, null);
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
					obstacleColor, obstacleColor, null
				),
				new VisualOffset
				(
					new VisualText(new DataBinding("Bar", null, null), obstacleColor, null),
					new Coords(0, 0 - obstacleCollider.box.size.y, 0)
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
				new Drawable(visual, null),
				new DrawableCamera(),
				new Locatable(new Disposition(new Coords(0, 0, 0), null, null) )
			]
		);

		return obstacleBarEntityDefn;
	};

	entityDefnBuildObstacleMine(entityDimension: number): Entity
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

		var obstacleMappedMap = new MapOfCells
		(
			"Mine",
			obstacleMappedSizeInCells,
			obstacleMappedCellSize,
			new MapCell(), // cellPrototype
			(map: MapOfCells, cellPosInCells: any, cellToOverwrite: any) => // cellAtPosInCells
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
			"Blocking" : new VisualRectangle(obstacleMappedCellSize, obstacleColor, null, false), // isCentered
			"Open" : new VisualNone()
		};
		var obstacleMappedVisual = new VisualGroup
		([
			new VisualMap(obstacleMappedMap, obstacleMappedVisualLookup, null, null),
			new VisualOffset
			(
				new VisualText(new DataBinding("Mine", null, null), obstacleColor, null),
				new Coords(0, 0 - entityDimension * 2, 0)
			)
		]);

		var obstacleCollidable = new Collidable
		(
			new MapLocated
			(
				obstacleMappedMap,
				new Disposition(new Coords(0, 0, 0), null, null)
			),
			null, null
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
				new Drawable(obstacleMappedVisual, null),
				new DrawableCamera(),
				new Locatable(new Disposition(new Coords(0, 0, 0), null, null) )
			]
		);

		return obstacleMappedEntityDefn;
	};

	entityDefnBuildObstacleRing(entityDimension: number): Entity
	{
		var obstacleColor = "Red";
		var obstacleRadiusOuter = entityDimension * 3.5;
		var obstacleRadiusInner = obstacleRadiusOuter - entityDimension;
		var obstacleAngleSpannedInTurns = .85;
		var obstacleLoc = new Disposition(new Coords(0, 0, 0), null, null);
		var obstacleCollider = new Arc
		(
			new Shell
			(
				new Sphere(new Coords(0, 0, 0), obstacleRadiusOuter), // sphereOuter
				obstacleRadiusInner
			),
			new Wedge
			(
				new Coords(0, 0, 0), // vertex
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
			obstacleColor,
			null
		);

		var obstacleRingEntityDefn = new Entity
		(
			"Ring",
			[
				new Locatable(obstacleLoc),
				new Collidable(obstacleCollider, null, null),
				new Damager(10),
				new Drawable(obstacleRingVisual, null),
				new DrawableCamera()
			]
		);

		return obstacleRingEntityDefn;
	};

	entityDefnBuildPlayer(entityDimension: number): Entity
	{
		var visualEyeRadius = entityDimension * .75 / 2;
		var visualBuilder = new VisualBuilder();
		var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);

		var playerHeadRadius = entityDimension * .75;
		var playerCollider = new Sphere(new Coords(0, 0, 0), playerHeadRadius);
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
			function selectChildName(u: Universe, w: World, d: Display, e: Entity)
			{
				return (e.playable().isHiding ? "Hidden" : "Normal");
			},
			[ "Normal", "Hidden" ],
			[ playerVisualBodyNormal, playerVisualBodyHidden ]
		);
		var playerVisualBodyJumpable = new VisualJump2D
		(
			playerVisualBodyHidable,
			new VisualEllipse(playerHeadRadius, playerHeadRadius / 2, 0, "DarkGray", "Black"),
			null
		);
		var playerVisualName = new VisualOffset
		(
			new VisualText(new DataBinding("Player", null, null), playerColor, null),
			new Coords(0, 0 - playerHeadRadius * 3, 0)
		);

		var playerVisual = new VisualGroup
		([
			playerVisualBodyJumpable, playerVisualName
		]);

		var playerCollide = (universe: Universe, world: World, place: Place, entityPlayer: Entity, entityOther: Entity) =>
		{
			if (entityOther.damager() != null)
			{
				universe.collisionHelper.collideCollidables(entityPlayer, entityOther);

				var damage = entityPlayer.killable().damageApply(universe, world, place, entityOther, entityPlayer);

				var messageEntity = universe.entityBuilder.messageFloater
				(
					"-" + damage,
					entityPlayer.locatable().loc.pos
				);

				place.entitySpawn(universe, world, messageEntity);
			}
			else if (entityOther.itemContainer() != null)
			{
				entityOther.collidable().ticksUntilCanCollide = 50; // hack
				var itemContainerAsControl = entityOther.itemContainer().toControl
				(
					universe, universe.display.sizeInPixels,
					entityPlayer, entityOther,
					universe.venueCurrent
				);
				var venueNext: any = new VenueControls(itemContainerAsControl);
				venueNext = new VenueFader(venueNext, null, null, null);
				universe.venueNext = venueNext;
			}
			else if (entityOther.itemStore() != null)
			{
				entityOther.collidable().ticksUntilCanCollide = 50; // hack
				var storeAsControl = entityOther.itemStore().toControl
				(
					universe, universe.display.sizeInPixels,
					entityPlayer, entityOther,
					universe.venueCurrent
				);
				var venueNext: any = new VenueControls(storeAsControl);
				venueNext = new VenueFader(venueNext, null, null, null);
				universe.venueNext = venueNext;
			}
			else if (entityOther.propertiesByName[Goal.name] != null)
			{
				var itemDefnKeyName = "Key";
				var keysRequired =
					new Item(itemDefnKeyName, entityOther.propertiesByName[Goal.name].numberOfKeysToUnlock);
				if (entityPlayer.itemHolder().hasItem(keysRequired))
				{
					var venueMessage = new VenueMessage
					(
						"You win!",
						(universe: Universe) => // acknowledge
						{
							universe.venueNext = new VenueFader
							(
								new VenueControls(universe.controlBuilder.title(universe, null)),
								null, null, null
							);
						},
						universe.venueCurrent, // venuePrev
						universe.display.sizeDefault().clone(),//.half(),
						true // showMessageOnly
					);
					universe.venueNext = venueMessage as Venue;
				}
			}
			else if (entityOther.item() != null)
			{
				entityPlayer.itemHolder().itemEntityAdd(entityOther);
				place.entitiesToRemove.push(entityOther);
			}
			else if (entityOther.portal() != null)
			{
				entityOther.collidable().ticksUntilCanCollide = 50; // hack
				var portal = entityOther.portal();
				var venueCurrent = universe.venueCurrent;
				var messageBoxSize = universe.display.sizeDefault();
				var venueMessage = new VenueMessage
				(
					"Portal to: " + portal.destinationPlaceName,
					(universe: Universe) => // acknowledge
					{
						portal.use
						(
							universe, universe.world, universe.world.placeCurrent, entityPlayer
						);
						universe.venueNext = new VenueFader(venueCurrent, null, null, null) as Venue;
					},
					venueCurrent, // venuePrev
					messageBoxSize,
					true // showMessageOnly
				);
				universe.venueNext = venueMessage as Venue;
			}
			else if (entityOther.talker() != null)
			{
				entityOther.collidable().ticksUntilCanCollide = 100;
				//entityOther.drawable().animationRuns["Friendly"].ticksSinceStarted = 0;

				var conversationDefnAsJSON =
					universe.mediaLibrary.textStringGetByName("Conversation").value;
				var conversationDefn = ConversationDefn.deserialize(conversationDefnAsJSON);
				var venueToReturnTo = universe.venueCurrent;
				var conversation = new ConversationRun
				(
					conversationDefn,
					() => // quit
					{
						universe.venueNext = venueToReturnTo;
					},
					entityPlayer,
					entityOther // entityTalker
				);
				var conversationSize = universe.display.sizeDefault().clone();
				var conversationAsControl =
					conversation.toControl(conversationSize, universe);

				venueNext = new VenueControls(conversationAsControl);

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
				(u: Universe, w: World, p: Place, e: Entity) => ( e.locatable().loc.pos.z >= 0 ),
				new Constraint_FrictionXY(.03, .5)
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
			(universe: Universe, world: World, place: Place, entityDamager: Entity, entityKillable: Entity) => // damageApply
			{
				var damage = entityDamager.damager().damagePerHit;
				var equipmentUser = entityKillable.equipmentUser();
				var armorEquipped = equipmentUser.itemEntityInSocketWithName("Armor");
				if (armorEquipped != null)
				{
					var armor = armorEquipped.armor;
					damage *= armor.damageMultiplier;
				}
				entityKillable.killable().integrityAdd(0 - damage);
				return damage;
			},
			(universe: Universe, world: World, place: Place, entityKillable: Entity) => // die
			{
				var venueMessage = new VenueMessage
				(
					"You lose!",
					(universe: Universe) => // acknowledge
					{
						universe.venueNext = new VenueFader
						(
							new VenueControls(universe.controlBuilder.title(universe, null) ), null, null, null
						);
					},
					universe.venueCurrent, // venuePrev
					universe.display.sizeDefault().clone(),//.half(),
					true // showMessageOnly
				);
				universe.venueNext = venueMessage;
			},
			null
		);

		var movable = new Movable
		(
			0.5, // accelerationPerTick
			(universe: Universe, world: World, place: Place, entityMovable: Entity) => // accelerate
			{
				var accelerationToApply = entityMovable.movable().accelerationPerTick;
				var equipmentUser = entityMovable.equipmentUser();
				var accessoryEquipped =
					equipmentUser.itemEntityInSocketWithName("Accessory");
				var areSpeedBootsEquipped =
				(
					accessoryEquipped != null
					&& accessoryEquipped.item().defnName == "Speed Boots"
				);
				if (areSpeedBootsEquipped)
				{
					accelerationToApply *= 2;
				}
				entityMovable.movable().accelerateForward
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
			(universe: Universe, size: Coords, entity: Entity, venuePrev: Venue) => // toControl
			{
				var fontHeight = 12;
				var labelSize = new Coords(150, fontHeight * 1.25, 0);

				var statusAsControl = new ControlContainer
				(
					"Status",
					new Coords(0, 0, 0), // pos
					size.clone().addDimensions(0, -30, 0), // size
					// children
					[
						new ControlLabel
						(
							"labelStatus",
							new Coords(10, labelSize.y, 0), // pos
							labelSize.clone(),
							false, // isTextCentered
							"Health:" + entity.killable().integrity,
							fontHeight
						),

						new ControlLabel
						(
							"labelExperience",
							new Coords(10, labelSize.y * 2, 0), // pos
							labelSize.clone(),
							false, // isTextCentered
							"Experience:" + entity.skillLearner().learningAccumulated,
							fontHeight
						),
					],
					null, null
				);

				var itemHolderAsControl = entity.itemHolder().toControl
				(
					universe, size, entity, venuePrev, false // includeTitleAndDoneButton
				);

				var equipmentUserAsControl = entity.equipmentUser().toControl
				(
					universe, size, entity, venuePrev, false // includeTitleAndDoneButton
				);

				var crafterAsControl = entity.itemCrafter().toControl
				(
					universe, size, entity, venuePrev, false // includeTitleAndDoneButton
				);

				var skillLearnerAsControl = entity.skillLearner().toControl
				(
					universe, size, entity, venuePrev, false // includeTitleAndDoneButton
				);

				var back = function()
				{
					var venueNext: Venue = venuePrev;
					venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
					universe.venueNext = venueNext;
				};

				var returnValue = new ControlTabbed
				(
					"tabbedItems",
					new Coords(0, 0, 0), // pos
					size,
					[
						statusAsControl,
						itemHolderAsControl,
						equipmentUserAsControl,
						crafterAsControl,
						skillLearnerAsControl
					],
					null, // fontHeightInPixels
					back
				);
				return returnValue;
			}
		);

		var playerEntityDefn = new Entity
		(
			"Player",
			[
				new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
				new Collidable
				(
					playerCollider,
					[ Collidable.name ], // entityPropertyNamesToCollideWith
					playerCollide
				),
				constrainable,
				controllable,
				new Drawable(playerVisual, null),
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
				new Playable(null),
				new SkillLearner(null, null, null)
			]
		);

		var controlStatus = new ControlLabel
		(
			"infoStatus",
			new Coords(8, 5, 0), //pos,
			new Coords(150, 0, 0), //size,
			false, // isTextCentered,
			new DataBinding
			(
				playerEntityDefn,
				function get(c)
				{
					var player = c;
					var itemHolder = player.itemHolder();
					var statusText = "H:" + player.killable().integrity
						+ "   A:" + itemHolder.itemQuantityByDefnName("Ammo")
						+ "   K:" + itemHolder.itemQuantityByDefnName("Key")
						+ "   $:" + itemHolder.itemQuantityByDefnName("Coin")
						+ "   X:" + player.skillLearner().learningAccumulated;
					var statusText = "";
					return statusText;
				},
				null
			), // text,
			10 // fontHeightInPixels
		);
		var playerVisualStatus = new VisualControl(controlStatus);
		playerVisual.children.push(playerVisualStatus);

		return playerEntityDefn;
	};

	entityDefnBuildPortal(entityDimension: number): Entity
	{
		var baseColor = "Brown";

		var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);

		var visual = new VisualGroup
		([
			new VisualPolygon
			(
				new Path
				([
					new Coords(0.5, 0.5, 0),
					new Coords(-0.5, 0.5, 0),
					new Coords(-0.5, -0.5, 0),
					new Coords(0, -1, 0),
					new Coords(0.5, -0.5, 0)
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				baseColor,
				null
			),
			new VisualOffset
			(
				new VisualDynamic
				(
					(u: Universe, w: World, d: Display, e: Entity) =>
						new VisualText
						(
							new DataBinding(e.portal().destinationPlaceName, null, null),
							baseColor,
							null
						)
				),
				new Coords(0, entityDimension, 0)
			)
		]);

		var portalEntity = new Entity
		(
			"Portal",
			[
				new Collidable(new Box(new Coords(0, 0, 0), entitySize), null, null),
				new Drawable(visual, null),
				new DrawableCamera(),
				new Locatable(new Disposition(new Coords(0, 0, 0), null, null) ),
				new Portal( null, "Exit", null )
			]
		);

		return portalEntity;
	};

	entityDefnBuildPotion(entityDimension: number): Entity
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
					new Coords(1, 1, 0),
					new Coords(-1, 1, 0),
					new Coords(-.2, 0, 0),
					new Coords(-.2, -.5, 0),
					new Coords(.2, -.5, 0),
					new Coords(.2, 0, 0)
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				itemPotionColor,
				"White"
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemDefnPotionName, null, null), itemPotionColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);
		var itemPotionCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);

		var itemPotionEntityDefn = new Entity
		(
			itemDefnPotionName,
			[
				new Item(itemDefnPotionName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemPotionCollider, null, null),
				new Drawable(itemPotionVisual, null),
				new DrawableCamera()
			]
		);

		return itemPotionEntityDefn;
	};

	entityDefnBuildSword(entityDimension: number): Entity
	{
		entityDimension = entityDimension;
		var itemDefnName = "Sword";

		var itemWeaponColor = "rgb(0, 128, 128)";
		var itemWeaponVisual = new VisualGroup
		([
			new VisualPolygonLocated
			(
				new Path
				([
					new Coords(0.2, 0.5, 0),
					new Coords(0.2, 0.2, 0),
					new Coords(2, 0.2, 0),
					new Coords(2.3, 0, 0),
					new Coords(2, -0.2, 0),
					new Coords(0.2, -0.2, 0),
					new Coords(0.2, -0.5, 0),
					new Coords(-0.2, -0.5, 0),
					new Coords(-0.2, -0.2, 0),
					new Coords(-0.5, -0.2, 0),
					new Coords(-0.5, 0.2, 0),
					new Coords(-0.2, 0.2, 0),
					new Coords(-0.2, 0.5, 0)
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				itemWeaponColor,
				itemWeaponColor
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemDefnName, null, null), itemWeaponColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);

		var itemWeaponCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);

		var itemWeaponDevice = Device.sword();

		var itemWeaponEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemWeaponCollider, null, null),
				new Drawable(itemWeaponVisual, null),
				new DrawableCamera(),
				itemWeaponDevice
			]
		);

		return itemWeaponEntityDefn;
	};

	entityDefnBuildToolset(entityDimension: number)
	{
		var itemDefnName = "Toolset";

		var itemToolsetColor = "Gray";
		var itemToolsetVisual = new VisualGroup
		([
			new VisualOffset
			(
				new VisualRectangle
				(
					new Coords(entityDimension / 4, entityDimension, 0),
					"Brown", null, null
				),
				new Coords(0, entityDimension / 2, 0)
			),
			new VisualRectangle
			(
				new Coords(entityDimension, entityDimension / 2, 0),
				itemToolsetColor, null, null
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemDefnName, null, null), itemToolsetColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);

		var itemToolsetCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);

		var itemToolsetEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemToolsetCollider, null, null),
				new Drawable(itemToolsetVisual, null),
				new DrawableCamera()
			]
		);

		return itemToolsetEntityDefn;
	};

	entityDefnBuildTree(entityDimension: number): Entity
	{
		var entityName = "Tree";
		entityDimension *= 1.5;
		var color = "Green";
		var visual: any = new VisualGroup
		([
			new VisualRectangle
			(
				new Coords(1, 2, 0).multiplyScalar(entityDimension * 0.5),
				"Brown", null, null
			),
			new VisualOffset
			(
				new VisualEllipse
				(
					entityDimension, // semimajorAxis
					entityDimension * .8,
					0, // rotationInTurns
					color,
					null // colorBorder
				),
				new Coords(0, -entityDimension, 0)
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(entityName, null, null), color, null),
				new Coords(0, 0 - entityDimension * 2, 0)
			)
		]);
		visual = new VisualOffset(visual, new Coords(0, 0 - entityDimension, 0));
		var collider = new Box
		(
			new Coords(0, 0, 0),
			new Coords(1, .1, 1).multiplyScalar(entityDimension * .25)
		);
		var collidable = new Collidable
		(
			collider,
			[ Collidable.name ], // entityPropertyNamesToCollideWith,
			// collideEntities
			(u: Universe, w: World, p: Place, e: Entity, e2: Entity) => { u.collisionHelper.collideCollidablesReverseVelocities(e, e2); }
		)

		var entityDefn = new Entity
		(
			entityName,
			[
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				collidable,
				new Drawable(visual, null),
				new DrawableCamera()
			]
		);

		return entityDefn;
	};

	entityDefnsBuild(): Entity[]
	{
		var entityDimension = 10;
		var entityDefns =
		[
			this.entityDefnBuildAccessory(entityDimension),
			this.entityDefnBuildArmor(entityDimension),
			this.entityDefnBuildBook(entityDimension),
			this.entityDefnBuildCoin(entityDimension),
			this.entityDefnBuildContainer(entityDimension),
			this.entityDefnBuildCrystal(entityDimension),
			this.entityDefnBuildEnemyGenerator(entityDimension),
			this.entityDefnBuildExit(entityDimension),
			this.entityDefnBuildFlower(entityDimension),
			this.entityDefnBuildFriendly(entityDimension),
			this.entityDefnBuildGun(entityDimension),
			this.entityDefnBuildGunAmmo(entityDimension),
			this.entityDefnBuildMaterial(entityDimension),
			this.entityDefnBuildMedicine(entityDimension),
			this.entityDefnBuildMushroom(entityDimension),
			this.entityDefnBuildObstacleBar(entityDimension),
			this.entityDefnBuildObstacleMine(entityDimension),
			this.entityDefnBuildObstacleRing(entityDimension),
			this.entityDefnBuildPlayer(entityDimension),
			this.entityDefnBuildPortal(entityDimension),
			this.entityDefnBuildPotion(entityDimension),
			this.entityDefnBuildStore(entityDimension),
			this.entityDefnBuildSword(entityDimension),
			this.entityDefnBuildToolset(entityDimension),
			this.entityDefnBuildTree(entityDimension)
		];
		return entityDefns;
	};
}
