
class PlaceBuilderDemo // Main.
{
	universe: Universe;
	randomizer: Randomizer;
	cameraViewSize: Coords;

	actions: Action[];
	actionToInputsMappings: ActionToInputsMapping[];
	activityDefns: ActivityDefn[];
	entities: Entity[];
	entityDefns: Entity[];
	entityDefnsByName: Map<string,Entity>;
	fontHeight: number;
	itemDefns: ItemDefn[];
	itemDefnsByName: Map<string, ItemDefn>;
	marginSize: Coords;
	name: string;
	size: Coords;
	visualsHaveText: boolean;

	actionsBuilder: PlaceBuilderDemo_Actions;
	emplacementsBuilder: PlaceBuilderDemo_Emplacements;
	itemsBuilder: PlaceBuilderDemo_Items;
	moversBuilder: PlaceBuilderDemo_Movers;

	constructor(universe: Universe, randomizer: Randomizer, cameraViewSize: Coords)
	{
		this.universe = universe;
		this.randomizer = randomizer || RandomizerLCG.default();
		this.visualsHaveText = false;

		var entityDimension = 10;

		this.actionsBuilder = new PlaceBuilderDemo_Actions(this);
		this.emplacementsBuilder = new PlaceBuilderDemo_Emplacements(this);
		this.itemsBuilder = new PlaceBuilderDemo_Items(this, entityDimension);
		this.moversBuilder = new PlaceBuilderDemo_Movers(this);

		this.actions = this.actionsBuilder.actionsBuild();
		this.actionToInputsMappings = this.actionsBuilder.actionToInputsMappingsBuild();
		this.activityDefns = this.actionsBuilder.activityDefnsBuild();

		this.cameraViewSize = cameraViewSize;

		this.itemDefns = this.itemsBuilder.itemDefnsBuild();
		this.itemDefnsByName = ArrayHelper.addLookupsByName(this.itemDefns);

		this.entityDefns = this.entityDefnsBuild(entityDimension);
		this.entityDefnsByName = ArrayHelper.addLookupsByName(this.entityDefns);

		this.fontHeight = 10;
	}

