
class PlaceBuilderDemo
{
	randomizer: any;
	cameraViewSize: Coords;

	entities: any;
	entityDefns: any;
	entityDefnsByName: any;
	itemDefns: ItemDefn[];
	itemDefnsByName: Map<string, ItemDefn>;
	name: string;
	size: Coords;
	marginSize: Coords;

	emplacements: PlaceBuilderDemo_Emplacements;
	movers: PlaceBuilderDemo_Movers;

	constructor(randomizer: any, cameraViewSize: Coords)
	{
		this.emplacements = new PlaceBuilderDemo_Emplacements(this);
		this.movers = new PlaceBuilderDemo_Movers(this);

		this.randomizer = randomizer || RandomizerLCG.default();
		this.cameraViewSize = cameraViewSize;

		var entityDimension = 10;

		this.itemDefns = this.itemDefnsBuild(entityDimension);
		this.itemDefnsByName = ArrayHelper.addLookupsByName(this.itemDefns);

		this.entityDefns = this.entityDefnsBuild(entityDimension);
		this.entityDefnsByName = ArrayHelper.addLookupsByName(this.entityDefns);
	}

	buildBase(size: Coords, placeNameToReturnTo: string)
	{
		this.build_Interior("Base", size, placeNameToReturnTo);

		this.entities.push(this.entityBuildFromDefn(this.entityDefnsByName.get("Player")));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Book"), 1));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Container"), 1));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Friendly"), 1));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Sword"), 1));

		var place = new Place(this.name, "Demo", size, this.entities);

		return place;
	}

	buildBattlefield
	(
		size: Coords, placePos: Coords, areNeighborsConnectedESWN: boolean[],
		isGoal: boolean, placeNamesToIncludePortalsTo: string[]
	)
	{
		var namePrefix = "Battlefield";
		this.name = namePrefix + placePos.toStringXY();
		this.size = size;
		this.entities = [];

		this.build_SizeWallsAndMargins(namePrefix, placePos, areNeighborsConnectedESWN);
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
					var cellTerrain = (terrainsByCodeChar.get(cellCode) || terrains[0]);
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
			var cellTerrain = terrainsByName.get(cell.visualName);
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
					cellNeighborTerrain = terrainsByName.get(cellNeighbor.visualName);
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

		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Flower"), 1));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Grazer"), 1));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("MushroomGenerator"), 1));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Tree"), 1));

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

		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("EnemyGenerator"), 1));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Bar"), 1));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Mine"), 48));

		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Tree"), 10));

		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Ammo"), 5));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Armor"), 1));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Boulder"), 3));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Crystal"), 2));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Flower"), 6));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("GrassGenerator"), 3));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Grazer"), 1));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Material"), 2));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Medicine"), 2));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("MushroomGenerator"), 3));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Ore"), 1));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Pick"), 1));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Speed Boots"), 1));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Toolset"), 1));

		var entityRadioMessage =
			this.entityBuildRadioMessage(entityDefns.get("Friendly").drawable().visual, "This is " + this.name + ".");
		entities.push(entityRadioMessage);

		placeNamesToIncludePortalsTo.forEach(placeName =>
		{
			var entityDefnPortal = this.entityDefnsByName.get("Portal");
			var entityPortal = this.entityBuildFromDefn(entityDefnPortal);
			entityPortal.name = placeName;
			entityPortal.portal().destinationPlaceName = placeName;
			entities.push(entityPortal);
		});
		entities.push( this.entityBuildFromDefn( entityDefns.get("Store") ) );
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
		var entityRing = this.entityBuildFromDefn(entityDefns.get("Ring"));
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
		var exit = this.entityBuildFromDefn(this.entityDefnsByName.get("Exit"));
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
		var itemKeyVisual = this.itemDefnsByName.get(itemDefnKeyName).visual;

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
		var itemAccessoryVisual = this.itemDefnsByName.get(itemDefnAccessoryName).visual;
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
		var itemDefn = this.itemDefnsByName.get(itemDefnArmorName);
		var itemArmorVisual = itemDefn.visual;
		var path = ((itemArmorVisual as VisualGroup).children[0] as VisualPolygon).verticesAsPath;
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
		var itemBookVisual = this.itemDefnsByName.get(itemDefnBookName).visual;
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
		var itemCoinVisual = this.itemDefnsByName.get(itemDefnCoinName).visual;
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

	entityDefnBuildCrystal(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnCrystalName = "Crystal";
		var itemCrystalVisual = this.itemDefnsByName.get(itemDefnCrystalName).visual;
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

	entityDefnBuildFlower(entityDimension: number): Entity
	{
		entityDimension *= .5;
		var itemDefnName = "Flower";
		var visual = this.itemDefnsByName.get(itemDefnName).visual;
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

	entityDefnBuildGenerator(entityDefnToGenerate: Entity): Entity
	{
		var generator = new Generator
		(
			entityDefnToGenerate,
			1000, // ticksToGenerate
			1 // entitiesGeneratedMax
		);

		var entityDefnGenerator = new Entity
		(
			entityDefnToGenerate.name + "Generator",
			[
				generator,
				new Locatable(null)
			]
		);

		return entityDefnGenerator;
	};

	entityDefnBuildGun(entityDimension: number): Entity
	{
		entityDimension = entityDimension * 2;
		var itemDefnName = "Gun";

		var itemGunVisual = this.itemDefnsByName.get(itemDefnName).visual;

		var itemGunCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);

		var itemGunDevice = new Device
		(
			"Gun",
			(u: Universe, w: World, p: Place, entity: Entity) => // initialize
			{
				var device = entity.device();
				device.ticksToCharge = 10;
				device.tickLastUsed = 0;
			},
			(u: Universe, w: World, p: Place, e: Entity) => // update
			{
				// todo
			},
			(u: Universe, world: World, p: Place, entityUser: Entity, entityDevice: Entity) => // use
			{
				var device = entityDevice.device();
				var tickCurrent = world.timerTicksSoFar;
				var ticksSinceUsed = tickCurrent - device.tickLastUsed;
				if (ticksSinceUsed < device.ticksToCharge)
				{
					return;
				}

				var userAsItemHolder = entityUser.itemHolder();
				var hasAmmo = userAsItemHolder.hasItemWithDefnNameAndQuantity("Ammo", 1);
				if (hasAmmo == false)
				{
					return;
				}

				userAsItemHolder.itemSubtractDefnNameAndQuantity("Ammo", 1);

				device.tickLastUsed = tickCurrent;

				var userLoc = entityUser.locatable().loc;
				var userPos = userLoc.pos;
				var userVel = userLoc.vel;
				var userSpeed = userVel.magnitude();
				if (userSpeed == 0) { return; }

				var projectileColor = "Cyan";
				var projectileDimension = 1.5;
				var projectileVisual = new VisualGroup
				(
					new Array<Visual>
					(
						new VisualEllipse
						(
							projectileDimension * 2, // semimajorAxis,
							projectileDimension, // semiminorAxis,
							0, // rotationInTurns,
							projectileColor, // colorFill
							null
						),
						new VisualOffset
						(
							new VisualText(new DataBinding("Projectile", null, null), projectileColor, null),
							new Coords(0, 0 - projectileDimension * 3, 0)
						)
					)
				);

				var userDirection = userVel.clone().normalize();
				var userRadius = entityUser.collidable().collider.radius;
				var projectilePos = userPos.clone().add
				(
					userDirection.clone().multiplyScalar(userRadius + projectileDimension).double()
				);
				var projectileOri = new Orientation
				(
					userVel.clone().normalize(), null
				);
				var projectileLoc = new Disposition(projectilePos, projectileOri, null);
				projectileLoc.vel.overwriteWith(userVel).clearZ().double();

				var projectileCollider =
					new Sphere(new Coords(0, 0, 0), projectileDimension);

				var projectileCollide = (universe: Universe, world: World, place: Place, entityProjectile: Entity, entityOther: Entity) =>
				{
					var killable = entityOther.killable();
					if (killable != null)
					{
						killable.damageApply
						(
							universe, world, place, entityProjectile, entityOther, null
						);
						entityProjectile.killable().integrity = 0;
					}
				};

				var visualExplosion = new VisualCircle(8, "Red", null);
				var killable = new Killable
				(
					1, // integrityMax
					null, // damageApply
					(universe: Universe, world: World, place: Place, entityKillable: Entity) => // die
					{
						var entityExplosion = new Entity
						(
							"Explosion",
							[
								new Ephemeral(8, null),
								new Drawable(visualExplosion, null),
								new DrawableCamera(),
								entityKillable.locatable()
							]
						);
						place.entitiesToSpawn.push(entityExplosion);
					}
				);

				var projectileEntity = new Entity
				(
					"Projectile",
					[
						new Damager(10),
						new Ephemeral(32, null),
						killable,
						new Locatable( projectileLoc ),
						new Collidable
						(
							projectileCollider,
							[ Killable.name ],
							projectileCollide
						),
						new Drawable(projectileVisual, null),
						new DrawableCamera()
					]
				);

				p.entitiesToSpawn.push(projectileEntity);
			}
		);

		var itemGunEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemGunCollider, null, null),
				new Drawable(itemGunVisual, null),
				new DrawableCamera(),
				itemGunDevice
			]
		);

		return itemGunEntityDefn;
	};

	entityDefnBuildGrass(entityDimension: number): Entity
	{
		entityDimension /= 2;
		var itemDefnName = "Grass";

		var itemGrassVisual = this.itemDefnsByName.get(itemDefnName).visual;

		var itemGrassCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);

		var itemGrassEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemGrassCollider, null, null),
				new Drawable(itemGrassVisual, null),
				new DrawableCamera()
			]
		);

		return itemGrassEntityDefn;
	}

	entityDefnBuildGunAmmo(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnAmmoName = "Ammo";

		var itemAmmoVisual = this.itemDefnsByName.get(itemDefnAmmoName).visual;
		var path = ((itemAmmoVisual as VisualGroup).children[0] as VisualPolygon).verticesAsPath;

		var ammoSize = new Box
		(
			new Coords(0, 0, 0), new Coords(0, 0, 0)
		).ofPoints(path.points).size;

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
		var itemMaterialVisual = this.itemDefnsByName.get(itemDefnMaterialName).visual;
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

	entityDefnBuildMeat(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnMeatName = "Meat";
		var itemMeatVisual = this.itemDefnsByName.get(itemDefnMeatName).visual;
		var itemMeatCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);

		var itemMeatEntityDefn = new Entity
		(
			itemDefnMeatName,
			[
				new Item(itemDefnMeatName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemMeatCollider, null, null),
				new Drawable(itemMeatVisual, null),
				new DrawableCamera()
			]
		);

		return itemMeatEntityDefn;
	};

	entityDefnBuildMedicine(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnMedicineName = "Medicine";
		var itemMedicineVisual = this.itemDefnsByName.get(itemDefnMedicineName).visual;
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

		var itemMushroomVisual = this.itemDefnsByName.get(itemDefnName).visual;

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
	}

	entityDefnBuildOre(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnOreName = "Ore";
		var itemOreVisual = this.itemDefnsByName.get(itemDefnOreName).visual;
		var itemOreCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);

		var itemOreEntityDefn = new Entity
		(
			itemDefnOreName,
			[
				new Item(itemDefnOreName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemOreCollider, null, null),
				new Drawable(itemOreVisual, null),
				new DrawableCamera()
			]
		);

		return itemOreEntityDefn;
	};

	entityDefnBuildPick(entityDimension: number): Entity
	{
		var itemDefnName = "Pick";
		var itemPickVisual = this.itemDefnsByName.get(itemDefnName).visual;

		var itemPickCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);

		var itemPickDevice = new Device
		(
			"Pick",
			null, // initialize: (u: Universe, w: World, p: Place, e: Entity) => void,
			null, // update: (u: Universe, w: World, p: Place, e: Entity) => void,
			(u: Universe, w: World, p: Place, eUser: Entity, eDevice: Entity) => // use
			{
				var bouldersInPlace = p.entities.filter(x => x.name.startsWith("Boulder"));
				var rangeMax = 32; // todo
				var boulderInRange = bouldersInPlace.filter
				(
					x => x.locatable().distanceFromEntity(eUser) < rangeMax
				)[0];
				if (boulderInRange != null)
				{
					boulderInRange.killable().integrity = 0;
				}
			}
		);

		var itemPickEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemPickCollider, null, null),
				itemPickDevice,
				new Drawable(itemPickVisual, null),
				new DrawableCamera()
			]
		);

		return itemPickEntityDefn;
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
		var itemDefnName = "Sword";

		var itemSwordCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);

		var itemSwordDevice = new Device
		(
			"Sword",
			(u: Universe, w: World, p: Place, entity: Entity) => // initialize
			{
				var device = entity.device();
				device.ticksToCharge = 10;
				device.tickLastUsed = 0;
			},
			(u: Universe, w: World, p: Place, e: Entity) => // update
			{
				// todo
			},
			(universe: Universe, world: World, place: Place, entityUser: Entity, entityDevice: Entity) => // use
			{
				var device = entityDevice.device();
				var tickCurrent = world.timerTicksSoFar;
				var ticksSinceUsed = tickCurrent - device.tickLastUsed;
				if (ticksSinceUsed < device.ticksToCharge)
				{
					return;
				}

				device.tickLastUsed = tickCurrent;

				var userLoc = entityUser.locatable().loc;
				var userPos = userLoc.pos;
				var userVel = userLoc.vel;
				var userSpeed = userVel.magnitude();
				if (userSpeed == 0) { return; }

				var projectileDimension = 1.5;

				var projectileVisual = entityDevice.drawable().visual;

				var userDirection = userVel.clone().normalize();
				var userRadius = entityUser.collidable().collider.radius;
				var projectilePos = userPos.clone().add
				(
					userDirection.clone().multiplyScalar(userRadius + projectileDimension).double()
				);
				var projectileOri = new Orientation
				(
					userVel.clone().normalize(), null
				);
				var projectileLoc = new Disposition(projectilePos, projectileOri, null);
				projectileLoc.vel.overwriteWith(userVel).clearZ().double();

				var projectileCollider =
					new Sphere(new Coords(0, 0, 0), projectileDimension);

				var projectileCollide = (universe: Universe, world: World, place: Place, entityProjectile: Entity, entityOther: Entity) =>
				{
					var killable = entityOther.killable();
					if (killable != null)
					{
						killable.damageApply
						(
							universe, world, place, entityProjectile, entityOther, null
						);
						entityProjectile.killable().integrity = 0;
					}
				};

				var visualExplosion = new VisualCircle(8, "Red", null);
				var killable = new Killable
				(
					1, // integrityMax
					null, // damageApply
					(universe: Universe, world: World, place: Place, entityKillable: Entity) => // die
					{
						var entityExplosion = new Entity
						(
							"Explosion",
							[
								new Ephemeral(8, null),
								new Drawable(visualExplosion, null),
								new DrawableCamera(),
								entityKillable.locatable()
							]
						);
						place.entitiesToSpawn.push(entityExplosion);
					}
				);

				var projectileEntity = new Entity
				(
					"Projectile",
					[
						new Damager(10),
						new Ephemeral(4, null),
						killable,
						new Locatable( projectileLoc ),
						new Collidable
						(
							projectileCollider,
							[ Killable.name ],
							projectileCollide
						),
						new Drawable(projectileVisual, null),
						new DrawableCamera()
					]
				);

				place.entitiesToSpawn.push(projectileEntity);
			}
		);

		var itemSwordVisual = this.itemDefnsByName.get(itemDefnName).visual;

		var itemSwordEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				new Collidable(itemSwordCollider, null, null),
				new Drawable(itemSwordVisual, null),
				new DrawableCamera(),
				itemSwordDevice
			]
		);

		return itemSwordEntityDefn;
	};

	entityDefnBuildToolset(entityDimension: number)
	{
		var itemDefnName = "Toolset";

		var itemToolsetVisual = this.itemDefnsByName.get(itemDefnName).visual;

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

	entityDefnsBuild(entityDimension: number): Entity[]
	{
		var entityDefnFlower = this.entityDefnBuildFlower(entityDimension);
		var entityDefnGrass = this.entityDefnBuildGrass(entityDimension);
		var entityDefnMushroom = this.entityDefnBuildMushroom(entityDimension);

		var entityDefns =
		[
			this.emplacements.entityDefnBuildBoulder(entityDimension),
			this.emplacements.entityDefnBuildContainer(entityDimension),
			this.emplacements.entityDefnBuildExit(entityDimension),
			this.emplacements.entityDefnBuildPortal(entityDimension),
			this.emplacements.entityDefnBuildObstacleBar(entityDimension),
			this.emplacements.entityDefnBuildObstacleMine(entityDimension),
			this.emplacements.entityDefnBuildObstacleRing(entityDimension),
			this.emplacements.entityDefnBuildTree(entityDimension),

			this.movers.entityDefnBuildEnemyGenerator(entityDimension),
			this.movers.entityDefnBuildFriendly(entityDimension),
			this.movers.entityDefnBuildGrazer(entityDimension),
			this.movers.entityDefnBuildPlayer(entityDimension),

			this.entityDefnBuildAccessory(entityDimension),
			this.entityDefnBuildArmor(entityDimension),
			this.entityDefnBuildBook(entityDimension),
			this.entityDefnBuildCoin(entityDimension),
			this.entityDefnBuildCrystal(entityDimension),
			entityDefnFlower,
			this.entityDefnBuildGenerator(entityDefnFlower),
			this.entityDefnBuildGun(entityDimension),
			this.entityDefnBuildGunAmmo(entityDimension),
			this.entityDefnBuildMaterial(entityDimension),
			this.entityDefnBuildMedicine(entityDimension),
			this.entityDefnBuildMeat(entityDimension),
			entityDefnMushroom,
			this.entityDefnBuildGenerator(entityDefnMushroom),
			entityDefnGrass,
			this.entityDefnBuildGenerator(entityDefnGrass),
			this.entityDefnBuildOre(entityDimension),
			this.entityDefnBuildPick(entityDimension),
			this.entityDefnBuildPotion(entityDimension),
			this.entityDefnBuildStore(entityDimension),
			this.entityDefnBuildSword(entityDimension),
			this.entityDefnBuildToolset(entityDimension),
		];
		return entityDefns;
	};

	itemDefnsBuild(entityDimension: number)
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemUseEquip = (universe: Universe, world: World, place: Place, entityUser: Entity, entityItem: Entity) =>
		{
			var equipmentUser = entityUser.equipmentUser();
			var message = equipmentUser.equipEntityWithItem
			(
				universe, world, place, entityUser, entityItem
			);
			return message;
		};

		var visual = new VisualNone(); // todo

		// ammo

		var itemDefnAmmoName = "Ammo";
		var itemAmmoColor = "rgb(0, 128, 128)";
		var entityDimension = 10; // todo
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

		// armor

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

		// book

		var itemBookName = "Book";
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
				new VisualText(new DataBinding(itemBookName, null, null), itemBookColor, null),
				new Coords(0, 0 - entityDimension * 1.5, 0)
			)
		]);

		// coin

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

		// crystal

		var itemCrystalName = "Crystal";
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
				new VisualText(new DataBinding(itemCrystalName, null, null), itemCrystalColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);

		// flower

		var itemNameFlower = "Flower";
		var colorFlower = "Pink";
		var itemFlowerVisual = new VisualGroup
		([
			new VisualOffset
			(
				new VisualArc
				(
					entityDimensionHalf * 2, // radiusOuter
					entityDimensionHalf * 2 - 2, // radiusInner
					new Coords(-1, 1, 0).normalize(), // directionMin
					.25, // angleSpannedInTurns
					"Green",
					null
				),
				new Coords(.5, 1.75, 0).multiplyScalar(entityDimensionHalf)
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
						new Coords(1, 1, 1).multiplyScalar(entityDimensionHalf)
					)
				),
				colorFlower,
				"Red"
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemNameFlower, null, null), colorFlower, null),
				new Coords(0, 0 - entityDimensionHalf * 2, 0)
			)
		]);

		// grass

		var itemNameGrass = "Grass";
		var itemGrassVisual = new VisualGroup
		([
			new VisualImageScaled
			(
				new VisualImageFromLibrary("Grass"),
				new Coords(1, 1, 0).multiplyScalar(entityDimensionHalf * 4) // sizeScaled
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemNameGrass, null, null), "Green", null),
				new Coords(0, 0 - entityDimensionHalf * 3, 0)
			)
		]);

		// gun

		var itemGunName = "Gun";
		var itemGunColor = "rgb(0, 128, 128)";
		var itemGunVisual = new VisualGroup
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
				itemGunColor,
				5, // lineThickness
				null
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemGunName, null, null), itemGunColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);

		// key

		var itemKeyName = "Key";
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
				new VisualText(new DataBinding(itemKeyName, null, null), itemKeyColor, null),
				new Coords(0, 0 - entityDimension * 2, 0)
			)
		]);

		// material

		var itemMaterialName = "Material";
		var itemMaterialColor = "Gray";
		var itemMaterialVisual = new VisualGroup
		([
			new VisualPolygon
			(
				new Path
				([
					new Coords(-0.5, 0.4, 0),
					new Coords(0.5, 0.4, 0),
					new Coords(0.2, -0.4, 0),
					new Coords(-0.2, -0.4, 0),
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				itemMaterialColor,
				null
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemMaterialName, null, null), itemMaterialColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);

		// meat

		var itemMeatName = "Meat";
		var itemMeatColor = "Red";
		var itemMeatVisual = new VisualGroup
		([
			new VisualCircle
			(
				entityDimensionHalf, itemMeatColor, null
			),
			new VisualCircle
			(
				entityDimensionHalf * .75, null, "Gray"
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemMeatName, null, null), itemMeatColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);

		// medicine

		var itemMedicineName = "Medicine";
		var itemMedicineColor = "Red";
		var itemMedicineVisual = new VisualGroup
		([
			new VisualRectangle
			(
				new Coords(1, 1, 0).multiplyScalar(entityDimension),
				"White", null, null
			),
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
				new VisualText(new DataBinding(itemMedicineName, null, null), itemMedicineColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);

		// mushroom

		var itemMushroomName = "Mushroom";
		var colorStem = "Gray";
		var colorCap = "Purple";
		var itemMushroomVisual = new VisualGroup
		([
			new VisualOffset
			(
				new VisualArc
				(
					entityDimensionHalf, // radiusOuter
					0, // radiusInner
					new Coords(-1, 0, 0), // directionMin
					.5, // angleSpannedInTurns
					colorCap,
					null
				),
				new Coords(0, -entityDimensionHalf / 2, 0)
			),
			new VisualOffset
			(
				new VisualRectangle
				(
					new Coords(entityDimensionHalf / 2, entityDimensionHalf, 0),
					colorStem, null, null
				),
				new Coords(0, 0, 0)
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemMushroomName, null, null), colorCap, null),
				new Coords(0, 0 - entityDimensionHalf * 3, 0)
			)
		]);

		// ore

		var itemOreName = "Ore";
		var itemOreColor = "Gray";
		var itemOreVisual = new VisualGroup
		([
			new VisualArc
			(
				entityDimension / 2, // radiusOuter
				0, // radiusInner
				new Coords(-1, 0, 0), // directionMin
				.5, // angleSpannedInTurns
				itemOreColor,
				null
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemOreName, null, null), itemOreColor, null),
				new Coords(0, 0 - entityDimension * 1.5, 0)
			)
		]);


		// pick

		var itemPickName = "Pick";
		var itemPickColor = "Gray";
		var itemPickVisual = new VisualGroup
		([
			new VisualOffset
			(
				new VisualRectangle
				(
					new Coords(entityDimension / 4, entityDimension, 0),
					"Brown", null, null
				),
				new Coords(0, 0 - entityDimension / 2, 0)
			),
			new VisualPolygon
			(
				new Path
				([
					new Coords(0.75, -1, 0),
					new Coords(-0.75, -1, 0),
					new Coords(-0.5, -1.4, 0),
					new Coords(0.5, -1.4, 0)
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				itemPickColor,
				null
			),
			new VisualOffset
			(
				new VisualText
				(
					DataBinding.fromContext(itemPickName),
					itemPickColor, null
				),
				new Coords(0, 0 - entityDimension * 2, 0)
			)
		]);

		// speed boots

		var itemSpeedBootsName = "Speed Boots";
		var itemAccessoryColor = "Orange";
		var itemSpeedBootsVisual = new VisualGroup
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
				new VisualText(new DataBinding(itemSpeedBootsName, null, null), itemAccessoryColor, null),
				new Coords(0, 0 - entityDimension * 2, 0)
			)
		]);

		// sword

		var itemSwordColor = "rgb(0, 128, 128)";
		var itemSwordVisual = new VisualGroup
		([
			new VisualPolygon //Located
			(
				new Path
				([
					// blade
					new Coords(0.7, 0.2, 0),
					new Coords(2, 0.2, 0),
					new Coords(2.3, 0, 0),
					new Coords(2, -0.2, 0),
					new Coords(0.7, -0.2, 0),

					// hilt
					new Coords(0.7, -0.5, 0),
					new Coords(0.3, -0.5, 0),
					new Coords(0.3, -0.2, 0),
					new Coords(0, -0.2, 0),
					new Coords(0, 0.2, 0),
					new Coords(0.3, 0.2, 0),
					new Coords(0.3, 0.5, 0),
					new Coords(0.7, 0.5, 0),
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				).transform
				(
					new Transform_RotateRight(3) // quarter-turns
				),
				itemSwordColor,
				itemSwordColor
			),
			new VisualOffset
			(
				new VisualText(DataBinding.fromContext("Sword"), itemSwordColor, null),
				new Coords(0, 0 - entityDimension * 2.5, 0)
			)
		]);

		// toolset

		var itemToolsetName = "Toolset";
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
				new VisualText(new DataBinding(itemToolsetName, null, null), itemToolsetColor, null),
				new Coords(0, 0 - entityDimension, 0)
			)
		]);

		var itemDefns =
		[
			// 			name, 				appr, desc, mass, 	val,stax, categoryNames, visual, use
			new ItemDefn("Ammo", 			null, null, null, 	null, null, null, null, itemAmmoVisual),
			new ItemDefn("Armor", 			null, null, 50, 	30, null, [ "Armor" ], itemUseEquip, itemArmorVisual),
			new ItemDefn("Coin", 			null, null, .01, 	1, null, null, null, itemCoinVisual),
			new ItemDefn("Crystal", 		null, null, .1, 	1, null, null, null, itemCrystalVisual),
			new ItemDefn("Enhanced Armor",	null, null, 60, 	60, null, [ "Armor" ], itemUseEquip, itemArmorVisual),
			new ItemDefn("Flower", 			null, null, .01, 	1, null, null, null, itemFlowerVisual),
			new ItemDefn("Grass", 			null, null, .01, 	1, null, null, null, itemGrassVisual),
			new ItemDefn("Gun",				null, null, 5, 		100, null, [ "Wieldable" ], itemUseEquip, itemGunVisual),
			new ItemDefn("Key", 			null, null, .1, 	5, null, null, null, itemKeyVisual),
			new ItemDefn("Material", 		null, null, 10, 	3, null, null, null, itemMaterialVisual),
			new ItemDefn("Meat", 			null, null, 10, 	3, null, null, null, itemMeatVisual),
			new ItemDefn("Mushroom", 		null, null, .01, 	1, null, null, null, itemMushroomVisual),
			new ItemDefn("Ore", 			null, null, 10, 	1, null, null, null, itemOreVisual),
			new ItemDefn("Pick", 			null, null, 1, 		30, null, [ "Wieldable" ], itemUseEquip, itemPickVisual),
			new ItemDefn("Speed Boots", 	null, null, 10, 	30, null, [ "Accessory" ], itemUseEquip, itemSpeedBootsVisual),
			new ItemDefn("Sword",			null, null, 10, 	100, null, [ "Wieldable" ], itemUseEquip, itemSwordVisual),
			new ItemDefn("Toolset", 		null, null, 1, 		30, null, null, null, itemToolsetVisual),

			new ItemDefn
			(
				"Book", null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
				null, // categoryNames
				(universe: Universe, world: World, place: Place, entityUser: Entity, entityItem: Entity) => // use
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

					return "";
				},
				itemBookVisual
			),

			new ItemDefn
			(
				"Medicine", null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
				[ "Consumable" ], // categoryNames
				(universe: Universe, world: World, place: Place, entityUser: Entity, entityItem: Entity) => // use
				{
					var integrityToRestore = 10;
					entityUser.killable().integrityAdd(integrityToRestore);
					var item = entityItem.item();
					entityUser.itemHolder().itemSubtractDefnNameAndQuantity(item.defnName, 1);
					var message = "The medicine restores " + integrityToRestore + " points.";
					return message;
				},
				itemMedicineVisual
			),

			new ItemDefn
			(
				"Potion", null, null, 1, 10, null, // name, appearance, descripton, mass, value, stackSize
				[ "Consumable" ], // categoryNames
				(universe: Universe, world: World, place: Place, entityUser: Entity, entityItem: Entity) => // use
				{
					// Same as medicine, for now.
					var integrityToRestore = 10;
					entityUser.killable().integrityAdd(integrityToRestore);
					var item = entityItem.item();
					entityUser.itemHolder().itemSubtractDefnNameAndQuantity(item.defnName, 1);
					var message = "The potion restores " + integrityToRestore + " points.";
					return message;
				},
				itemMedicineVisual // todo
			),

			new ItemDefn
			(
				"Walkie-Talkie", null, null, 2, 10, null,
				[], // categoryNames
				(universe: Universe, world: World, place: Place, entityUser: Entity, entityItem: Entity) => // use
				{
					return "There is no response but static.";
				},
				visual // todo
			),

		];

		return itemDefns;
	};

}
