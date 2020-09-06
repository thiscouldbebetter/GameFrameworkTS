"use strict";
class PlaceBuilderDemo // Main.
 {
    constructor(randomizer, cameraViewSize) {
        this.randomizer = randomizer || RandomizerLCG.default();
        this.visualsHaveText = false;
        var entityDimension = 10;
        this.actionsBuilder = new PlaceBuilderDemo_Actions(this);
        this.emplacementsBuilder = new PlaceBuilderDemo_Emplacements(this);
        this.itemsBuilder = new PlaceBuilderDemo_Items(this, entityDimension);
        this.moversBuilder = new PlaceBuilderDemo_Movers(this);
        this.actions = this.actionsBuilder.actionsBuild();
        this.actionToInputsMappings = this.actionsBuilder.actionToInputsMappingsBuild();
        this.activityDefns = [];
        this.cameraViewSize = cameraViewSize;
        this.itemDefns = this.itemsBuilder.itemDefnsBuild();
        this.itemDefnsByName = ArrayHelper.addLookupsByName(this.itemDefns);
        this.entityDefns = this.entityDefnsBuild(entityDimension);
        this.entityDefnsByName = ArrayHelper.addLookupsByName(this.entityDefns);
        this.fontHeight = 10;
    }
    buildBase(size, placeNameToReturnTo) {
        this.build_Interior("Base", size, placeNameToReturnTo);
        var entityPosRange = new Box(size.clone().half(), size.clone().subtract(this.marginSize));
        var randomizer = this.randomizer;
        var entityDefns = this.entityDefnsByName;
        this.entities.push(this.entityBuildFromDefn(entityDefns.get("Player"), entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Anvil"), 1, null, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Arrow"), 1, 20, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Bomb"), 3, null, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Book"), 1, null, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Bow"), 1, null, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Bread"), 1, 5, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Campfire"), 1, null, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Car"), 1, null, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Doughnut"), 1, 12, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Friendly"), 1, null, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Heart"), 1, null, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Meat"), 1, null, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Pillow"), 1, null, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Sword"), 1, null, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("SwordCold"), 1, null, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("SwordHeat"), 1, null, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Toolset"), 1, null, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Torch"), 1, null, entityPosRange, randomizer));
        this.entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Weight"), 1, null, entityPosRange, randomizer));
        var container = this.entityBuildFromDefn(entityDefns.get("Container"), entityPosRange, randomizer);
        var itemEntityOre = this.entityBuildFromDefn(entityDefns.get("Iron Ore"), entityPosRange, randomizer);
        itemEntityOre.item().quantity = 3; // For crafting.
        container.itemHolder().itemEntityAdd(itemEntityOre);
        this.entities.push(container);
        var randomizerSeed = this.randomizer.getNextRandom();
        var place = new PlaceRoom(this.name, "Demo", size, this.entities, randomizerSeed);
        return place;
    }
    buildBattlefield(size, placePos, areNeighborsConnectedESWN, isGoal, placeNamesToIncludePortalsTo) {
        var namePrefix = "Battlefield";
        this.name = namePrefix + placePos.toStringXY();
        this.size = size;
        this.entities = [];
        this.build_SizeWallsAndMargins(namePrefix, placePos, areNeighborsConnectedESWN);
        this.build_Exterior(placePos, placeNamesToIncludePortalsTo);
        if (isGoal) {
            var entityDimension = 10;
            this.build_Goal(entityDimension);
        }
        this.entitiesAllGround();
        var entityCamera = this.build_Camera(this.cameraViewSize, this.size);
        this.entities.splice(0, 0, ...this.entityBuildBackground(entityCamera.camera()));
        var randomizerSeed = this.randomizer.getNextRandom();
        var place = new PlaceRoom(this.name, "Demo", size, this.entities, randomizerSeed);
        return place;
    }
    buildTunnels(size, placeNameToReturnTo) {
        size = size.clone().multiplyScalar(4);
        this.build_Interior("Tunnels", size, placeNameToReturnTo);
        var randomizerSeed = this.randomizer.getNextRandom();
        var networkNodeCount = 24;
        var network = Network.random(networkNodeCount, this.randomizer);
        network = network.transform(new Transform_Scale(size));
        var tunnelsVisual = new VisualNetwork(network);
        var tunnelsEntity = new Entity("Tunnels", [
            new Drawable(tunnelsVisual, null),
            new DrawableCamera(),
            new Locatable(null)
        ]);
        this.entities.push(tunnelsEntity);
        var place = new PlaceRoom(this.name, "Demo", size, this.entities, randomizerSeed);
        return place;
    }
    buildZoned(size, placeNameToReturnTo) {
        this.entities = [];
        this.entityBuildExit(placeNameToReturnTo);
        var zones = [];
        var placeSizeInZones = new Coords(3, 3, 1);
        var zonePosInZones = new Coords(0, 0, 0);
        var zoneSize = size;
        var neighborOffsets = [
            new Coords(1, 0, 0),
            new Coords(1, 1, 0),
            new Coords(0, 1, 0),
            new Coords(-1, 1, 0),
            new Coords(-1, 0, 0),
            new Coords(-1, -1, 0),
            new Coords(0, -1, 0),
            new Coords(1, -1, 0)
        ];
        var neighborPos = new Coords(0, 0, 0);
        var boxZeroes = new Box(new Coords(0, 0, 0), new Coords(0, 0, 0));
        for (var y = 0; y < placeSizeInZones.y; y++) {
            zonePosInZones.y = y;
            for (var x = 0; x < placeSizeInZones.x; x++) {
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
                var neighborNames = neighborOffsets.map(x => "Zone" + neighborPos.overwriteWith(x).add(zonePosInZones).wrapToRangeMax(placeSizeInZones).toStringXY());
                var entityBoulderCorner = this.entityBuildFromDefn(this.entityDefnsByName.get("Boulder"), boxZeroes, this.randomizer);
                var zone = new Zone("Zone" + zonePosInZones.toStringXY(), Box.fromMinAndSize(zonePos, zoneSize), neighborNames, [
                    entityBoulderCorner
                ]);
                zones.push(zone);
            }
        }
        var zoneStart = zones[0];
        zoneStart.entities.push(...this.entities);
        var zonesByName = ArrayHelper.addLookupsByName(zones);
        var posInZones = new Coords(0, 0, 0);
        var placeSize = placeSizeInZones.clone().multiply(zoneSize);
        var place = new PlaceZoned("Zoned", // name
        "Demo", // defnName
        placeSize, "Player", // entityToFollowName
        zoneStart.name, // zoneStartName
        (zoneName) => zonesByName.get(zoneName), (posToCheck) => // zoneAtPos
         zonesByName.get("Zone" + posInZones.overwriteWith(posToCheck).divide(zoneSize).floor().toStringXY()));
        var entityCamera = this.build_Camera(this.cameraViewSize, place.size);
        zoneStart.entities.push(entityCamera);
        return place;
    }
    buildTerrarium(size, placeNameToReturnTo) {
        size = size.clone().multiplyScalar(2);
        //this.build_Interior("Terrarium", size, placeNameToReturnTo);
        this.name = "Terrarium";
        this.size = size;
        this.entities = [];
        this.build_SizeWallsAndMargins(this.name, null, null);
        this.entitiesAllGround();
        this.build_Camera(this.cameraViewSize, this.size);
        // todo
        var mapCellSource = [
            "....................::::QQAA****",
            "...~~~~~~~~~~~~~.....:::QQAAA***",
            "~~~~~~~~~~~~~~.....:QQQQQQAAAAAA",
            "~~........~~~~....::QQQQQQAAAAAA",
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
        var mapSizeInCells = new Coords(mapCellSource[0].length, mapCellSource.length, 1);
        var mapCellSize = size.clone().divide(mapSizeInCells).ceiling();
        var entityExitPosRange = new Box(mapCellSize.clone().half(), null);
        var exit = this.entityBuildFromDefn(this.entityDefnsByName.get("Exit"), entityExitPosRange, this.randomizer);
        exit.portal().destinationPlaceName = placeNameToReturnTo;
        exit.portal().destinationEntityName = this.name;
        this.entities.push(exit);
        var cellCollider = new Box(new Coords(0, 0, 0), mapCellSize);
        var cellCollide = (u, w, p, e0, e1) => {
            var traversable = e0.traversable();
            if (traversable != null) {
                if (traversable.isBlocking) {
                    u.collisionHelper.collideEntitiesReverseVelocities(e0, e1);
                }
            }
        };
        var cellCollidable = new Collidable(cellCollider, [Playable.name], cellCollide);
        var neighborOffsets = [
            // e, se, s, sw, w, nw, n, ne
            new Coords(1, 0, 0), new Coords(1, 1, 0), new Coords(0, 1, 0),
            new Coords(-1, 1, 0), new Coords(-1, 0, 0), new Coords(-1, -1, 0),
            new Coords(0, -1, 0), new Coords(1, -1, 0)
        ];
        var colorToTerrainVisualsByName = (colorName) => {
            var color = Color.byName(colorName);
            var borderWidthAsFraction = .25;
            var borderSizeCorner = mapCellSize.clone().multiplyScalar(borderWidthAsFraction).ceiling();
            var borderSizeVerticalHalf = mapCellSize.clone().multiply(new Coords(borderWidthAsFraction, .5, 0)).ceiling();
            var borderSizeHorizontalHalf = mapCellSize.clone().multiply(new Coords(.5, borderWidthAsFraction, 0)).ceiling();
            var isCenteredFalse = false;
            var visualsByName = new Map([
                ["Center", new VisualRectangle(mapCellSize, color, null, isCenteredFalse)],
                [
                    "InsideSE",
                    new VisualGroup([
                        // s
                        new VisualOffset(new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), new Coords(mapCellSize.x / 2, mapCellSize.y - borderSizeCorner.y, 0)),
                        // e
                        new VisualOffset(new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), new Coords(mapCellSize.x - borderSizeCorner.x, mapCellSize.y / 2, 0))
                    ])
                ],
                [
                    "InsideSW",
                    new VisualGroup([
                        // s
                        new VisualOffset(new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), new Coords(0, mapCellSize.y - borderSizeCorner.y, 0)),
                        // w
                        new VisualOffset(new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), new Coords(0, mapCellSize.y / 2, 0))
                    ])
                ],
                [
                    "InsideNW",
                    new VisualGroup([
                        // n
                        new VisualOffset(new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), new Coords(0, 0, 0)),
                        // w
                        new VisualOffset(new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), new Coords(0, 0, 0))
                    ])
                ],
                [
                    "InsideNE",
                    new VisualGroup([
                        // n
                        new VisualOffset(new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), new Coords(mapCellSize.x / 2, 0, 0)),
                        // e
                        new VisualOffset(new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), new Coords(mapCellSize.x - borderSizeCorner.x, 0, 0)),
                    ])
                ],
                [
                    "OutsideSE",
                    new VisualOffset(new VisualRectangle(borderSizeCorner, color, null, isCenteredFalse), new Coords(0, 0, 0))
                ],
                [
                    "OutsideSW",
                    new VisualOffset(new VisualRectangle(borderSizeCorner, color, null, isCenteredFalse), new Coords(mapCellSize.x - borderSizeCorner.x, 0, 0))
                ],
                [
                    "OutsideNW",
                    new VisualOffset(new VisualRectangle(borderSizeCorner, color, null, isCenteredFalse), new Coords(mapCellSize.x - borderSizeCorner.x, mapCellSize.y - borderSizeCorner.y, 0))
                ],
                [
                    "OutsideNE",
                    new VisualOffset(new VisualRectangle(borderSizeCorner, color, null, isCenteredFalse), new Coords(0, mapCellSize.y - borderSizeCorner.y, 0))
                ],
                [
                    "ETop",
                    new VisualOffset(new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), new Coords(mapCellSize.x - borderSizeCorner.x, 0, 0))
                ],
                [
                    "EBottom",
                    new VisualOffset(new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), new Coords(mapCellSize.x - borderSizeCorner.x, mapCellSize.y / 2, 0))
                ],
                [
                    "SRight",
                    new VisualOffset(new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), new Coords(mapCellSize.x / 2, mapCellSize.y - borderSizeCorner.y, 0))
                ],
                [
                    "SLeft",
                    new VisualOffset(new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), new Coords(0, mapCellSize.y - borderSizeCorner.y, 0))
                ],
                [
                    "WBottom",
                    new VisualOffset(new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), new Coords(0, mapCellSize.y / 2, 0))
                ],
                [
                    "WTop",
                    new VisualOffset(new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), new Coords(0, 0, 0))
                ],
                [
                    "NLeft",
                    new VisualOffset(new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), new Coords(0, 0, 0))
                ],
                [
                    "NRight",
                    new VisualOffset(new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), new Coords(mapCellSize.x / 2, 0, 0))
                ]
            ]);
            var visualNamesInOrder = [
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
            var visualsInOrder = visualNamesInOrder.map((x) => visualsByName.get(x));
            return visualsInOrder;
        };
        var terrains = [
            //name, codeChar, level, isBlocking, visual
            new Terrain("Water", "~", 0, new Traversable(true), colorToTerrainVisualsByName("Blue")),
            new Terrain("Sand", ".", 1, new Traversable(false), colorToTerrainVisualsByName("Tan")),
            new Terrain("Grass", ":", 2, new Traversable(false), colorToTerrainVisualsByName("Green")),
            new Terrain("Trees", "Q", 3, new Traversable(false), colorToTerrainVisualsByName("GreenDark")),
            new Terrain("Rock", "A", 4, new Traversable(false), colorToTerrainVisualsByName("Gray")),
            new Terrain("Snow", "*", 5, new Traversable(false), colorToTerrainVisualsByName("White")),
        ];
        var terrainsByName = ArrayHelper.addLookupsByName(terrains);
        var terrainsByCodeChar = ArrayHelper.addLookups(terrains, (x) => x.codeChar);
        var map = new MapOfCells("Terrarium", mapSizeInCells, mapCellSize, new MapCell(), // cellPrototype
        (map, cellPosInCells, cellToOverwrite) => // cellAtPosInCells
         {
            if (cellPosInCells.isInRangeMax(map.sizeInCellsMinusOnes)) {
                var cellCode = map.cellSource[cellPosInCells.y][cellPosInCells.x];
                var cellTerrain = (terrainsByCodeChar.get(cellCode) || terrains[0]);
                var cellVisualName = cellTerrain.name;
                var cellIsBlocking = cellTerrain.isBlocking;
                var cellToOverwriteAsAny = cellToOverwrite;
                cellToOverwriteAsAny.visualName = cellVisualName;
                cellToOverwriteAsAny.isBlocking = cellIsBlocking;
            }
            else {
                cellToOverwrite = null;
            }
            return cellToOverwrite;
        }, mapCellSource);
        var mapAndCellPosToEntity = (map, cellPosInCells) => {
            var cellVisuals = [];
            var cell = map.cellAtPosInCells(cellPosInCells);
            var cellTerrain = terrainsByName.get(cell.visualName);
            var cellTerrainVisuals = cellTerrain.visuals;
            cellVisuals.push(cellTerrainVisuals[0]);
            var cellPosInPixels = cellPosInCells.clone().multiply(map.cellSize);
            var neighborTerrains = [];
            var neighborPos = new Coords(0, 0, 0);
            for (var n = 0; n < neighborOffsets.length; n++) {
                var neighborOffset = neighborOffsets[n];
                neighborPos.overwriteWith(cellPosInCells).add(neighborOffset);
                var cellNeighbor = map.cellAtPosInCells(neighborPos);
                var cellNeighborTerrain;
                if (cellNeighbor == null) {
                    cellNeighborTerrain = cellTerrain;
                }
                else {
                    cellNeighborTerrain = terrainsByName.get(cellNeighbor.visualName);
                }
                neighborTerrains.push(cellNeighborTerrain);
            }
            var borderTypeCount = 4; // straight0, inside corner, outside corner, straight1
            for (var n = 1; n < neighborTerrains.length; n += 2) {
                var nPrev = NumberHelper.wrapToRangeMax(n - 1, neighborTerrains.length);
                var nNext = NumberHelper.wrapToRangeMax(n + 1, neighborTerrains.length);
                var neighborPrevTerrain = neighborTerrains[nPrev];
                var neighborCurrentTerrain = neighborTerrains[n];
                var neighborNextTerrain = neighborTerrains[nNext];
                var borderTypeIndex = null;
                if (neighborCurrentTerrain.level > cellTerrain.level) {
                    var neighborIndexToUse = n;
                    if (neighborPrevTerrain == neighborCurrentTerrain) {
                        if (neighborNextTerrain == neighborCurrentTerrain) {
                            borderTypeIndex = 1; // inside corner
                        }
                        else {
                            borderTypeIndex = 0; // straight0
                        }
                    }
                    else {
                        if (neighborNextTerrain == neighborCurrentTerrain) {
                            borderTypeIndex = 3; // straight1
                        }
                        else {
                            borderTypeIndex = 2; // outside corner
                        }
                    }
                }
                else if (neighborPrevTerrain.level > cellTerrain.level) {
                    neighborIndexToUse = nPrev;
                    if (neighborNextTerrain != neighborPrevTerrain) {
                        borderTypeIndex = 0; // straight0
                    }
                }
                else if (neighborNextTerrain.level > cellTerrain.level) {
                    neighborIndexToUse = nNext;
                    if (neighborNextTerrain != neighborPrevTerrain) {
                        borderTypeIndex = 3; // straight0
                    }
                }
                if (borderTypeIndex != null) {
                    var neighborTerrainToUse = neighborTerrains[neighborIndexToUse];
                    var borderVisualIndex = 1 + ((n - 1) / 2) * borderTypeCount + borderTypeIndex;
                    var visualForBorder = neighborTerrainToUse.visuals[borderVisualIndex];
                    cellVisuals.push(visualForBorder);
                }
            }
            var cellVisual = new VisualGroup(cellVisuals);
            var cellAsEntity = new Entity(this.name + cellPosInCells.toString(), [
                cellCollidable.clone(),
                new Drawable(cellVisual, null),
                new DrawableCamera(),
                new Locatable(new Disposition(cellPosInPixels, null, null)),
                cellTerrain.traversable
            ]);
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
    build_Camera(cameraViewSize, placeSize) {
        var cameraEntity = this.entityBuildCamera(cameraViewSize, placeSize);
        this.entities.push(cameraEntity);
        return cameraEntity;
    }
    ;
    build_Exterior(placePos, placeNamesToIncludePortalsTo) {
        var entityDefns = this.entityDefnsByName;
        var entities = this.entities;
        var size = this.size;
        var entityPosRange = new Box(size.clone().half(), size.clone().subtract(this.marginSize));
        var randomizer = this.randomizer;
        entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("EnemyGeneratorChaserNormal"), 1, null, entityPosRange, randomizer));
        entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("EnemyGeneratorChaserCold"), 1, null, entityPosRange, randomizer));
        entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("EnemyGeneratorChaserHeat"), 1, null, entityPosRange, randomizer));
        entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("EnemyGeneratorRunnerNormal"), 1, null, entityPosRange, randomizer));
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
        var entityRadioMessage = this.entityBuildRadioMessage(entityDefns.get("Friendly").drawable().visual, "This is " + this.name + ".");
        entities.push(entityRadioMessage);
        placeNamesToIncludePortalsTo.forEach(placeName => {
            var entityDefnPortal = this.entityDefnsByName.get("Portal");
            var entityPortal = this.entityBuildFromDefn(entityDefnPortal, entityPosRange, randomizer);
            entityPortal.name = placeName;
            entityPortal.portal().destinationPlaceName = placeName;
            entities.push(entityPortal);
        });
        entities.push(this.entityBuildFromDefn(entityDefns.get("Store"), entityPosRange, randomizer));
    }
    build_Goal(entityDimension) {
        var entityDefns = this.entityDefnsByName;
        var entities = this.entities;
        var entityDefns = this.entityDefnsByName;
        var entities = this.entities;
        var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);
        var numberOfKeysToUnlockGoal = 5;
        var goalEntity = this.entityBuildGoal(entities, entityDimension, entitySize, numberOfKeysToUnlockGoal);
        var entityPosRange = new Box(this.size.clone().half(), this.size.clone().subtract(this.marginSize));
        var entityRing = this.entityBuildFromDefn(entityDefns.get("Ring"), entityPosRange, this.randomizer);
        var ringLoc = entityRing.locatable().loc;
        ringLoc.pos.overwriteWith(goalEntity.locatable().loc.pos);
        ringLoc.spin.angleInTurnsRef.value = .001;
        entities.push(entityRing);
    }
    build_Interior(name, size, placeNameToReturnTo) {
        this.name = name;
        this.size = size;
        this.entities = [];
        this.build_SizeWallsAndMargins(this.name, null, null);
        this.entityBuildExit(placeNameToReturnTo);
        this.entitiesAllGround();
        this.build_Camera(this.cameraViewSize, this.size);
    }
    build_SizeWallsAndMargins(namePrefix, placePos, areNeighborsConnectedESWN) {
        this.size = this.size.clearZ();
        var wallThickness = this.entityBuildObstacleWalls(Color.byName("Red"), areNeighborsConnectedESWN, namePrefix, placePos);
        var marginThickness = wallThickness * 8;
        var marginSize = new Coords(1, 1, 0).multiplyScalar(marginThickness);
        this.marginSize = marginSize;
    }
    // Constructor helpers.
    entityBuildCamera(cameraViewSize, placeSize) {
        var viewSizeHalf = cameraViewSize.clone().half();
        var cameraHeightAbovePlayfield = cameraViewSize.x;
        var cameraZ = 0 - cameraHeightAbovePlayfield;
        var cameraPosBox = Box.fromMinAndMax(viewSizeHalf.clone().zSet(cameraZ), placeSize.clone().subtract(viewSizeHalf).zSet(cameraZ));
        var cameraPos = viewSizeHalf.clone();
        var cameraLoc = new Disposition(cameraPos, Orientation.Instances().ForwardZDownY.clone(), null);
        var camera = new Camera(cameraViewSize, cameraHeightAbovePlayfield, // focalLength
        cameraLoc);
        var cameraEntity = new Entity(Camera.name, [
            camera,
            new Constrainable([
                new Constraint_AttachToEntityWithName("Player"),
                new Constraint_ContainInBox(cameraPosBox)
            ]),
            new Locatable(cameraLoc)
        ]);
        return cameraEntity;
    }
    entityBuildBackground(camera) {
        var returnValues = [];
        var visualBackgroundDimension = 100;
        var visualBackgroundCellSize = new Coords(.5, .5, .01).multiplyScalar(visualBackgroundDimension);
        var visualBackgroundBottom = new VisualRepeating(visualBackgroundCellSize, camera.viewSize.clone(), // viewSize
        new VisualRectangle(visualBackgroundCellSize, null, new Color(null, null, [1, 1, 1, 0.02]), null), true // expandViewStartAndEndByCell
        );
        var entityBackgroundBottom = new Entity("BackgroundBottom", [
            new Locatable(new Disposition(new Coords(0, 0, camera.focalLength), null, null)),
            new Drawable(visualBackgroundBottom, null),
            new DrawableCamera()
        ]);
        returnValues.push(entityBackgroundBottom);
        visualBackgroundCellSize =
            new Coords(1, 1, .01).multiplyScalar(visualBackgroundDimension);
        var visualBackgroundTop = new VisualRepeating(visualBackgroundCellSize, // cellSize
        camera.viewSize.clone(), // viewSize
        new VisualRectangle(visualBackgroundCellSize, null, new Color(null, null, [1, 1, 1, 0.06]), null), true // expandViewStartAndEndByCell
        );
        var entityBackgroundTop = new Entity("BackgroundTop", [
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Drawable(visualBackgroundTop, null),
            new DrawableCamera()
        ]);
        returnValues.push(entityBackgroundTop);
        return returnValues;
    }
    entityBuildExit(placeNameToReturnTo) {
        var entityPosRange = new Box(this.size.clone().half(), this.size.clone().subtract(this.marginSize));
        var exit = this.entityBuildFromDefn(this.entityDefnsByName.get("Exit"), entityPosRange, this.randomizer);
        exit.portal().destinationPlaceName = placeNameToReturnTo;
        exit.portal().destinationEntityName = this.name;
        this.entities.push(exit);
    }
    entitiesAllGround() {
        this.entities.forEach((x) => { if (x.locatable() != null) {
            x.locatable().loc.pos.z = 0;
        } });
    }
    entitiesBuildFromDefnAndCount(entityDefn, entityCount, itemQuantityPerEntity, posRange, randomizer) {
        var returnEntities = [];
        for (var i = 0; i < entityCount; i++) {
            var entity = this.entityBuildFromDefn(entityDefn, posRange, randomizer);
            var entityItem = entity.item();
            if (entityItem != null) {
                entityItem.quantity = itemQuantityPerEntity || 1;
            }
            returnEntities.push(entity);
        }
        return returnEntities;
    }
    ;
    entityBuildFromDefn(entityDefn, posRange, randomizer) {
        var entity = entityDefn.clone();
        var entityLocatable = entity.locatable();
        if (entityLocatable != null) {
            entityLocatable.loc.pos.randomize(randomizer).multiply(posRange.size).add(posRange.min());
        }
        return entity;
    }
    ;
    entityBuildGoal(entities, entityDimension, entitySize, numberOfKeysToUnlockGoal) {
        var itemKeyColor = Color.byName("Yellow");
        var goalPos = new Coords(0, 0, 0).randomize(this.randomizer).multiplyScalar(.5).addDimensions(.25, .25, 0).multiply(this.size);
        var goalLoc = new Disposition(goalPos, null, null);
        var goalColor = Color.byName("GreenDark");
        var goalVisual = new VisualGroup([
            new VisualRectangle(entitySize, goalColor, null, null),
            new VisualText(new DataBinding("" + numberOfKeysToUnlockGoal, null, null), null, itemKeyColor, null)
        ]);
        if (this.visualsHaveText) {
            goalVisual.children.push(new VisualOffset(new VisualText(new DataBinding("Exit", null, null), null, goalColor, null), new Coords(0, 0 - entityDimension * 2, 0)));
        }
        var goalEntity = new Entity("Goal", [
            new Locatable(goalLoc),
            new Collidable(new Box(new Coords(0, 0, 0), entitySize), null, null),
            new Drawable(goalVisual, null),
            new DrawableCamera(),
            new Goal(numberOfKeysToUnlockGoal),
        ]);
        entities.push(goalEntity);
        return goalEntity;
    }
    ;
    entityBuildKeys(places, entityDimension, numberOfKeysToUnlockGoal, marginSize) {
        var entityDimensionHalf = entityDimension / 2;
        var sizeMinusMargins = marginSize.clone().double().invert().add(this.size);
        var itemDefnKeyName = "Key";
        var itemKeyVisual = this.itemDefnsByName.get(itemDefnKeyName).visual;
        for (var i = 0; i < numberOfKeysToUnlockGoal; i++) {
            var itemKeyPos = new Coords(0, 0, 0).randomize(this.randomizer).multiply(sizeMinusMargins).add(marginSize);
            var itemKeyCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
            var itemKeyEntity = new Entity(itemDefnKeyName + i, [
                new Item(itemDefnKeyName, 1),
                new Locatable(new Disposition(itemKeyPos, null, null)),
                new Collidable(itemKeyCollider, null, null),
                new Drawable(itemKeyVisual, null),
                new DrawableCamera()
            ]);
            var place = ArrayHelper.random(places, this.randomizer);
            place.entitiesToSpawn.push(itemKeyEntity);
        }
    }
    entityBuildLoader(entityDefn, entityCount, entityPosRange, randomizer) {
        var placeBuilder = this;
        var loadable = new Loadable((u, w, place, e) => // load
         {
            var placeAsPlaceRoom = place;
            var randomizer = new RandomizerLCG(placeAsPlaceRoom.randomizerSeed, null, null, null);
            var entityPosRange = new Box(place.size.clone().half(), place.size.clone());
            var entitiesCreated = placeBuilder.entitiesBuildFromDefnAndCount(entityDefn, entityCount, null, entityPosRange, randomizer);
            place.entitiesToSpawn.push(...entitiesCreated);
        }, (u, w, p, e) => // unload
         {
            p.entitiesToRemove.push(...p.entities.filter(x => x.name.startsWith("Mine")));
        });
        var returnValue = new Entity("Loader" + entityDefn.name, [
            loadable
        ]);
        return returnValue;
    }
    entityBuildObstacleWalls(wallColor, areNeighborsConnectedESWN, placeNamePrefix, placePos) {
        areNeighborsConnectedESWN = areNeighborsConnectedESWN || [false, false, false, false];
        var entities = this.entities;
        var numberOfWalls = 4;
        var wallThickness = 5;
        var doorwayWidthHalf = wallThickness * 4;
        var portalSize = new Coords(1, 1, 0).multiplyScalar(2 * doorwayWidthHalf);
        var neighborOffsets = [
            new Coords(1, 0, 0),
            new Coords(0, 1, 0),
            new Coords(-1, 0, 0),
            new Coords(0, -1, 0)
        ];
        for (var i = 0; i < numberOfWalls; i++) {
            var wallSize;
            var isNorthOrSouthWall = (i % 2 == 1);
            if (isNorthOrSouthWall) {
                wallSize = new Coords(this.size.x, wallThickness, 1);
            }
            else {
                wallSize = new Coords(wallThickness, this.size.y, 1);
            }
            var wallPos = wallSize.clone().half().clearZ();
            var isEastOrSouthWall = (i < 2);
            if (isEastOrSouthWall) {
                wallPos.invert().add(this.size);
            }
            var isNeighborConnected = areNeighborsConnectedESWN[i];
            if (isNeighborConnected) {
                if (isNorthOrSouthWall) {
                    wallSize.x = wallSize.x / 2 - doorwayWidthHalf;
                }
                else {
                    wallSize.y = wallSize.y / 2 - doorwayWidthHalf;
                }
            }
            var wallCollider = new Box(new Coords(0, 0, 0), wallSize);
            var wallVisual = new VisualRectangle(wallSize, wallColor, null, null);
            var numberOfWallPartsOnSide = (isNeighborConnected ? 2 : 1);
            for (var d = 0; d < numberOfWallPartsOnSide; d++) {
                var wallPartPos = wallPos.clone();
                if (isNeighborConnected) {
                    if (isNorthOrSouthWall) {
                        wallPartPos.x = wallSize.x / 2;
                        if (d == 1) {
                            wallPartPos.x *= -1;
                            wallPartPos.x += this.size.x;
                        }
                    }
                    else {
                        wallPartPos.y = wallSize.y / 2;
                        if (d == 1) {
                            wallPartPos.y *= -1;
                            wallPartPos.y += this.size.y;
                        }
                    }
                }
                var wallPartLoc = new Disposition(wallPartPos, null, null);
                var wallEntity = new Entity("ObstacleWall" + i + "_" + d, [
                    new Locatable(wallPartLoc),
                    new Collidable(wallCollider, null, null),
                    new Damager(new Damage(10, null, null)),
                    new Drawable(wallVisual, null),
                    new DrawableCamera()
                ]);
                entities.push(wallEntity);
            }
            if (isNeighborConnected) {
                var portalPos = wallPos.clone();
                var neighborOffset = neighborOffsets[i];
                portalPos.add(neighborOffset.clone().multiply(portalSize));
                var neighborPos = placePos.clone().add(neighborOffset);
                var neighborName = placeNamePrefix + neighborPos.toStringXY();
                var portalEntity = new Entity("PortalToNeighbor" + i, [
                    new Collidable(new Box(new Coords(0, 0, 0), portalSize), null, null),
                    new Locatable(new Disposition(portalPos, null, null)),
                    new Portal(neighborName, "PortalToNeighbor" + ((i + 2) % 4), false),
                    new Drawable(new VisualRectangle(portalSize, Color.byName("Violet"), null, null), null),
                    new DrawableCamera()
                ]);
                entities.push(portalEntity);
            }
        }
        return wallThickness;
    }
    ;
    entityBuildRadioMessage(visualForPortrait, message) {
        return new Entity("RadioMessage", [
            new Recurrent(20, // ticksPerRecurrence
            1, // timesToRecur
            // recur
            (u, w, p, e) => {
                var player = p.player();
                var playerItemHolder = player.itemHolder();
                var itemRadio = new Item("Walkie-Talkie", 1);
                var doesPlayerHaveRadio = playerItemHolder.hasItem(itemRadio);
                if (doesPlayerHaveRadio == false) {
                    e.recurrent().timesRecurredSoFar = 0;
                }
                else {
                    var wordBubble = new WordBubble(visualForPortrait, [
                        message
                    ]);
                    var wordBubbleAsControl = wordBubble.toControl(u);
                    var venuesForLayers = [
                        u.venueCurrent,
                        new VenueControls(wordBubbleAsControl, false)
                    ];
                    u.venueNext = new VenueLayered(venuesForLayers, null);
                }
            })
        ]);
    }
    entityDefnBuildStore(entityDimension) {
        var storeColor = Color.byName("Brown");
        var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);
        var visual = new VisualGroup([
            new VisualRectangle(new Coords(1, 1.5, 0).multiplyScalar(entityDimension), storeColor, null, null),
            new VisualOffset(new VisualRectangle(new Coords(1.1, .2, 0).multiplyScalar(entityDimension), Color.byName("Gray"), null, null), new Coords(0, -.75, 0).multiplyScalar(entityDimension)),
        ]);
        if (this.visualsHaveText) {
            visual.children.push(new VisualOffset(new VisualText(new DataBinding("Store", null, null), null, storeColor, null), new Coords(0, 0 - entityDimension * 2, 0)));
        }
        var storeEntityDefn = new Entity("Store", [
            new Collidable(new Box(new Coords(0, 0, 0), entitySize), null, null),
            new Drawable(visual, null),
            new DrawableCamera(),
            new ItemStore("Coin"),
            new ItemHolder([
                new Item("Coin", 100),
                new Item("Bow", 1),
                new Item("Key", 10),
                new Item("Medicine", 100)
            ].map(x => x.toEntity()), null, // weightMax
            null // reachRadius
            ),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Usable((u, w, p, eUsing, eUsed) => {
                eUsed.itemStore().use(u, w, p, eUsing, eUsed);
                return null;
            })
        ]);
        return storeEntityDefn;
    }
    // Entity definitions.
    entityDefnBuildAccessory(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnAccessoryName = "Speed Boots";
        var itemAccessoryVisual = this.itemDefnsByName.get(itemDefnAccessoryName).visual;
        var itemAccessoryCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var itemAccessoryEntityDefn = new Entity(itemDefnAccessoryName, [
            new Item(itemDefnAccessoryName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemAccessoryCollider, null, null),
            new Drawable(itemAccessoryVisual, null),
            new DrawableCamera(),
            new Equippable(null, null)
        ]);
        return itemAccessoryEntityDefn;
    }
    entityDefnBuildArmor(entityDimension) {
        var itemDefnArmorName = "Armor";
        var itemDefn = this.itemDefnsByName.get(itemDefnArmorName);
        var itemArmorVisual = itemDefn.visual;
        var path = itemArmorVisual.children[0].verticesAsPath;
        var itemArmorCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);
        var collidable = new Collidable(itemArmorCollider, null, null);
        var box = new Box(new Coords(0, 0, 0), new Coords(0, 0, 0)).ofPoints(path.points);
        box.center = collidable.collider.center;
        var boundable = new Boundable(box);
        var itemArmorEntityDefn = new Entity(itemDefnArmorName, [
            new Armor(.5),
            boundable,
            collidable,
            new Equippable(null, null),
            new Item(itemDefnArmorName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Drawable(itemArmorVisual, null),
            new DrawableCamera()
        ]);
        return itemArmorEntityDefn;
    }
    entityDefnBuildArrow(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnArrowName = "Arrow";
        var itemArrowVisual = this.itemDefnsByName.get(itemDefnArrowName).visual;
        var arrowSize = new Coords(1, 1, 1);
        var itemArrowCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var collidable = new Collidable(itemArrowCollider, null, null);
        var bounds = new Box(collidable.collider.center, arrowSize);
        var boundable = new Boundable(bounds);
        var roundsPerPile = 5;
        var itemArrowEntityDefn = new Entity(itemDefnArrowName, [
            boundable,
            collidable,
            new Drawable(itemArrowVisual, null),
            new DrawableCamera(),
            new Item(itemDefnArrowName, roundsPerPile),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
        ]);
        return itemArrowEntityDefn;
    }
    entityDefnBuildBomb(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnBombName = "Bomb";
        var itemBombVisual = this.itemDefnsByName.get(itemDefnBombName).visual;
        var itemBombCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var itemBombDevice = new Device("Bomb", 10, // ticksToCharge
        (u, w, p, entity) => // initialize
         {
            // todo
        }, (u, w, p, e) => // update
         {
            // todo
        }, (u, world, p, entityUser, entityDevice) => // use
         {
            var userAsItemHolder = entityUser.itemHolder();
            var hasAmmo = userAsItemHolder.hasItemWithDefnNameAndQuantity("Bomb", 1);
            if (hasAmmo == false) {
                return;
            }
            userAsItemHolder.itemSubtractDefnNameAndQuantity("Bomb", 1);
            entityUser.equipmentUser().unequipItemsNoLongerHeld(entityUser);
            var userLoc = entityUser.locatable().loc;
            var userPos = userLoc.pos;
            var userVel = userLoc.vel;
            var userSpeed = userVel.magnitude();
            if (userSpeed == 0) {
                return;
            }
            var projectileDimension = 1.5;
            var projectileVisual = new VisualGroup([
                entityDevice.drawable().visual.child,
            ]);
            var userDirection = userVel.clone().normalize();
            var userRadius = entityUser.collidable().collider.radius;
            var projectilePos = userPos.clone().add(userDirection.clone().multiplyScalar(userRadius + projectileDimension).double());
            var projectileOri = new Orientation(userVel.clone().normalize(), null);
            var projectileLoc = new Disposition(projectilePos, projectileOri, null);
            projectileLoc.vel.overwriteWith(userVel).clearZ().double();
            var projectileCollider = new Sphere(new Coords(0, 0, 0), projectileDimension);
            // todo
            var projectileCollide = null;
            var projectileDie = (u, w, p, entityDying) => {
                var explosionRadius = 32;
                var explosionVisual = new VisualCircle(explosionRadius, Color.byName("Yellow"), null);
                var explosionCollider = new Sphere(new Coords(0, 0, 0), explosionRadius);
                var explosionCollide = (universe, world, place, entityProjectile, entityOther) => {
                    var killable = entityOther.killable();
                    if (killable != null) {
                        killable.damageApply(universe, world, place, entityProjectile, entityOther, entityProjectile.damager().damagePerHit);
                    }
                };
                var explosionEntity = new Entity("BombExplosion", [
                    new Collidable(explosionCollider, [Killable.name], explosionCollide),
                    new Damager(new Damage(20, null, null)),
                    new Drawable(explosionVisual, null),
                    new DrawableCamera(),
                    new Ephemeral(8, null),
                    entityDying.locatable()
                ]);
                p.entitiesToSpawn.push(explosionEntity);
            };
            var projectileEntity = new Entity("ProjectileBomb", [
                new Ephemeral(64, projectileDie),
                new Locatable(projectileLoc),
                new Collidable(projectileCollider, [Collidable.name], projectileCollide),
                new Constrainable([new Constraint_FrictionXY(.03, .5)]),
                new Drawable(projectileVisual, null),
                new DrawableCamera(),
                new Equippable(null, null)
            ]);
            p.entitiesToSpawn.push(projectileEntity);
        });
        var itemBombEntityDefn = new Entity(itemDefnBombName, [
            new Item(itemDefnBombName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemBombCollider, null, null),
            itemBombDevice,
            new Drawable(itemBombVisual, null),
            new DrawableCamera(),
            new Equippable(null, null)
        ]);
        return itemBombEntityDefn;
    }
    entityDefnBuildBook(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnBookName = "Book";
        var itemBookVisual = this.itemDefnsByName.get(itemDefnBookName).visual;
        var itemBookCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var itemBookEntityDefn = new Entity(itemDefnBookName, [
            new Item(itemDefnBookName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemBookCollider, null, null),
            new Drawable(itemBookVisual, null),
            new DrawableCamera()
        ]);
        return itemBookEntityDefn;
    }
    entityDefnBuildBow(entityDimension) {
        entityDimension = entityDimension * 2;
        var itemDefnName = "Bow";
        var itemBowVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemBowCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);
        var itemBowUse = (u, world, p, entityUser, entityDevice) => // use
         {
            var device = entityDevice.device();
            var tickCurrent = world.timerTicksSoFar;
            var ticksSinceUsed = tickCurrent - device.tickLastUsed;
            if (ticksSinceUsed < device.ticksToCharge) {
                return;
            }
            var userAsItemHolder = entityUser.itemHolder();
            var hasAmmo = userAsItemHolder.hasItemWithDefnNameAndQuantity("Arrow", 1);
            if (hasAmmo == false) {
                return;
            }
            userAsItemHolder.itemSubtractDefnNameAndQuantity("Arrow", 1);
            entityUser.equipmentUser().unequipItemsNoLongerHeld(entityUser);
            device.tickLastUsed = tickCurrent;
            var userLoc = entityUser.locatable().loc;
            var userPos = userLoc.pos;
            var userVel = userLoc.vel;
            var userSpeed = userVel.magnitude();
            if (userSpeed == 0) {
                return;
            }
            var projectileDimension = 1.5;
            var itemEntityArrow = userAsItemHolder.itemEntitiesByDefnName("Arrow")[0];
            var itemArrow = itemEntityArrow.item();
            var itemArrowDefn = itemArrow.defn(world);
            var projectileVisual = itemArrowDefn.visual;
            var userDirection = userVel.clone().normalize();
            var userRadius = entityUser.collidable().collider.radius;
            var projectilePos = userPos.clone().add(userDirection.clone().multiplyScalar(userRadius + projectileDimension).double());
            var projectileOri = new Orientation(userVel.clone().normalize(), null);
            var projectileLoc = new Disposition(projectilePos, projectileOri, null);
            projectileLoc.vel.overwriteWith(userVel).clearZ().double();
            var projectileCollider = new Sphere(new Coords(0, 0, 0), projectileDimension);
            var projectileCollide = (universe, world, place, entityProjectile, entityOther) => {
                var killable = entityOther.killable();
                if (killable != null) {
                    killable.damageApply(universe, world, place, entityProjectile, entityOther, null);
                    entityProjectile.killable().integrity = 0;
                }
            };
            var visualStrike = new VisualCircle(8, Color.byName("Red"), null);
            var killable = new Killable(1, // integrityMax
            null, // damageApply
            (universe, world, place, entityKillable) => // die
             {
                var entityStrike = new Entity("ArrowStrike", [
                    new Ephemeral(8, null),
                    new Drawable(visualStrike, null),
                    new DrawableCamera(),
                    entityKillable.locatable()
                ]);
                place.entitiesToSpawn.push(entityStrike);
            });
            var projectileEntity = new Entity("ProjectileArrow", [
                new Damager(new Damage(10, null, null)),
                new Ephemeral(32, null),
                killable,
                new Locatable(projectileLoc),
                new Collidable(projectileCollider, [Killable.name], projectileCollide),
                new Drawable(projectileVisual, null),
                new DrawableCamera()
            ]);
            p.entitiesToSpawn.push(projectileEntity);
        };
        var itemBowDevice = new Device("Bow", 10, // ticksToCharge
        (u, w, p, entity) => // initialize
         {
            // todo
        }, (u, w, p, e) => // update
         {
            // todo
        }, itemBowUse);
        var itemBowEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemBowCollider, null, null),
            new Drawable(itemBowVisual, null),
            new DrawableCamera(),
            new Equippable(null, null),
            itemBowDevice
        ]);
        return itemBowEntityDefn;
    }
    entityDefnBuildBread(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnBreadName = "Bread";
        var itemBreadVisual = this.itemDefnsByName.get(itemDefnBreadName).visual;
        var itemBreadCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var itemBreadEntityDefn = new Entity(itemDefnBreadName, [
            new Item(itemDefnBreadName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemBreadCollider, null, null),
            new Drawable(itemBreadVisual, null),
            new DrawableCamera()
        ]);
        return itemBreadEntityDefn;
    }
    entityDefnBuildCar(entityDimension) {
        entityDimension *= .75;
        var defnName = "Car";
        var frames = new Array();
        var frameSizeScaled = new Coords(4, 3, 0).multiplyScalar(entityDimension);
        var visualTileset = new VisualImageFromLibrary("Car");
        var tileSizeInPixels = new Coords(64, 48, 0);
        var tilesetSizeInTiles = new Coords(8, 4, 0);
        var tilePosInTiles = new Coords(0, 0, 0);
        for (var y = 0; y < tilesetSizeInTiles.y; y++) {
            tilePosInTiles.y = y;
            for (var x = 0; x < tilesetSizeInTiles.x; x++) {
                tilePosInTiles.x = x;
                var regionPos = tileSizeInPixels.clone().multiply(tilePosInTiles);
                var regionToDrawAsBox = Box.fromMinAndSize(regionPos, tileSizeInPixels);
                var visualForFrame = new VisualImageScaledPartial(visualTileset, regionToDrawAsBox, frameSizeScaled);
                frames.push(visualForFrame);
            }
        }
        var carVisualBody = new VisualDirectional(frames[0], // visualForNoDirection
        frames, // visualsForDirections
        null // headingInTurnsGetForEntity
        );
        var carVisual = new VisualGroup([
            carVisualBody
        ]);
        if (this.visualsHaveText) {
            carVisual.children.push(new VisualOffset(new VisualText(new DataBinding(defnName, null, null), null, Color.byName("Blue"), null), new Coords(0, 0 - entityDimension * 2.5, 0)));
        }
        var carCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);
        var carCollide = (universe, world, place, entityPlayer, entityOther) => {
            if (entityOther.portal() != null) {
                var usable = entityOther.usable();
                if (usable == null) {
                    var portal = entityOther.portal();
                    portal.use(universe, world, place, entityPlayer, entityOther);
                }
            }
            else {
                universe.collisionHelper.collideEntities(entityPlayer, entityOther);
            }
        };
        var carCollidable = new Collidable(carCollider, [Collidable.name], carCollide);
        var carConstrainable = new Constrainable([
            new Constraint_FrictionXY(.03, .2)
        ]);
        var carLoc = new Disposition(null, null, null);
        //carLoc.spin = new Rotation(Coords.Instances().ZeroZeroOne, new Reference(.01));
        var carUsable = new Usable((u, w, p, eUsing, eUsed) => {
            var vehicle = eUsed.propertiesByName.get(Vehicle.name);
            vehicle.entityOccupant = eUsing;
            p.entitiesToRemove.push(eUsing);
            return null;
        });
        var vehicle = new Vehicle(.2, // accelerationPerTick
        5, // speedMax
        .01 // steeringAngleInTurns
        );
        var carEntityDefn = new Entity(defnName, [
            new Locatable(carLoc),
            carCollidable,
            carConstrainable,
            new Drawable(carVisual, null),
            new DrawableCamera(),
            carUsable,
            vehicle
        ]);
        return carEntityDefn;
    }
    entityDefnBuildCoin(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnCoinName = "Coin";
        var itemCoinVisual = this.itemDefnsByName.get(itemDefnCoinName).visual;
        var itemCoinCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var itemCoinEntityDefn = new Entity(itemDefnCoinName, [
            new Item(itemDefnCoinName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemCoinCollider, null, null),
            new Drawable(itemCoinVisual, null),
            new DrawableCamera()
        ]);
        return itemCoinEntityDefn;
    }
    ;
    entityDefnBuildCrystal(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnCrystalName = "Crystal";
        var itemCrystalVisual = this.itemDefnsByName.get(itemDefnCrystalName).visual;
        var itemCrystalCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var itemCrystalEntityDefn = new Entity(itemDefnCrystalName, [
            new Collidable(itemCrystalCollider, null, null),
            new Drawable(itemCrystalVisual, null),
            new DrawableCamera(),
            new Item(itemDefnCrystalName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null))
        ]);
        return itemCrystalEntityDefn;
    }
    entityDefnBuildDoughnut(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnDoughnutName = "Doughnut";
        var itemDoughnutVisual = this.itemDefnsByName.get(itemDefnDoughnutName).visual;
        var itemDoughnutCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var itemDoughnutEntityDefn = new Entity(itemDefnDoughnutName, [
            new Item(itemDefnDoughnutName, 1),
            new Locatable(null),
            new Collidable(itemDoughnutCollider, null, null),
            new Drawable(itemDoughnutVisual, null),
            new DrawableCamera()
        ]);
        return itemDoughnutEntityDefn;
    }
    entityDefnBuildFlower(entityDimension) {
        entityDimension *= .5;
        var itemDefnName = "Flower";
        var visual = this.itemDefnsByName.get(itemDefnName).visual;
        var collider = new Sphere(new Coords(0, 0, 0), entityDimension);
        var entityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(collider, null, null),
            new Drawable(visual, null),
            new DrawableCamera()
        ]);
        return entityDefn;
    }
    entityDefnBuildFruit(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnFruitName = "Fruit";
        var itemFruitVisual = this.itemDefnsByName.get(itemDefnFruitName).visual;
        var itemFruitCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var itemFruitEntityDefn = new Entity(itemDefnFruitName, [
            new Item(itemDefnFruitName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemFruitCollider, null, null),
            new Drawable(itemFruitVisual, null),
            new DrawableCamera(),
        ]);
        return itemFruitEntityDefn;
    }
    entityDefnBuildGenerator(entityDefnToGenerate) {
        var generator = new Generator(entityDefnToGenerate, 1200, // ticksToGenerate
        1 // entitiesGeneratedMax
        );
        var entityDefnGenerator = new Entity(entityDefnToGenerate.name + "Generator", [
            generator,
            new Locatable(null)
        ]);
        return entityDefnGenerator;
    }
    entityDefnBuildGrass(entityDimension) {
        entityDimension /= 2;
        var itemDefnName = "Grass";
        var itemGrassVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemGrassCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);
        var itemGrassEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemGrassCollider, null, null),
            new Drawable(itemGrassVisual, null),
            new DrawableCamera()
        ]);
        return itemGrassEntityDefn;
    }
    entityDefnBuildHeart(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnHeartName = "Heart";
        var itemHeartVisual = this.itemDefnsByName.get(itemDefnHeartName).visual;
        var itemHeartCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var itemHeartEntityDefn = new Entity(itemDefnHeartName, [
            new Item(itemDefnHeartName, 1),
            new Locatable(null),
            new Collidable(itemHeartCollider, null, null),
            new Drawable(itemHeartVisual, null),
            new DrawableCamera()
        ]);
        return itemHeartEntityDefn;
    }
    entityDefnBuildIron(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnIronName = "Iron";
        var itemIronVisual = this.itemDefnsByName.get(itemDefnIronName).visual;
        var itemIronCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var itemIronEntityDefn = new Entity(itemDefnIronName, [
            new Item(itemDefnIronName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemIronCollider, null, null),
            new Drawable(itemIronVisual, null),
            new DrawableCamera()
        ]);
        return itemIronEntityDefn;
    }
    entityDefnBuildIronOre(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnOreName = "Iron Ore";
        var itemOreVisual = this.itemDefnsByName.get(itemDefnOreName).visual;
        var itemOreCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var itemOreEntityDefn = new Entity(itemDefnOreName, [
            new Item(itemDefnOreName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemOreCollider, null, null),
            new Drawable(itemOreVisual, null),
            new DrawableCamera()
        ]);
        return itemOreEntityDefn;
    }
    entityDefnBuildLog(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnLogName = "Log";
        var itemLogVisual = this.itemDefnsByName.get(itemDefnLogName).visual;
        var itemLogCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var itemLogEntityDefn = new Entity(itemDefnLogName, [
            new Item(itemDefnLogName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemLogCollider, null, null),
            new Drawable(itemLogVisual, null),
            new DrawableCamera()
        ]);
        return itemLogEntityDefn;
    }
    entityDefnBuildMeat(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnMeatName = "Meat";
        var itemMeatDefn = this.itemDefnsByName.get(itemDefnMeatName);
        var itemMeatVisual = itemMeatDefn.visual;
        var itemMeatCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var itemMeatEntityDefn = new Entity(itemDefnMeatName, [
            new Item(itemDefnMeatName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemMeatCollider, null, null),
            new Drawable(itemMeatVisual, null),
            new DrawableCamera(),
            new Usable(itemMeatDefn.use)
        ]);
        return itemMeatEntityDefn;
    }
    entityDefnBuildMedicine(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnMedicineName = "Medicine";
        var itemMedicineVisual = this.itemDefnsByName.get(itemDefnMedicineName).visual;
        var itemMedicineCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var itemMedicineEntityDefn = new Entity(itemDefnMedicineName, [
            new Item(itemDefnMedicineName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemMedicineCollider, null, null),
            new Drawable(itemMedicineVisual, null),
            new DrawableCamera(),
            new Equippable(null, null)
        ]);
        return itemMedicineEntityDefn;
    }
    entityDefnBuildMushroom(entityDimension) {
        entityDimension /= 2;
        var itemDefnName = "Mushroom";
        var itemMushroomVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemMushroomCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);
        var itemMushroomEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemMushroomCollider, null, null),
            new Drawable(itemMushroomVisual, null),
            new DrawableCamera()
        ]);
        return itemMushroomEntityDefn;
    }
    entityDefnBuildPick(entityDimension) {
        var itemDefnName = "Pick";
        var itemPickVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemPickCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);
        var itemPickDevice = new Device("Pick", 10, // ticksToCharge
        null, // initialize: (u: Universe, w: World, p: Place, e: Entity) => void,
        null, // update: (u: Universe, w: World, p: Place, e: Entity) => void,
        (u, w, p, eUser, eDevice) => // use
         {
            var bouldersInPlace = p.entities.filter(x => x.name.startsWith("Boulder"));
            var rangeMax = 20; // todo
            var boulderInRange = bouldersInPlace.filter(x => x.locatable().distanceFromEntity(eUser) < rangeMax)[0];
            if (boulderInRange != null) {
                boulderInRange.killable().integrity = 0;
            }
        });
        var itemPickEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemPickCollider, null, null),
            itemPickDevice,
            new Drawable(itemPickVisual, null),
            new DrawableCamera(),
            new Equippable(null, null)
        ]);
        return itemPickEntityDefn;
    }
    entityDefnBuildPotion(entityDimension) {
        var entityDimensionHalf = entityDimension / 2;
        var itemDefnPotionName = "Potion";
        var itemPotionColor = Color.byName("Blue");
        var itemPotionVisual = new VisualGroup([
            new VisualPolygon(new Path([
                new Coords(1, 1, 0),
                new Coords(-1, 1, 0),
                new Coords(-.2, 0, 0),
                new Coords(-.2, -.5, 0),
                new Coords(.2, -.5, 0),
                new Coords(.2, 0, 0)
            ]).transform(Transform_Scale.fromScalar(entityDimension)), itemPotionColor, Color.byName("White"))
        ]);
        if (this.visualsHaveText) {
            itemPotionVisual.children.push(new VisualOffset(new VisualText(new DataBinding(itemDefnPotionName, null, null), null, itemPotionColor, null), new Coords(0, 0 - entityDimension, 0)));
        }
        var itemPotionCollider = new Sphere(new Coords(0, 0, 0), entityDimensionHalf);
        var itemPotionEntityDefn = new Entity(itemDefnPotionName, [
            new Item(itemDefnPotionName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemPotionCollider, null, null),
            new Drawable(itemPotionVisual, null),
            new DrawableCamera()
        ]);
        return itemPotionEntityDefn;
    }
    entityDefnBuildShovel(entityDimension) {
        var itemDefnName = "Shovel";
        var itemShovelVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemShovelCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);
        var itemShovelDevice = new Device("Shovel", 10, // ticksToCharge
        null, // initialize: (u: Universe, w: World, p: Place, e: Entity) => void,
        null, // update: (u: Universe, w: World, p: Place, e: Entity) => void,
        (u, w, p, eUser, eDevice) => // use
         {
            var holesInPlace = p.entities.filter(x => x.name.startsWith("Hole"));
            var rangeMax = 20; // todo
            var holeInRange = holesInPlace.filter(x => x.locatable().distanceFromEntity(eUser) < rangeMax)[0];
            if (holeInRange != null) {
                var isHoleEmpty = (holeInRange.itemHolder().itemEntities.length == 0);
                if (isHoleEmpty) {
                    p.entitiesToRemove.push(holeInRange);
                }
                else {
                    var holeInRangePerceptible = holeInRange.perceptible();
                    holeInRangePerceptible.isHiding =
                        (holeInRangePerceptible.isHiding == false);
                }
            }
            else {
                eUser.locatable().entitySpawnWithDefnName(u, w, p, eUser, "Hole");
            }
        });
        var itemShovelEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemShovelCollider, null, null),
            itemShovelDevice,
            new Drawable(itemShovelVisual, null),
            new DrawableCamera(),
            new Equippable(null, null)
        ]);
        return itemShovelEntityDefn;
    }
    entityDefnBuildSword(entityDimension, damageTypeName) {
        var itemDefnName = "Sword";
        if (damageTypeName == null) {
            // todo
        }
        else if (damageTypeName == "Cold") {
            itemDefnName += damageTypeName;
        }
        else if (damageTypeName == "Heat") {
            itemDefnName += damageTypeName;
        }
        var itemSwordCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);
        var itemSwordDeviceUse = (universe, world, place, entityUser, entityDevice) => // use
         {
            var userLoc = entityUser.locatable().loc;
            var userPos = userLoc.pos;
            var userVel = userLoc.vel;
            var userSpeed = userVel.magnitude();
            if (userSpeed == 0) {
                return;
            }
            var userDirection = userVel.clone().normalize();
            var userRadius = entityUser.collidable().collider.radius;
            var projectileDimension = 1.5;
            var projectilePos = userPos.clone().add(userDirection.clone().multiplyScalar(userRadius + projectileDimension).double());
            var projectileOri = new Orientation(userVel.clone().normalize(), null);
            var projectileVisual = entityDevice.drawable().visual;
            projectileVisual = projectileVisual.child;
            projectileVisual = projectileVisual.children[0].clone();
            projectileVisual.transform(new Transform_RotateRight(1));
            var projectileLoc = new Disposition(projectilePos, projectileOri, null);
            projectileLoc.vel.overwriteWith(userVel).clearZ().double();
            var projectileCollider = new Sphere(new Coords(0, 0, 0), projectileDimension);
            var projectileCollide = (universe, world, place, entityProjectile, entityOther) => {
                var killable = entityOther.killable();
                if (killable != null) {
                    var damageToApply = entityProjectile.damager().damagePerHit;
                    killable.damageApply(universe, world, place, entityProjectile, entityOther, damageToApply);
                    entityProjectile.killable().integrity = 0;
                }
            };
            var visualStrike = new VisualCircle(8, Color.byName("Red"), null);
            var killable = new Killable(1, // integrityMax
            null, // damageApply
            (universe, world, place, entityKillable) => // die
             {
                var entityStrike = new Entity("SwordStrike", [
                    new Ephemeral(8, null),
                    new Drawable(visualStrike, null),
                    new DrawableCamera(),
                    entityKillable.locatable()
                ]);
                place.entitiesToSpawn.push(entityStrike);
            });
            var effectsAndChances = new Array();
            if (damageTypeName != null) {
                var effect;
                if (damageTypeName == "Cold") {
                    effect = Effect.Instances().Frozen;
                }
                else if (damageTypeName == "Heat") {
                    effect = Effect.Instances().Burning;
                }
                else {
                    throw "Unrecognized damage type: " + damageTypeName;
                }
                var effectAndChance = [effect, 1];
                effectsAndChances = [effectAndChance];
            }
            var projectileDamager = new Damager(new Damage(10, damageTypeName, effectsAndChances));
            var projectileEntity = new Entity("ProjectileSword", [
                projectileDamager,
                new Ephemeral(8, null),
                killable,
                new Locatable(projectileLoc),
                new Collidable(projectileCollider, [Killable.name], projectileCollide),
                new Drawable(projectileVisual, null),
                new DrawableCamera()
            ]);
            place.entitiesToSpawn.push(projectileEntity);
        };
        var itemSwordDevice = new Device(itemDefnName, 10, // ticksToCharge
        null, // init
        null, // update
        itemSwordDeviceUse);
        var itemSwordVisual = this.itemDefnsByName.get(itemDefnName).visual.clone();
        itemSwordVisual.transform(new Transform_Translate(new Coords(0, -1.1 * entityDimension, 0)));
        var itemSwordEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            new Locatable(null),
            new Collidable(itemSwordCollider, null, null),
            new Drawable(itemSwordVisual, null),
            new DrawableCamera(),
            itemSwordDevice,
            new Equippable(null, null)
        ]);
        return itemSwordEntityDefn;
    }
    entityDefnBuildToolset(entityDimension) {
        var itemDefnName = "Toolset";
        var itemToolsetVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemToolsetCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);
        var itemToolsetEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemToolsetCollider, null, null),
            new Drawable(itemToolsetVisual, null),
            new DrawableCamera()
        ]);
        return itemToolsetEntityDefn;
    }
    entityDefnBuildTorch(entityDimension) {
        var itemDefnName = "Torch";
        var itemTorchVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemTorchCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);
        var itemTorchEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemTorchCollider, null, null),
            new Drawable(itemTorchVisual, null),
            new DrawableCamera()
        ]);
        return itemTorchEntityDefn;
    }
    entityDefnBuildWeight(entityDimension) {
        var itemDefnName = "Weight";
        var itemWeightVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemWeightCollider = new Sphere(new Coords(0, 0, 0), entityDimension / 2);
        var itemWeightEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(itemWeightCollider, null, null),
            new Drawable(itemWeightVisual, null),
            new DrawableCamera()
        ]);
        return itemWeightEntityDefn;
    }
    entityDefnsBuild(entityDimension) {
        var entityDefnFlower = this.entityDefnBuildFlower(entityDimension);
        var entityDefnGrass = this.entityDefnBuildGrass(entityDimension);
        var entityDefnMushroom = this.entityDefnBuildMushroom(entityDimension);
        var entityDefns = [
            this.emplacementsBuilder.entityDefnBuildAnvil(entityDimension),
            this.emplacementsBuilder.entityDefnBuildBoulder(entityDimension),
            this.emplacementsBuilder.entityDefnBuildCampfire(entityDimension),
            this.emplacementsBuilder.entityDefnBuildContainer(entityDimension),
            this.emplacementsBuilder.entityDefnBuildExit(entityDimension),
            this.emplacementsBuilder.entityDefnBuildHole(entityDimension),
            this.emplacementsBuilder.entityDefnBuildPortal(entityDimension),
            this.emplacementsBuilder.entityDefnBuildObstacleBar(entityDimension),
            this.emplacementsBuilder.entityDefnBuildObstacleMine(entityDimension),
            this.emplacementsBuilder.entityDefnBuildObstacleRing(entityDimension),
            this.emplacementsBuilder.entityDefnBuildPillow(entityDimension),
            this.emplacementsBuilder.entityDefnBuildTree(entityDimension),
            this.moversBuilder.entityDefnBuildEnemyGeneratorChaser(entityDimension, null),
            this.moversBuilder.entityDefnBuildEnemyGeneratorChaser(entityDimension, "Cold"),
            this.moversBuilder.entityDefnBuildEnemyGeneratorChaser(entityDimension, "Heat"),
            this.moversBuilder.entityDefnBuildEnemyGeneratorRunner(entityDimension, null),
            this.moversBuilder.entityDefnBuildEnemyGeneratorTank(entityDimension, null),
            this.moversBuilder.entityDefnBuildCarnivore(entityDimension),
            this.moversBuilder.entityDefnBuildFriendly(entityDimension),
            this.moversBuilder.entityDefnBuildGrazer(entityDimension),
            this.moversBuilder.entityDefnBuildPlayer(entityDimension, this.cameraViewSize),
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