	buildBase(size: Coords, placeNameToReturnTo: string)
	{
		this.build_Interior("Base", size, placeNameToReturnTo);

		var entityPosRange = new Box(size.clone().half(), size.clone().subtract(this.marginSize));
		var randomizer = this.randomizer;

		var entityDefns = this.entityDefnsByName;
		var e = this.entities;
		e.push(this.entityBuildFromDefn(entityDefns.get("Player"), entityPosRange, randomizer) );
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Anvil"), 1, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Arrow"), 1, 20, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Bar"), 1, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Bomb"), 3, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Book"), 1, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Bow"), 1, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Bread"), 1, 5, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Campfire"), 1, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Car"), 1, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Doughnut"), 1, 12, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Friendly"), 1, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Heart"), 1, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Meat"), 1, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Pillow"), 1, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Sword"), 1, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("SwordCold"), 1, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("SwordHeat"), 1, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Toolset"), 1, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Torch"), 1, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("TrafficCone"), 10, null, entityPosRange, randomizer));
		e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Weight"), 1, null, entityPosRange, randomizer));

		var ring = this.entitiesBuildFromDefnAndCount
		(
			entityDefns.get("Ring"), 1, null, entityPosRange, randomizer
		)[0];
		var ringLoc = ring.locatable().loc;
		ringLoc.spin.angleInTurnsRef.value = .001;
		this.entities.push(ring);

		var container = this.entityBuildFromDefn(entityDefns.get("Container"), entityPosRange, randomizer);
		var itemEntityOre = this.entityBuildFromDefn(entityDefns.get("Iron Ore"), entityPosRange, randomizer);
		var itemOre = itemEntityOre.item();
		itemOre.quantity = 3; // For crafting.
		container.itemHolder().itemAdd(itemOre);
		this.entities.push(container);

		var randomizerSeed = this.randomizer.getNextRandom();
		var place = new PlaceRoom(this.name, "Demo", size, this.entities, randomizerSeed);

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
		var entityCamera = this.build_Camera(this.cameraViewSize, this.size);
		this.entities.splice(0, 0, ...this.entityBuildBackground(entityCamera.camera() ) );

		var randomizerSeed = this.randomizer.getNextRandom();
		var place = new PlaceRoom(this.name, "Demo", size, this.entities, randomizerSeed);
		return place;
	}

	buildParallax(size: Coords, placeNameToReturnTo: string)
	{
		this.name = "Parallax";
		this.size = size;
		this.entities = [];

		this.entityBuildExit(placeNameToReturnTo);

		this.entitiesAllGround();
		this.build_Camera(this.cameraViewSize, this.size);

		var entityCamera = this.build_Camera(this.cameraViewSize, this.size);
		this.entities.splice(0, 0, ...this.entityBuildBackground(entityCamera.camera() ) );

		var randomizerSeed = this.randomizer.getNextRandom();
		var place = new PlaceRoom(this.name, "Demo", size, this.entities, randomizerSeed);
		return place;
	}

	buildTunnels(size: Coords, placeNameToReturnTo: string)
	{
		size = size.clone().multiplyScalar(4);

		this.build_Interior("Tunnels", size, placeNameToReturnTo);

		var randomizerSeed = this.randomizer.getNextRandom();

		var networkNodeCount = 24;
		var network = Network.random(networkNodeCount, this.randomizer);
		network = network.transform(new Transform_Scale(size));

		//var tunnelsVisual = new VisualNetwork(network);
		var tunnelsVisual = new VisualGroup([]);
		var wallThickness = 4; // todo
		var tunnelWidth = wallThickness * 8;
		var color = Color.byName("Red");

		var nodes = network.nodes;
		for (var i = 0; i < nodes.length; i++)
		{
			var node = nodes[i];
			var visualWallNode = new VisualOffset
			(
				new VisualCircle(tunnelWidth, null, color, wallThickness),
				node.pos.clone()
			);
			tunnelsVisual.children.push(visualWallNode);
		}

		var links = network.links;
		for (var i = 0; i < links.length; i++)
		{
			var link = links[i];
			var nodes = link.nodes(network);
			var node0Pos = nodes[0].pos;
			var node1Pos = nodes[1].pos;
			var linkDisplacement = node1Pos.clone().subtract(node0Pos);
			var linkForward = linkDisplacement.clone().normalize();
			var nodeCenterToTunnel = linkForward.clone().multiplyScalar(tunnelWidth);
			var linkRight = linkForward.clone().right();
			var tunnelMidlineToWallRight = linkRight.clone().multiplyScalar(tunnelWidth);
			var tunnelMidlineToWallLeft = tunnelMidlineToWallRight.clone().invert();
			var visualWallRight = new VisualLine
			(
				tunnelMidlineToWallRight.clone().add(node0Pos).add(nodeCenterToTunnel),
				tunnelMidlineToWallRight.clone().add(node1Pos).subtract(nodeCenterToTunnel),
				color,
				wallThickness
			);
			tunnelsVisual.children.push(visualWallRight);
			var visualWallLeft = new VisualLine
			(
				tunnelMidlineToWallLeft.clone().add(node0Pos).add(nodeCenterToTunnel),
				tunnelMidlineToWallLeft.clone().add(node1Pos).subtract(nodeCenterToTunnel),
				color,
				wallThickness
			);
			tunnelsVisual.children.push(visualWallLeft);
		}

		var tunnelsEntity = new Entity
		(
			"Tunnels",
			[
				Drawable.fromVisual(tunnelsVisual),
				Locatable.create()
			]
		);

		this.entities.push(tunnelsEntity);

		var place = new PlaceRoom
		(
			this.name, "Demo", size, this.entities, randomizerSeed
		);

		return place;
	}

	buildZoned(size: Coords, placeNameToReturnTo: string)
	{
		this.entities = [];

		this.entityBuildExit(placeNameToReturnTo);

		var zones = [];
		var placeSizeInZones = new Coords(3, 3, 1);
		var zonePosInZones = Coords.create();
		var zoneSize = size;
		var neighborOffsets =
		[
			new Coords(1, 0, 0),
			new Coords(1, 1, 0),
			new Coords(0, 1, 0),
			new Coords(-1, 1, 0),
			new Coords(-1, 0, 0),
			new Coords(-1, -1, 0),
			new Coords(0, -1, 0),
			new Coords(1, -1, 0)
		];
		var neighborPos = Coords.create();
		var boxZeroes = new Box(Coords.create(), Coords.create());
		for (var y = 0; y < placeSizeInZones.y; y++)
		{
			zonePosInZones.y = y;

			for (var x = 0; x < placeSizeInZones.x; x++)
			{
				zonePosInZones.x = x;

				var zonePos = zonePosInZones.clone().multiply(zoneSize);

				/*
				var neighborNames = neighborOffsets.filter
				(
					x => neighborPos.overwriteWith(x).add(zonePosInZones).isInRangeMaxExclusive(placeSizeInZones)
				).map
				(
					x => "Zone" + neighborPos.overwriteWith(x).add(zonePosInZones).toStringXY()
				);
				*/

				var neighborNames = neighborOffsets.map
				(
					x =>
						"Zone" + neighborPos.overwriteWith(x).add
						(
							zonePosInZones
						).wrapToRangeMax
						(
							placeSizeInZones
						).toStringXY()
				);

				var entityBoulderCorner = this.entityBuildFromDefn
				(
					this.entityDefnsByName.get("Boulder"),
					boxZeroes,
					this.randomizer
				);

				var zone = new Zone
				(
					"Zone" + zonePosInZones.toStringXY(),
					Box.fromMinAndSize(zonePos, zoneSize),
					neighborNames,
					[
						entityBoulderCorner
					]
				);

				zones.push(zone);
			}
		}

		var zoneStart = zones[0];
		zoneStart.entities.push(...this.entities);

		var zonesByName = ArrayHelper.addLookupsByName(zones);
		var posInZones = Coords.create();

		var placeSize = placeSizeInZones.clone().multiply(zoneSize);
		var place = new PlaceZoned
		(
			"Zoned", // name
			"Demo", // defnName
			placeSize,
			"Player", // entityToFollowName
			zoneStart.name, // zoneStartName
			(zoneName: string) => zonesByName.get(zoneName),
			(posToCheck: Coords) => // zoneAtPos
				zonesByName.get
				(
					"Zone" + posInZones.overwriteWith
					(
						posToCheck
					).divide
					(
						zoneSize
					).floor().toStringXY()
				)
		);

		var entityCamera = this.build_Camera(this.cameraViewSize, place.size);
		zoneStart.entities.push(entityCamera);

		return place;
	}

	buildTerrarium(size: Coords, placeNameToReturnTo: string)
	{
		size = size.clone().multiplyScalar(2);

		//this.build_Interior("Terrarium", size, placeNameToReturnTo);

		this.name = "Terrarium";
		this.size = size;

		this.entities = [];

		this.build_SizeWallsAndMargins(this.name, null, null);

		this.entitiesAllGround();
		this.build_Camera(this.cameraViewSize, this.size);

		// todo

		var mapCellSource =
		[
			/*
			"................................",
			"................................",
			"..~.............................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			"................................",
			*/

			"....................::::QQAA****",
			".....................:::QQAAA***",
			"~~~~~~~~~~~~.......:QQQQQQAAAAAA",
			"~~...~~...~~~~....::QQQQQQAAAAAA",
			"~~........~~~~....::QQQQQQQQQQQQ",
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
		var mapCellSizeHalf = mapCellSize.clone().half();

		var entityExitPosRange = new Box(mapCellSize.clone().half(), null);
		var exit = this.entityBuildFromDefn
		(
			this.entityDefnsByName.get("Exit"), entityExitPosRange, this.randomizer
		);
		var exitPortal = exit.portal();
		exitPortal.destinationPlaceName = placeNameToReturnTo;
		exitPortal.destinationEntityName = this.name;
		this.entities.push(exit);

		var cellCollider = new Box(mapCellSizeHalf.clone(), mapCellSize);
		var cellCollide = (u: Universe, w: World, p: Place, e0: Entity, e1: Entity) =>
		{
			var traversable = e0.traversable();
			if (traversable != null)
			{
				if (traversable.isBlocking)
				{
					u.collisionHelper.collideEntitiesBounce(e0, e1);
				}
			}
		};
		var cellCollidable = new Collidable
		(
			0, cellCollider, [ Playable.name ], cellCollide
		);

		var neighborOffsets =
		[
			// e, se, s, sw, w, nw, n, ne
			new Coords(1, 0, 0), new Coords(1, 1, 0), new Coords(0, 1, 0),
			new Coords(-1, 1, 0), new Coords(-1, 0, 0), new Coords(-1, -1, 0),
			new Coords(0, -1, 0), new Coords(1, -1, 0)
		];

		var colorToTerrainVisualByName = (colorName: string) =>
		{
			var color = Color.byName(colorName);
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
							Coords.create()
						),
						// w
						new VisualOffset
						(
							new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse),
							Coords.create()
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
						Coords.create()
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
						Coords.create()
					)
				],
				[
					"NLeft",
					new VisualOffset
					(
						new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse),
						Coords.create()
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

			var visualsInOrder =
				visualNamesInOrder.map( (x: string) => visualsByName.get(x));

			var visualsAsGroup = new VisualGroup(visualsInOrder);

			return visualsAsGroup;
		};

		var universe = this.universe;

		var terrainNameToVisual = (terrainName: string) =>
		{
			var imageName = "Terrain-" + terrainName;
			var terrainVisualImageCombined =
				new VisualImageFromLibrary(imageName);
			var imageSizeInPixels =
				terrainVisualImageCombined.image(universe).sizeInPixels;
			var imageSizeInTiles = new Coords(5, 5, 1);
			var tileSizeInPixels = imageSizeInPixels.clone().divide(imageSizeInTiles);
			var tileSizeInPixelsHalf = tileSizeInPixels.clone().half();

			var tileCenterBounds = new Box
			(
				imageSizeInPixels.clone().half(),
				tileSizeInPixels
			);
			var terrainVisualCenter: Visual = new VisualImageScaledPartial
			(
				terrainVisualImageCombined,
				tileCenterBounds,
				mapCellSize // sizeToDraw
			);
			// hack - Correct for centering.
			terrainVisualCenter = new VisualOffset
			(
				terrainVisualCenter, mapCellSizeHalf
			);

			var tileOffsetInTilesHalf = Coords.create();
			var visualOffsetInMapCellsHalf = Coords.create();

			var offsetsToVisual =
			(
				tileOffsetInTilesHalf: Coords,
				visualOffsetInMapCellsHalf: Coords
			) =>
			{
				var terrainVisualBounds = Box.fromMinAndSize
				(
					tileOffsetInTilesHalf.clone().multiply(tileSizeInPixelsHalf),
					tileSizeInPixelsHalf
				);
				var terrainVisual: Visual = new VisualImageScaledPartial
				(
					terrainVisualImageCombined,
					terrainVisualBounds,
					mapCellSizeHalf // sizeToDraw
				);
				// hack - Correct for centering.
				terrainVisual = new VisualOffset
				(
					terrainVisual,
					visualOffsetInMapCellsHalf.clone().multiply(mapCellSizeHalf)
				);

				return terrainVisual;
			};

			var terrainVisualInsideSE = offsetsToVisual
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(6, 6, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, 1.5, 0)
			);

			var terrainVisualInsideSW = offsetsToVisual
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(3, 6, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, 1.5, 0)
			);

			var terrainVisualInsideNW = offsetsToVisual
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(3, 3, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, .5, 0)
			);

			var terrainVisualInsideNE = offsetsToVisual
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(6, 3, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, .5, 0)
			);

			var terrainVisualOutsideNW = offsetsToVisual
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(0, 0, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, 1.5, 0)
			);

			var terrainVisualOutsideNE = offsetsToVisual
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(9, 0, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, 1.5, 0)
			);

			var terrainVisualOutsideSE = offsetsToVisual
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(9, 9, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, .5, 0)
			);

			var terrainVisualOutsideSW = offsetsToVisual
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(0, 9, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, .5, 0)
			);

			var terrainVisualEBottom = offsetsToVisual // really more W
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(0, 5, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, 1.5, 0)
			);

			var terrainVisualSRight = offsetsToVisual
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(5, 0, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, 1.5, 0)
			);

			var terrainVisualSLeft = offsetsToVisual
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(4, 0, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, 1.5, 0)
			);

			var terrainVisualWBottom = offsetsToVisual
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(9, 5, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, 1.5, 0)
			);

			var terrainVisualWTop = offsetsToVisual
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(9, 4, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, .5, 0)
			);

			var terrainVisualNLeft = offsetsToVisual
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(4, 9, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, .5, 0)
			);

			var terrainVisualNRight = offsetsToVisual
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(5, 9, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, .5, 0)
			);

			var terrainVisualETop = offsetsToVisual
			(
				tileOffsetInTilesHalf.overwriteWithDimensions(0, 4, 0),
				visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, .5, 0)
			);

			var terrainVisuals =
			[
				// center
				terrainVisualCenter,
				// se
				terrainVisualEBottom,
				terrainVisualInsideSE,
				terrainVisualOutsideNW,
				terrainVisualSRight,
				// sw
				terrainVisualSLeft,
				terrainVisualInsideSW,
				terrainVisualOutsideNE,
				terrainVisualWBottom,
				// nw
				terrainVisualWTop,
				terrainVisualInsideNW,
				terrainVisualOutsideSE,
				terrainVisualNLeft,
				// ne
				terrainVisualNRight,
				terrainVisualInsideNE,
				terrainVisualOutsideSW,
				terrainVisualETop
			];

			var terrainVisualsAsGroup = new VisualGroup(terrainVisuals);

			return terrainVisualsAsGroup;
		}

		var terrains =
		[
			//name, codeChar, level, isBlocking, visual
			new Terrain("Water", 	"~", 0, new Traversable(true), colorToTerrainVisualByName("Blue")),
			new Terrain("Sand", 	".", 1, new Traversable(false), terrainNameToVisual("Sand") ),
			new Terrain("Grass", 	":", 2, new Traversable(false), colorToTerrainVisualByName("Green")),
			new Terrain("Trees", 	"Q", 3, new Traversable(false), colorToTerrainVisualByName("GreenDark")),
			new Terrain("Rock", 	"A", 4, new Traversable(false), colorToTerrainVisualByName("Gray")),
			new Terrain("Snow", 	"*", 5, new Traversable(false), colorToTerrainVisualByName("White")),
		]
		var terrainsByName = ArrayHelper.addLookupsByName(terrains);
		var terrainsByCode = ArrayHelper.addLookups(terrains, (x: Terrain) => x.code);

		var map = new MapOfCells<any>
		(
			"Terrarium",
			mapSizeInCells,
			mapCellSize,
			null, // cellCreate
			(map: MapOfCells<any>, cellPosInCells: any, cellToOverwrite: MapCell) => // cellAtPosInCells
			{
				if (cellPosInCells.isInRangeMax(map.sizeInCellsMinusOnes))
				{
					var cellCode = map.cellSource[cellPosInCells.y][cellPosInCells.x];
					var cellTerrain = (terrainsByCode.get(cellCode) || terrains[0]);
					var cellVisualName = cellTerrain.name;
					var cellIsBlocking = cellTerrain.traversable.isBlocking;
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

		var mapAndCellPosToEntity = (map: MapOfCells<any>, cellPosInCells: Coords) =>
		{
			var cellVisuals = [];

			var cell = map.cellAtPosInCells(cellPosInCells);
			var cellTerrain = terrainsByName.get(cell.visualName);

			var cellTerrainVisuals = (cellTerrain.visual as VisualGroup).children;
			cellVisuals.push(cellTerrainVisuals[0]);

			var cellPosInPixels = cellPosInCells.clone().multiply(map.cellSize);

			var neighborTerrains = [];
			var neighborPos = Coords.create();
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
					var visualForBorder =
						(neighborTerrainToUse.visual as VisualGroup).children[borderVisualIndex];
					cellVisuals.push(visualForBorder);
				}
			}

			var cellVisual = new VisualGroup(cellVisuals);

			var cellAsEntity = new Entity
			(
				this.name + cellPosInCells.toString(),
				[
					new Boundable
					(
						new Box
						(
							Coords.create(), //cellPosInPixels,
							mapCellSize
						)
					),
					cellCollidable.clone(),
					Drawable.fromVisual(cellVisual),
					new Locatable(Disposition.fromPos(cellPosInPixels)),
					cellTerrain.traversable
				]
			);

			return cellAsEntity;
		};

		var mapCellsAsEntities = map.cellsAsEntities(mapAndCellPosToEntity);
		this.entities.push(...mapCellsAsEntities);

		var entityPosRange = new Box(size.clone().half(), size.clone().subtract(this.marginSize));
		var randomizer = this.randomizer;

		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Carnivore"), 1, null, entityPosRange, randomizer));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Doughnut"), 1, 12, entityPosRange, randomizer));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Flower"), 1, null, entityPosRange, randomizer));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Grass"), 12, null, entityPosRange, randomizer));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Grazer"), 3, null, entityPosRange, randomizer));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("MushroomGenerator"), 2, null, entityPosRange, randomizer));
		this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Tree"), 6, null, entityPosRange, randomizer));

		var randomizerSeed = this.randomizer.getNextRandom();
		var place = new PlaceRoom(this.name, "Demo", size, this.entities, randomizerSeed);

		return place;
	}

	build_Camera(cameraViewSize: Coords, placeSize: Coords): Entity
	{
		var cameraEntity = this.entityBuildCamera(cameraViewSize, placeSize);
		this.entities.push(cameraEntity);
		return cameraEntity;
	}

	build_Exterior(placePos: Coords, placeNamesToIncludePortalsTo: string[])
	{
		var entityDefns = this.entityDefnsByName;
		var entities = this.entities;

		var size = this.size;
		var entityPosRange = new Box(size.clone().half(), size.clone().subtract(this.marginSize));
		var randomizer = this.randomizer;

		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("EnemyGeneratorChaserNormal"), 1, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("EnemyGeneratorChaserCold"), 1, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("EnemyGeneratorChaserHeat"), 1, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("EnemyGeneratorRunnerNormal"), 1, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("EnemyGeneratorShooterNormal"), 1, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("EnemyGeneratorTankNormal"), 1, null, entityPosRange, randomizer));

		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Bar"), 1, null, entityPosRange, randomizer));
		//entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Mine"), 48, null, entityPosRange, randomizer));

		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Tree"), 10, null, entityPosRange, randomizer));

		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Armor"), 1, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Boulder"), 3, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Carnivore"), 1, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Crystal"), 2, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Flower"), 6, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Fruit"), 1, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("GrassGenerator"), 3, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Grazer"), 1, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Iron Ore"), 1, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Medicine"), 2, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("MushroomGenerator"), 1, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Pick"), 1, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Shovel"), 1, null, entityPosRange, randomizer));
		entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Speed Boots"), 1, null, entityPosRange, randomizer));

		var entityMineLoader = this.entityBuildLoader(entityDefns.get("Mine"), 48, entityPosRange, randomizer);
		entities.push(entityMineLoader);

		var entityRadioMessage =
			this.entityBuildRadioMessage(entityDefns.get("Friendly").drawable().visual, "This is " + this.name + ".");
		entities.push(entityRadioMessage);

		placeNamesToIncludePortalsTo.forEach(placeName =>
		{
			var entityDefnPortal = this.entityDefnsByName.get("Portal");
			var entityPortal = this.entityBuildFromDefn(entityDefnPortal, entityPosRange, randomizer);
			entityPortal.name = placeName;
			entityPortal.portal().destinationPlaceName = placeName;
			entities.push(entityPortal);
		});
		entities.push( this.entityBuildFromDefn( entityDefns.get("Store"), entityPosRange, randomizer) );
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
		var entityPosRange = new Box(this.size.clone().half(), this.size.clone().subtract(this.marginSize) );
		var entityRing = this.entityBuildFromDefn
		(
			entityDefns.get("Ring"), entityPosRange, this.randomizer
		);
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
		this.build_Camera(this.cameraViewSize, this.size);
	}

	build_SizeWallsAndMargins(namePrefix: string, placePos: Coords, areNeighborsConnectedESWN: boolean[])
	{
		this.size = this.size.clearZ();

		var wallThickness = this.entityBuildObstacleWalls
		(
			Color.byName("Gray"),
			areNeighborsConnectedESWN,
			namePrefix,
			placePos,
			0 // damagePerHit
		);

		var marginThickness = wallThickness * 8;
		var marginSize = new Coords(1, 1, 0).multiplyScalar(marginThickness);
		this.marginSize = marginSize;
	}

	// Constructor helpers.

	entityBuildCamera(cameraViewSize: Coords, placeSize: Coords)
	{
		var viewSizeHalf = cameraViewSize.clone().half();

		var cameraHeightAbovePlayfield = cameraViewSize.x;
		var cameraZ = 0 - cameraHeightAbovePlayfield;

		var cameraPosBox = Box.fromMinAndMax
		(
			viewSizeHalf.clone().zSet(cameraZ),
			placeSize.clone().subtract(viewSizeHalf).zSet(cameraZ)
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
			cameraLoc,
			Locatable.entitiesSortByZThenY
		);
		var cameraBoundable = new Boundable(camera.viewCollider);
		var cameraCollidable = Collidable.fromCollider(camera.viewCollider);
		var cameraConstrainable = new Constrainable
		([
			new Constraint_AttachToEntityWithName("Player"),
			new Constraint_ContainInBox(cameraPosBox)
		]);

		var cameraEntity = new Entity
		(
			Camera.name,
			[
				camera,
				cameraBoundable,
				cameraCollidable,
				cameraConstrainable,
				new Locatable(cameraLoc),
				Movable.create()
			]
		);
		return cameraEntity;
	}

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
				null, new Color(null, null, [1, 1, 1, 0.02]), null
			),
			true // expandViewStartAndEndByCell
		);
		var entityBackgroundBottom = new Entity
		(
			"BackgroundBottom",
			[
				new Locatable(Disposition.fromPos(new Coords(0, 0, camera.focalLength))),
				Drawable.fromVisual(visualBackgroundBottom),
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
				null, new Color(null, null, [1, 1, 1, 0.06]), null
			),
			true // expandViewStartAndEndByCell
		);
		var entityBackgroundTop = new Entity
		(
			"BackgroundTop",
			[
				Locatable.create(),
				Drawable.fromVisual(visualBackgroundTop),
			]
		);
		returnValues.push(entityBackgroundTop);

		return returnValues;
	}

	entityBuildExit(placeNameToReturnTo: string)
	{
		var entityPosRange = new Box(this.size.clone().half(), this.size.clone().subtract(this.marginSize) );
		var exit = this.entityBuildFromDefn(this.entityDefnsByName.get("Exit"), entityPosRange, this.randomizer);
		var exitPortal = exit.portal();
		exitPortal.destinationPlaceName = placeNameToReturnTo;
		exitPortal.destinationEntityName = this.name;
		this.entities.push(exit);
	}

	entitiesAllGround()
	{
		this.entities.forEach
		(
			(x: Entity) => { if (x.locatable() != null) { x.locatable().loc.pos.z = 0; } }
		);
	}

	entitiesBuildFromDefnAndCount
	(
		entityDefn: Entity, entityCount: number, itemQuantityPerEntity: number,
		posRange: Box, randomizer: Randomizer
	)
	{
		var returnEntities = [];

		for (var i = 0; i < entityCount; i++)
		{
			var entity = this.entityBuildFromDefn
			(
				entityDefn, posRange, randomizer
			);

			var entityItem = entity.item();
			if (entityItem != null)
			{
				entityItem.quantity = itemQuantityPerEntity || 1;
			}

			returnEntities.push(entity);
		}

		return returnEntities;
	}

	entityBuildFromDefn
	(
		entityDefn: Entity, posRange: Box, randomizer: Randomizer
	): Entity
	{
		var entity = entityDefn.clone();
		var entityLocatable = entity.locatable();
		if (entityLocatable != null)
		{
			entityLocatable.loc.pos.randomize
			(
				randomizer
			).multiply
			(
				posRange.size
			).add
			(
				posRange.min()
			);
		}

		return entity;
	}

	entityBuildGoal
	(
		entities: Entity[], entityDimension: number, entitySize: Coords, numberOfKeysToUnlockGoal: number
	)
	{
		var itemKeyColor = Color.byName("Yellow");
		var goalPos = Coords.create().randomize(this.randomizer).multiplyScalar
		(
			.5
		).addDimensions
		(
			.25, .25, 0
		).multiply
		(
			this.size
		);
		var goalLoc = Disposition.fromPos(goalPos);
		var goalColor = Color.byName("GreenDark");
		var goalVisual = new VisualGroup
		([
			VisualRectangle.fromSizeAndColorFill(entitySize, goalColor),
			VisualText.fromTextAndColor
			(
				"" + numberOfKeysToUnlockGoal, itemKeyColor
			)
		]);
		if (this.visualsHaveText)
		{
			goalVisual.children.push
			(
				new VisualOffset
				(
					VisualText.fromTextAndColor("Exit", goalColor),
					new Coords(0, 0 - entityDimension * 2, 0)
				)
			);
		}

		var goalEntity = new Entity
		(
			"Goal",
			[
				new Locatable(goalLoc),
				Collidable.fromCollider(new Box(Coords.create(), entitySize)),
				Drawable.fromVisual(goalVisual),
				new Goal(numberOfKeysToUnlockGoal),
			]
		);

		entities.push(goalEntity);

		return goalEntity;
	}

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
				Coords.create().randomize(this.randomizer).multiply(sizeMinusMargins).add(marginSize);

			var itemKeyCollider = new Sphere(Coords.create(), entityDimensionHalf);

			var itemKeyEntity = new Entity
			(
				itemDefnKeyName + i,
				[
					new Item(itemDefnKeyName, 1),
					new Locatable(Disposition.fromPos(itemKeyPos)),
					Collidable.fromCollider(itemKeyCollider),
					Drawable.fromVisual(itemKeyVisual),
				]
			);

			var place = ArrayHelper.random(places, this.randomizer);

			place.entityToSpawnAdd(itemKeyEntity);
		}
	}

	entityBuildLoader(entityDefn: Entity, entityCount: number, entityPosRange: Box, randomizer: Randomizer)
	{
		var placeBuilder = this;
		var loadable = new Loadable
		(
			(u: Universe, w: World, place: Place, e: Entity) => // load
			{
				var placeAsPlaceRoom = place as PlaceRoom;
				var randomizer = new RandomizerLCG(placeAsPlaceRoom.randomizerSeed, null, null, null);
				var entityPosRange = new Box(place.size.clone().half(), place.size.clone());
				var entitiesCreated = placeBuilder.entitiesBuildFromDefnAndCount
				(
					entityDefn, entityCount, null, entityPosRange, randomizer
				);
				place.entitiesToSpawnAdd
				(
					entitiesCreated
				);
			},
			(u: Universe, w: World, p: Place, e: Entity) => // unload
			{
				p.entitiesToRemove.push(...p.entities.filter(x => x.name.startsWith("Mine")));
			}
		);

		var returnValue = new Entity
		(
			"Loader" + entityDefn.name,
			[
				loadable
			]
		);

		return returnValue;
	}

	entityBuildObstacleWalls
	(
		wallColor: Color,
		areNeighborsConnectedESWN: boolean[],
		placeNamePrefix: string,
		placePos: Coords,
		damagePerHit: number
	)
	{
		areNeighborsConnectedESWN = areNeighborsConnectedESWN || [ false, false, false, false ];
		var entities = this.entities;
		var numberOfWalls = 4;
		var wallThickness = 5;
		var doorwayWidthHalf = wallThickness * 4;
		var portalSizeWE = new Coords(.25, 1, 0).multiplyScalar(2 * doorwayWidthHalf);
		var portalSizeNS = new Coords(1, .25, 0).multiplyScalar(2 * doorwayWidthHalf);

		var neighborOffsets =
		[
			new Coords(1, 0, 0),
			new Coords(0, 1, 0),
			new Coords(-1, 0, 0),
			new Coords(0, -1, 0)
		];

		var portalCollide =
			(u: Universe, w: World, p: Place, ePortal: Entity, eOther: Entity) =>
			{
				if (eOther.playable() != null)
				{
					var usable = ePortal.usable();
					if (usable == null)
					{
						var portal = ePortal.portal();
						portal.use(u, w, p, eOther, ePortal);
					}
				}
			};

		var forceFieldCollide =
			(u: Universe, w: World, p: Place, ePortal: Entity, eOther: Entity) =>
			{
				if (eOther.playable() != null)
				{
					var forceField = ePortal.forceField();
					if (forceField != null)
					{
						forceField.applyToEntity(eOther);
					}
				}
			};

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

			var wallCollider = new Box(Coords.create(), wallSize);
			var wallObstacle = new Obstacle();
			var wallCollidable = new Collidable
			(
				0, wallCollider, [ Movable.name ], wallObstacle.collide
			);
			var wallVisual = VisualRectangle.fromSizeAndColorFill(wallSize, wallColor);

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
						wallCollidable,
						Drawable.fromVisual(wallVisual),
						wallObstacle
					]
				);

				if (damagePerHit > 0)
				{
					var damager = new Damager(new Damage(10, null, null));
					wallEntity.propertyAddForPlace(damager, null);
				}

				entities.push(wallEntity);
			}

			if (isNeighborConnected)
			{
				var portalPos = wallPos.clone();
				var neighborOffset = neighborOffsets[i];
				var portalSize = (i % 2 == 0) ? portalSizeWE : portalSizeNS;
				portalPos.add
				(
					neighborOffset.clone().multiply(portalSize)
				);
				var neighborPos = placePos.clone().add(neighborOffset);
				var neighborName = placeNamePrefix + neighborPos.toStringXY();

				var portal = new Portal
				(
					neighborName,
					"PortalToNeighbor" + ((i + 2) % 4),
					neighborOffset.clone().double()
				);

				var portalBox = new Box(Coords.create(), portalSize);

				var collidable = new Collidable
				(
					0,
					portalBox,
					[ Playable.name ],
					portalCollide
				);

				var locatable = new Locatable(new Disposition(portalPos, null, null));

				var portalEntity = new Entity
				(
					"PortalToNeighbor" + i,
					[
						collidable,
						locatable,
						Movable.create(), // hack - For CollisionTracker.
						portal
					]
				);

				entities.push(portalEntity);

				var forceField = new ForceField
				(
					null, neighborOffset.clone().invert()
				)
				var forceFieldCollidable = new Collidable
				(
					0,
					portalBox,
					[ Playable.name ],
					forceFieldCollide
				);

				var forceFieldEntity = new Entity
				(
					"PortalToNeighbor" + i + "_ForceField",
					[
						forceFieldCollidable,
						forceField,
						locatable,
						Movable.create() // hack - For CollisionTracker.
					]
				);

				entities.push(forceFieldEntity);
			}

		}

		return wallThickness;
	}

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
								wordBubbleAsControl.toVenue()
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
	}

	entityDefnBuildStore(entityDimension: number): Entity
	{
		var storeColor = Color.byName("Brown");
		var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);
		var visual = new VisualGroup
		([
			VisualRectangle.fromSizeAndColorFill
			(
				new Coords(1, 1.5, 0).multiplyScalar(entityDimension),
				storeColor
			),
			new VisualOffset
			(
				VisualRectangle.fromSizeAndColorFill
				(
					new Coords(1.1, .2, 0).multiplyScalar(entityDimension),
					Color.byName("Gray")
				),
				new Coords(0, -.75, 0).multiplyScalar(entityDimension)
			),
		]);

		if (this.visualsHaveText)
		{
			visual.children.push
			(
				new VisualOffset
				(
					VisualText.fromTextAndColor("Store", storeColor),
					new Coords(0, 0 - entityDimension * 2, 0)
				)
			);
		}

		var storeEntityDefn = new Entity
		(
			"Store",
			[
				Collidable.fromCollider(new Box(Coords.create(), entitySize)),
				Drawable.fromVisual(visual),
				new ItemStore("Coin"),
				new ItemHolder
				(
					[
						new Item("Coin", 100),
						new Item("Bow", 1),
						new Item("Key", 10),
						new Item("Medicine", 100)
					],
					null, // weightMax
					null // reachRadius
				),
				Locatable.create(),
				new Usable
				(
					(u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity) =>
					{
						eUsed.itemStore().use(u, w, p, eUsing, eUsed);
						return null;
					}
				)
			]
		);

		return storeEntityDefn;
	}

	// Entity definitions.

	entityDefnBuildAccessory(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnAccessoryName = "Speed Boots";
		var itemAccessoryVisual = this.itemDefnsByName.get(itemDefnAccessoryName).visual;
		var itemAccessoryCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var itemAccessoryEntityDefn = new Entity
		(
			itemDefnAccessoryName,
			[
				new Item(itemDefnAccessoryName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemAccessoryCollider),
				Drawable.fromVisual(itemAccessoryVisual),
				Equippable.default()
			]
		);

		return itemAccessoryEntityDefn;
	}

	entityDefnBuildArmor(entityDimension: number): Entity
	{
		var itemDefnArmorName = "Armor";
		var itemDefn = this.itemDefnsByName.get(itemDefnArmorName);
		var itemArmorVisual = itemDefn.visual;
		var path = ((itemArmorVisual as VisualGroup).children[0] as VisualPolygon).verticesAsPath;
		var itemArmorCollider = new Sphere(Coords.create(), entityDimension / 2);
		var collidable = Collidable.fromCollider(itemArmorCollider);
		var box = new Box(Coords.create(), Coords.create() ).ofPoints(path.points);
		box.center = itemArmorCollider.center;
		var boundable = new Boundable(box);

		var itemArmorEntityDefn = new Entity
		(
			itemDefnArmorName,
			[
				new Armor(.5),
				boundable,
				collidable,
				Equippable.default(),
				new Item(itemDefnArmorName, 1),
				Locatable.create(),
				Drawable.fromVisual(itemArmorVisual),
			]
		);

		return itemArmorEntityDefn;
	}

	entityDefnBuildArrow(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnArrowName = "Arrow";

		var itemArrowVisual = this.itemDefnsByName.get(itemDefnArrowName).visual;

		var arrowSize = new Coords(1, 1, 1);

		var itemArrowCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var collidable = Collidable.fromCollider(itemArrowCollider);
		var bounds = new Box( itemArrowCollider.center, arrowSize);
		var boundable = new Boundable(bounds);

		var roundsPerPile = 5;

		var itemArrowEntityDefn = new Entity
		(
			itemDefnArrowName,
			[
				boundable,
				collidable,
				Drawable.fromVisual(itemArrowVisual),
				new Item(itemDefnArrowName, roundsPerPile),
				Locatable.create(),
			]
		);

		return itemArrowEntityDefn;
	}

	entityDefnBuildBomb(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnBombName = "Bomb";
		var itemBombVisual = this.itemDefnsByName.get(itemDefnBombName).visual;
		var itemBombCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var itemBombDevice = new Device
		(
			"Bomb",
			10, // ticksToCharge
			(u: Universe, w: World, p: Place, entity: Entity) => // initialize
			{
				// todo
			},
			(u: Universe, w: World, p: Place, e: Entity) => // update
			{
				// todo
			},
			(u: Universe, w: World, p: Place, entityUser: Entity, entityDevice: Entity) => // use
			{
				var userAsItemHolder = entityUser.itemHolder();
				var hasAmmo = userAsItemHolder.hasItemWithDefnNameAndQuantity("Bomb", 1);
				if (hasAmmo == false)
				{
					return;
				}

				userAsItemHolder.itemSubtractDefnNameAndQuantity("Bomb", 1);
				entityUser.equipmentUser().unequipItemsNoLongerHeld
				(
					u, w, p, entityUser
				);

				var userLoc = entityUser.locatable().loc;
				var userPos = userLoc.pos;
				var userVel = userLoc.vel;
				var userSpeed = userVel.magnitude();
				if (userSpeed == 0) { return; }

				var projectileDimension = 1.5;
				var projectileVisual = new VisualGroup
				([
					entityDevice.drawable().visual
					// todo - Add sparks?
				]);

				var userDirection = userVel.clone().normalize();
				var userRadius = (entityUser.collidable().collider as Sphere).radius;
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
					new Sphere(Coords.create(), projectileDimension);

				// todo
				var projectileCollide = null;
				var projectileDie = (u: Universe, w: World, p: Place, entityDying: Entity) =>
				{
					var explosionRadius = 32;
					var explosionVisual = VisualCircle.fromRadiusAndColorFill
					(
						explosionRadius, Color.byName("Yellow")
					);
					var explosionCollider = new Sphere(Coords.create(), explosionRadius);
					var explosionCollide = (universe: Universe, world: World, place: Place, entityProjectile: Entity, entityOther: Entity) =>
					{
						var killable = entityOther.killable();
						if (killable != null)
						{
							killable.damageApply
							(
								universe, world, place, entityProjectile,
								entityOther, entityProjectile.damager().damagePerHit
							);
						}
					};
					var explosionEntity = new Entity
					(
						"BombExplosion",
						[
							new Collidable(0, explosionCollider, [ Killable.name ], explosionCollide),
							new Damager(new Damage(20, null, null)),
							Drawable.fromVisual(explosionVisual),
							new Ephemeral(8, null),
							entityDying.locatable()
						]
					);
					p.entityToSpawnAdd(explosionEntity);
				}

				var projectileEntity = new Entity
				(
					"ProjectileBomb",
					[
						new Ephemeral(64, projectileDie),
						new Locatable( projectileLoc ),
						new Collidable
						(
							0,
							projectileCollider,
							[ Collidable.name ],
							projectileCollide
						),
						new Constrainable([new Constraint_FrictionXY(.03, .5)]),
						Drawable.fromVisual(projectileVisual),
						Equippable.default()
					]
				);

				p.entityToSpawnAdd(projectileEntity);
			}
		);

		var itemBombEntityDefn = new Entity
		(
			itemDefnBombName,
			[
				new Item(itemDefnBombName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemBombCollider),
				itemBombDevice,
				Drawable.fromVisual(itemBombVisual),
				Equippable.default()
			]
		);

		return itemBombEntityDefn;
	}

	entityDefnBuildBook(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnBookName = "Book";
		var itemBookVisual = this.itemDefnsByName.get(itemDefnBookName).visual;
		var itemBookCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var itemBookEntityDefn = new Entity
		(
			itemDefnBookName,
			[
				new Item(itemDefnBookName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemBookCollider),
				Drawable.fromVisual(itemBookVisual),
			]
		);

		return itemBookEntityDefn;
	}

	entityDefnBuildBow(entityDimension: number): Entity
	{
		entityDimension = entityDimension * 2;
		var itemDefnName = "Bow";

		var itemBowVisual = this.itemDefnsByName.get(itemDefnName).visual;

		var itemBowCollider = new Sphere(Coords.create(), entityDimension / 2);

		var itemBowUse = (u: Universe, w: World, p: Place, entityUser: Entity, entityDevice: Entity) => // use
		{
			var device = entityDevice.device();
			var tickCurrent = w.timerTicksSoFar;
			var ticksSinceUsed = tickCurrent - device.tickLastUsed;
			if (ticksSinceUsed < device.ticksToCharge)
			{
				return;
			}

			var userAsItemHolder = entityUser.itemHolder();
			var hasAmmo = userAsItemHolder.hasItemWithDefnNameAndQuantity("Arrow", 1);
			if (hasAmmo == false)
			{
				return;
			}

			userAsItemHolder.itemSubtractDefnNameAndQuantity("Arrow", 1);
			entityUser.equipmentUser().unequipItemsNoLongerHeld
			(
				u, w, p, entityUser
			);

			device.tickLastUsed = tickCurrent;

			var userLoc = entityUser.locatable().loc;
			var userPos = userLoc.pos;
			var userVel = userLoc.vel;
			var userSpeed = userVel.magnitude();
			if (userSpeed == 0) { return; }

			var projectileDimension = 1.5;

			var itemArrow = userAsItemHolder.itemsByDefnName("Arrow")[0];
			var itemArrowDefn = itemArrow.defn(w);
			var projectileVisual = itemArrowDefn.visual;

			var userDirection = userVel.clone().normalize();
			var userRadius = (entityUser.collidable().collider as Sphere).radius;
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
				new Sphere(Coords.create(), projectileDimension);

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

			var visualStrike = VisualCircle.fromRadiusAndColorFill(8, Color.byName("Red"));
			var killable = new Killable
			(
				1, // integrityMax
				null, // damageApply
				(universe: Universe, world: World, place: Place, entityKillable: Entity) => // die
				{
					var entityStrike = new Entity
					(
						"ArrowStrike",
						[
							new Ephemeral(8, null),
							Drawable.fromVisual(visualStrike),
							entityKillable.locatable()
						]
					);
					place.entityToSpawnAdd(entityStrike);
				}
			);

			var projectileEntity = new Entity
			(
				"ProjectileArrow",
				[
					new Damager(new Damage(10, null, null)),
					new Ephemeral(32, null),
					killable,
					new Locatable( projectileLoc ),
					new Collidable
					(
						0, // ticksToWaitBetweenCollisions
						projectileCollider,
						[ Killable.name ],
						projectileCollide
					),
					Drawable.fromVisual(projectileVisual),
				]
			);

			p.entityToSpawnAdd(projectileEntity);
		};

		var itemBowDevice = new Device
		(
			"Bow",
			10, // ticksToCharge
			(u: Universe, w: World, p: Place, entity: Entity) => // initialize
			{
				// todo
			},
			(u: Universe, w: World, p: Place, e: Entity) => // update
			{
				// todo
			},
			itemBowUse
		);

		var itemBowEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemBowCollider),
				Drawable.fromVisual(itemBowVisual),
				Equippable.default(),
				itemBowDevice
			]
		);

		return itemBowEntityDefn;
	}

	entityDefnBuildBread(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnBreadName = "Bread";
		var itemBreadVisual = this.itemDefnsByName.get(itemDefnBreadName).visual;
		var itemBreadCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var itemBreadEntityDefn = new Entity
		(
			itemDefnBreadName,
			[
				new Item(itemDefnBreadName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemBreadCollider),
				Drawable.fromVisual(itemBreadVisual),
			]
		);

		return itemBreadEntityDefn;
	}

	entityDefnBuildCar(entityDimension: number): Entity
	{
		entityDimension *= .75
		var defnName = "Car";

		var frames = new Array<Visual>();
		var frameSizeScaled = new Coords(4, 3, 0).multiplyScalar(entityDimension);

		var visualTileset = new VisualImageFromLibrary("Car");
		var tileSizeInPixels = new Coords(64, 48, 0);
		var tilesetSizeInTiles = new Coords(8, 4, 0);
		var tilePosInTiles = Coords.create();

		for (var y = 0; y < tilesetSizeInTiles.y; y++)
		{
			tilePosInTiles.y = y;

			for (var x = 0; x < tilesetSizeInTiles.x; x++)
			{
				tilePosInTiles.x = x;

				var regionPos = tileSizeInPixels.clone().multiply(tilePosInTiles);
				var regionToDrawAsBox =
					Box.fromMinAndSize(regionPos, tileSizeInPixels);

				var visualForFrame = new VisualImageScaledPartial
				(
					visualTileset,
					regionToDrawAsBox,
					frameSizeScaled
				);

				frames.push(visualForFrame);
			}
		}
		var carVisualBody = new VisualDirectional
		(
			frames[0], // visualForNoDirection
			frames, // visualsForDirections
			null // headingInTurnsGetForEntity
		);
		var carVisual = new VisualGroup
		([
			carVisualBody
		]);

		if (this.visualsHaveText)
		{
			carVisual.children.push
			(
				new VisualOffset
				(
					VisualText.fromTextAndColor(defnName, Color.byName("Blue")),
					new Coords(0, 0 - entityDimension * 2.5, 0)
				)
			);
		}

		var carCollider = new Sphere(Coords.create(), entityDimension / 2);

		var carCollide = (universe: Universe, world: World, place: Place, entityVehicle: Entity, entityOther: Entity) =>
		{
			if (entityOther.portal() != null)
			{
				var usable = entityOther.usable();
				if (usable == null)
				{
					var portal = entityOther.portal();
					portal.use(universe, world, place, entityVehicle, entityOther);
				}
			}
			else
			{
				universe.collisionHelper.collideEntitiesBlock(entityVehicle, entityOther);
			}
		};

		var carCollidable = new Collidable(0, carCollider, [Collidable.name], carCollide);

		var carConstrainable = new Constrainable
		([
			new Constraint_FrictionXY(.03, .2)
		]);

		var carLoc = Disposition.create();
		//carLoc.spin = new Rotation(Coords.Instances().ZeroZeroOne, new Reference(.01));
		var carUsable = new Usable
		(
			(u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity): string =>
			{
				var vehicle = eUsed.propertiesByName.get(Vehicle.name) as Vehicle;
				vehicle.entityOccupant = eUsing;
				p.entitiesToRemove.push(eUsing);
				return null;
			}
		);

		var vehicle = new Vehicle
		(
			.2, // accelerationPerTick
			5, // speedMax
			.01 // steeringAngleInTurns
		);

		var carEntityDefn = new Entity
		(
			defnName,
			[
				new Locatable(carLoc),
				carCollidable,
				carConstrainable,
				Drawable.fromVisual(carVisual),
				carUsable,
				vehicle
			]
		);

		return carEntityDefn;
	}

	entityDefnBuildCoin(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnCoinName = "Coin";
		var itemCoinVisual = this.itemDefnsByName.get(itemDefnCoinName).visual;
		var itemCoinCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var itemCoinEntityDefn = new Entity
		(
			itemDefnCoinName,
			[
				new Item(itemDefnCoinName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemCoinCollider),
				Drawable.fromVisual(itemCoinVisual),
			]
		);

		return itemCoinEntityDefn;
	}

	entityDefnBuildCrystal(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnCrystalName = "Crystal";
		var itemCrystalVisual = this.itemDefnsByName.get(itemDefnCrystalName).visual;
		var itemCrystalCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var itemCrystalEntityDefn = new Entity
		(
			itemDefnCrystalName,
			[
				Collidable.fromCollider(itemCrystalCollider),
				Drawable.fromVisual(itemCrystalVisual),
				new Item(itemDefnCrystalName, 1),
				Locatable.create()
			]
		);

		return itemCrystalEntityDefn;
	}

	entityDefnBuildDoughnut(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnDoughnutName = "Doughnut";
		var itemDoughnutVisual = this.itemDefnsByName.get(itemDefnDoughnutName).visual;
		var itemDoughnutCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var itemDoughnutEntityDefn = new Entity
		(
			itemDefnDoughnutName,
			[
				new Item(itemDefnDoughnutName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemDoughnutCollider),
				Drawable.fromVisual(itemDoughnutVisual),
			]
		);

		return itemDoughnutEntityDefn;
	}

	entityDefnBuildFlower(entityDimension: number): Entity
	{
		entityDimension *= .5;
		var itemDefnName = "Flower";
		var visual = this.itemDefnsByName.get(itemDefnName).visual;
		var collider = new Sphere(Coords.create(), entityDimension);

		var entityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				Locatable.create(),
				Collidable.fromCollider(collider),
				Drawable.fromVisual(visual)
			]
		);

		return entityDefn;
	}

	entityDefnBuildFruit(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnFruitName = "Fruit";
		var itemFruitVisual = this.itemDefnsByName.get(itemDefnFruitName).visual;
		var itemFruitCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var itemFruitEntityDefn = new Entity
		(
			itemDefnFruitName,
			[
				new Item(itemDefnFruitName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemFruitCollider),
				Drawable.fromVisual(itemFruitVisual)
			]
		);

		return itemFruitEntityDefn;
	}

	entityDefnBuildGenerator(entityDefnToGenerate: Entity): Entity
	{
		var generator = new EntityGenerator
		(
			entityDefnToGenerate,
			1200, // ticksToGenerate
			1 // entitiesGeneratedMax
		);

		var entityDefnGenerator = new Entity
		(
			entityDefnToGenerate.name + "Generator",
			[
				generator,
				Locatable.create()
			]
		);

		return entityDefnGenerator;
	}

	entityDefnBuildGrass(entityDimension: number): Entity
	{
		entityDimension /= 2;
		var itemDefnName = "Grass";

		var itemGrassVisual = this.itemDefnsByName.get(itemDefnName).visual;

		var itemGrassCollider = new Sphere(Coords.create(), entityDimension / 2);

		var itemGrassEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemGrassCollider),
				Drawable.fromVisual(itemGrassVisual)
			]
		);

		return itemGrassEntityDefn;
	}

	entityDefnBuildHeart(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnHeartName = "Heart";
		var itemHeartVisual = this.itemDefnsByName.get(itemDefnHeartName).visual;
		var itemHeartCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var itemHeartEntityDefn = new Entity
		(
			itemDefnHeartName,
			[
				new Item(itemDefnHeartName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemHeartCollider),
				Drawable.fromVisual(itemHeartVisual)
			]
		);

		return itemHeartEntityDefn;
	}

	entityDefnBuildIron(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnIronName = "Iron";
		var itemIronVisual = this.itemDefnsByName.get(itemDefnIronName).visual;
		var itemIronCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var itemIronEntityDefn = new Entity
		(
			itemDefnIronName,
			[
				new Item(itemDefnIronName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemIronCollider),
				Drawable.fromVisual(itemIronVisual)
			]
		);

		return itemIronEntityDefn;
	}

	entityDefnBuildIronOre(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnOreName = "Iron Ore";
		var itemOreVisual = this.itemDefnsByName.get(itemDefnOreName).visual;
		var itemOreCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var itemOreEntityDefn = new Entity
		(
			itemDefnOreName,
			[
				new Item(itemDefnOreName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemOreCollider),
				Drawable.fromVisual(itemOreVisual)
			]
		);

		return itemOreEntityDefn;
	}

	entityDefnBuildLog(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnLogName = "Log";
		var itemLogVisual = this.itemDefnsByName.get(itemDefnLogName).visual;
		var itemLogCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var itemLogEntityDefn = new Entity
		(
			itemDefnLogName,
			[
				new Item(itemDefnLogName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemLogCollider),
				Drawable.fromVisual(itemLogVisual)
			]
		);

		return itemLogEntityDefn;
	}

	entityDefnBuildMeat(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnMeatName = "Meat";
		var itemMeatDefn = this.itemDefnsByName.get(itemDefnMeatName);
		var itemMeatVisual = itemMeatDefn.visual;
		var itemMeatCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var itemMeatEntityDefn = new Entity
		(
			itemDefnMeatName,
			[
				new Item(itemDefnMeatName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemMeatCollider),
				Drawable.fromVisual(itemMeatVisual),
				new Usable(itemMeatDefn.use)
			]
		);

		return itemMeatEntityDefn;
	}

	entityDefnBuildMedicine(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnMedicineName = "Medicine";
		var itemMedicineVisual = this.itemDefnsByName.get(itemDefnMedicineName).visual;
		var itemMedicineCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var itemMedicineEntityDefn = new Entity
		(
			itemDefnMedicineName,
			[
				new Item(itemDefnMedicineName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemMedicineCollider),
				Drawable.fromVisual(itemMedicineVisual),
				Equippable.default()
			]
		);

		return itemMedicineEntityDefn;
	}

	entityDefnBuildMushroom(entityDimension: number): Entity
	{
		entityDimension /= 2;
		var itemDefnName = "Mushroom";

		var itemMushroomVisual = this.itemDefnsByName.get(itemDefnName).visual;

		var itemMushroomCollider = new Sphere(Coords.create(), entityDimension / 2);

		var itemMushroomEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemMushroomCollider),
				Drawable.fromVisual(itemMushroomVisual)
			]
		);

		return itemMushroomEntityDefn;
	}

	entityDefnBuildPick(entityDimension: number): Entity
	{
		var itemDefnName = "Pick";
		var itemPickVisual = this.itemDefnsByName.get(itemDefnName).visual;

		var itemPickCollider = new Sphere(Coords.create(), entityDimension / 2);

		var itemPickDevice = new Device
		(
			"Pick",
			10, // ticksToCharge
			null, // initialize: (u: Universe, w: World, p: Place, e: Entity) => void,
			null, // update: (u: Universe, w: World, p: Place, e: Entity) => void,
			(u: Universe, w: World, p: Place, eUser: Entity, eDevice: Entity) => // use
			{
				var bouldersInPlace = p.entities.filter(x => x.name.startsWith("Boulder"));
				var rangeMax = 20; // todo
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
				Locatable.create(),
				Collidable.fromCollider(itemPickCollider),
				itemPickDevice,
				Drawable.fromVisual(itemPickVisual),
				Equippable.default()
			]
		);

		return itemPickEntityDefn;
	}

	entityDefnBuildPotion(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var itemDefnPotionName = "Potion";
		var itemPotionColor = Color.byName("Blue");
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
				Color.byName("White")
			)
		]);
		if (this.visualsHaveText)
		{
			itemPotionVisual.children.push
			(
				new VisualOffset
				(
					VisualText.fromTextAndColor(itemDefnPotionName, itemPotionColor),
					new Coords(0, 0 - entityDimension, 0)
				)
			);
		}
		var itemPotionCollider = new Sphere(Coords.create(), entityDimensionHalf);

		var itemPotionEntityDefn = new Entity
		(
			itemDefnPotionName,
			[
				new Item(itemDefnPotionName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemPotionCollider),
				Drawable.fromVisual(itemPotionVisual)
			]
		);

		return itemPotionEntityDefn;
	}

	entityDefnBuildShovel(entityDimension: number): Entity
	{
		var itemDefnName = "Shovel";
		var itemShovelVisual = this.itemDefnsByName.get(itemDefnName).visual;

		var itemShovelCollider = new Sphere(Coords.create(), entityDimension / 2);

		var itemShovelDevice = new Device
		(
			"Shovel",
			10, // ticksToCharge
			null, // initialize: (u: Universe, w: World, p: Place, e: Entity) => void,
			null, // update: (u: Universe, w: World, p: Place, e: Entity) => void,
			(u: Universe, w: World, p: Place, eUser: Entity, eDevice: Entity) => // use
			{
				var holesInPlace = p.entities.filter(x => x.name.startsWith("Hole"));
				var rangeMax = 20; // todo
				var holeInRange = holesInPlace.filter
				(
					x => x.locatable().distanceFromEntity(eUser) < rangeMax
				)[0];
				if (holeInRange != null)
				{
					var isHoleEmpty = (holeInRange.itemHolder().items.length == 0);
					if (isHoleEmpty)
					{
						p.entitiesToRemove.push(holeInRange);
					}
					else
					{
						var holeInRangePerceptible = holeInRange.perceptible();
						holeInRangePerceptible.isHiding =
							(holeInRangePerceptible.isHiding == false);
					}
				}
				else
				{
					eUser.locatable().entitySpawnWithDefnName(u, w, p, eUser, "Hole");
				}
			}
		);

		var itemShovelEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemShovelCollider),
				itemShovelDevice,
				Drawable.fromVisual(itemShovelVisual),
				Equippable.default()
			]
		);

		return itemShovelEntityDefn;
	}

	entityDefnBuildSword(entityDimension: number, damageTypeName: string): Entity
	{
		var itemDefnName = "Sword";

		if (damageTypeName == null)
		{
			// todo
		}
		else if (damageTypeName == "Cold")
		{
			itemDefnName += damageTypeName;
		}
		else if (damageTypeName == "Heat")
		{
			itemDefnName += damageTypeName;
		}

		var itemSwordCollider = new Sphere(Coords.create(), entityDimension / 2);

		var itemSwordDeviceUse =
			(universe: Universe, world: World, place: Place, entityUser: Entity, entityDevice: Entity) => // use
		{
			var userLoc = entityUser.locatable().loc;
			var userPos = userLoc.pos;
			var userVel = userLoc.vel;
			var userSpeed = userVel.magnitude();
			if (userSpeed == 0) { return; }

			var userTirable = entityUser.tirable();
			var staminaToFire = 10;
			if (userTirable.stamina < staminaToFire)
			{
				var message = "Too tired!";
				place.entitySpawn
				(
					universe, world,
					universe.entityBuilder.messageFloater
					(
						message,
						userPos.clone(),
						Color.byName("Red")
					)
				);

				return;
			}

			userTirable.staminaSubtract(staminaToFire);

			var userDirection = userVel.clone().normalize();
			var userRadius = (entityUser.collidable().collider as Sphere).radius;
			var projectileDimension = 1.5;

			var projectilePos = userPos.clone().add
			(
				userDirection.clone().multiplyScalar(userRadius + projectileDimension).double()
			);
			var projectileOri = new Orientation
			(
				userVel.clone().normalize(), null
			);

			var projectileVisual = entityDevice.drawable().visual;
			projectileVisual = (projectileVisual as VisualGroup).children[0].clone();
			projectileVisual.transform(new Transform_RotateRight(1));

			var projectileLoc = new Disposition(projectilePos, projectileOri, null);
			projectileLoc.vel.overwriteWith(userVel).clearZ().double();

			var projectileCollider =
				new Sphere(Coords.create(), projectileDimension);

			var projectileCollide = (universe: Universe, world: World, place: Place, entityProjectile: Entity, entityOther: Entity) =>
			{
				var killable = entityOther.killable();
				if (killable != null)
				{
					var damageToApply = entityProjectile.damager().damagePerHit;
					killable.damageApply
					(
						universe, world, place, entityProjectile, entityOther, damageToApply
					);
					entityProjectile.killable().integrity = 0;
				}
			};

			var visualStrike = VisualCircle.fromRadiusAndColorFill(8, Color.byName("Red"));
			var killable = new Killable
			(
				1, // integrityMax
				null, // damageApply
				(universe: Universe, world: World, place: Place, entityKillable: Entity) => // die
				{
					var entityStrike = new Entity
					(
						"SwordStrike",
						[
							new Ephemeral(8, null),
							Drawable.fromVisual(visualStrike),
							entityKillable.locatable()
						]
					);
					place.entityToSpawnAdd(entityStrike);
				}
			);

			var effectsAndChances = new Array<[Effect, number]>();
			if (damageTypeName != null)
			{
				var effect: Effect;
				if (damageTypeName == "Cold")
				{
					effect = Effect.Instances().Frozen;
				}
				else if (damageTypeName == "Heat")
				{
					effect = Effect.Instances().Burning;
				}
				else
				{
					throw("Unrecognized damage type: " + damageTypeName);
				}
				var effectAndChance: [Effect, number] = [ effect, 1 ];
				effectsAndChances = [ effectAndChance ];
			}

			var projectileDamager = new Damager(new Damage(10, damageTypeName, effectsAndChances ));

			var projectileEntity = new Entity
			(
				"ProjectileSword",
				[
					projectileDamager,
					new Ephemeral(8, null),
					killable,
					new Locatable(projectileLoc),
					new Collidable
					(
						0, projectileCollider, [ Killable.name ], projectileCollide
					),
					Drawable.fromVisual(projectileVisual)
				]
			);

			place.entityToSpawnAdd(projectileEntity);
		}

		var itemSwordDevice = new Device
		(
			itemDefnName,
			10, // ticksToCharge
			null, // init
			null, // update
			itemSwordDeviceUse
		);

		var itemSwordVisual = this.itemDefnsByName.get
		(
			itemDefnName
		).visual.clone();

		itemSwordVisual.transform
		(
			new Transform_Translate(new Coords(0, -1.1 * entityDimension, 0))
		);

		var itemSwordEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemSwordCollider),
				Drawable.fromVisual(itemSwordVisual),
				itemSwordDevice,
				Equippable.default()
			]
		);

		return itemSwordEntityDefn;
	}

	entityDefnBuildToolset(entityDimension: number)
	{
		var itemDefnName = "Toolset";

		var itemToolsetVisual = this.itemDefnsByName.get(itemDefnName).visual;

		var itemToolsetCollider = new Sphere(Coords.create(), entityDimension / 2);

		var itemToolsetEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemToolsetCollider),
				Drawable.fromVisual(itemToolsetVisual)
			]
		);

		return itemToolsetEntityDefn;
	}

	entityDefnBuildTorch(entityDimension: number)
	{
		var itemDefnName = "Torch";

		var itemTorchVisual = this.itemDefnsByName.get(itemDefnName).visual;

		var itemTorchCollider = new Sphere(Coords.create(), entityDimension / 2);

		var itemTorchEntityDefn = new Entity
		(
			itemDefnName,
			[
				Animatable2.create(),
				new Item(itemDefnName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemTorchCollider),
				Drawable.fromVisual(itemTorchVisual)
			]
		);

		return itemTorchEntityDefn;
	}

	entityDefnBuildWeight(entityDimension: number)
	{
		var itemDefnName = "Weight";

		var itemWeightVisual = this.itemDefnsByName.get(itemDefnName).visual;

		var itemWeightCollider = new Sphere(Coords.create(), entityDimension / 2);

		var itemWeightEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Item(itemDefnName, 1),
				Locatable.create(),
				Collidable.fromCollider(itemWeightCollider),
				Drawable.fromVisual(itemWeightVisual)
			]
		);

		return itemWeightEntityDefn;
	}

	entityDefnsBuild(entityDimension: number): Entity[]
	{
		var entityDefnFlower = this.entityDefnBuildFlower(entityDimension);
		var entityDefnGrass = this.entityDefnBuildGrass(entityDimension);
		var entityDefnMushroom = this.entityDefnBuildMushroom(entityDimension);
		var eb = this.emplacementsBuilder;
		var mb = this.moversBuilder;

		var entityDefns =
		[
			eb.entityDefnBuildAnvil(entityDimension),
			eb.entityDefnBuildBoulder(entityDimension),
			eb.entityDefnBuildCampfire(entityDimension),
			eb.entityDefnBuildContainer(entityDimension),
			eb.entityDefnBuildExit(entityDimension),
			eb.entityDefnBuildHole(entityDimension),
			eb.entityDefnBuildPortal(entityDimension),
			eb.entityDefnBuildObstacleBar(entityDimension),
			eb.entityDefnBuildObstacleMine(entityDimension),
			eb.entityDefnBuildObstacleRing(entityDimension),
			eb.entityDefnBuildPillow(entityDimension),
			eb.entityDefnBuildTree(entityDimension),
			eb.entityDefnBuildTrafficCone(entityDimension),

			mb.entityDefnBuildEnemyGeneratorChaser(entityDimension, null),
			mb.entityDefnBuildEnemyGeneratorChaser(entityDimension, "Cold"),
			mb.entityDefnBuildEnemyGeneratorChaser(entityDimension, "Heat"),
			mb.entityDefnBuildEnemyGeneratorRunner(entityDimension, null),
			mb.entityDefnBuildEnemyGeneratorShooter(entityDimension, null),
			mb.entityDefnBuildEnemyGeneratorTank(entityDimension, null),

			mb.entityDefnBuildCarnivore(entityDimension),
			mb.entityDefnBuildFriendly(entityDimension),
			mb.entityDefnBuildGrazer(entityDimension),
			mb.entityDefnBuildPlayer(entityDimension, this.cameraViewSize),

			this.entityDefnBuildAccessory(entityDimension),
			this.entityDefnBuildArmor(entityDimension),
			this.entityDefnBuildArrow(entityDimension),
			this.entityDefnBuildBomb(entityDimension),
			this.entityDefnBuildBook(entityDimension),
			this.entityDefnBuildBow(entityDimension),
			this.entityDefnBuildBread(entityDimension),
			this.entityDefnBuildCar(entityDimension),
			this.entityDefnBuildCoin(entityDimension),
			this.entityDefnBuildCrystal(entityDimension),
			this.entityDefnBuildDoughnut(entityDimension),
			entityDefnFlower,
			this.entityDefnBuildFruit(entityDimension),
			this.entityDefnBuildGenerator(entityDefnFlower),
			this.entityDefnBuildHeart(entityDimension),
			this.entityDefnBuildIron(entityDimension),
			this.entityDefnBuildIronOre(entityDimension),
			this.entityDefnBuildLog(entityDimension),
			this.entityDefnBuildMedicine(entityDimension),
			this.entityDefnBuildMeat(entityDimension),
			entityDefnMushroom,
			this.entityDefnBuildGenerator(entityDefnMushroom),
			entityDefnGrass,
			this.entityDefnBuildGenerator(entityDefnGrass),
			this.entityDefnBuildPick(entityDimension),
			this.entityDefnBuildPotion(entityDimension),
			this.entityDefnBuildShovel(entityDimension),
			this.entityDefnBuildStore(entityDimension),
			this.entityDefnBuildSword(entityDimension, null),
			this.entityDefnBuildSword(entityDimension, "Cold"),
			this.entityDefnBuildSword(entityDimension, "Heat"),
			this.entityDefnBuildToolset(entityDimension),
			this.entityDefnBuildTorch(entityDimension),
			this.entityDefnBuildWeight(entityDimension),
		];
		return entityDefns;
	}
}
