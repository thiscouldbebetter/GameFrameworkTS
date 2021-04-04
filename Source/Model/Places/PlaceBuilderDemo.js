"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class PlaceBuilderDemo // Main.
         {
            constructor(universe, randomizer, cameraViewSize) {
                this.universe = universe;
                this.randomizer = randomizer || GameFramework.RandomizerLCG.default();
                this.visualsHaveText = false;
                var entityDimension = 10;
                this.actionsBuilder = new GameFramework.PlaceBuilderDemo_Actions(this);
                this.emplacementsBuilder = new GameFramework.PlaceBuilderDemo_Emplacements(this);
                this.itemsBuilder = new GameFramework.PlaceBuilderDemo_Items(this, entityDimension);
                this.moversBuilder = new GameFramework.PlaceBuilderDemo_Movers(this);
                this.actions = this.actionsBuilder.actionsBuild();
                this.actionToInputsMappings = this.actionsBuilder.actionToInputsMappingsBuild();
                this.activityDefns = this.actionsBuilder.activityDefnsBuild();
                this.cameraViewSize = cameraViewSize;
                this.itemDefns = this.itemsBuilder.itemDefnsBuild();
                this.itemDefnsByName = GameFramework.ArrayHelper.addLookupsByName(this.itemDefns);
                this.entityDefns = this.entityDefnsBuild(entityDimension);
                this.entityDefnsByName = GameFramework.ArrayHelper.addLookupsByName(this.entityDefns);
                this.fontHeight = 10;
            }
            buildBase(size, placeNameToReturnTo) {
                this.build_Interior("Base", size, placeNameToReturnTo);
                var entityPosRange = new GameFramework.Box(size.clone().half(), size.clone().subtract(this.marginSize));
                var randomizer = this.randomizer;
                var entityDefns = this.entityDefnsByName;
                var e = this.entities;
                e.push(this.entityBuildFromDefn(entityDefns.get("Player"), entityPosRange, randomizer));
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
                var ring = this.entitiesBuildFromDefnAndCount(entityDefns.get("Ring"), 1, null, entityPosRange, randomizer)[0];
                var ringLoc = ring.locatable().loc;
                ringLoc.spin.angleInTurnsRef.value = .001;
                this.entities.push(ring);
                var container = this.entityBuildFromDefn(entityDefns.get("Container"), entityPosRange, randomizer);
                var itemEntityOre = this.entityBuildFromDefn(entityDefns.get("Iron Ore"), entityPosRange, randomizer);
                itemEntityOre.item().quantity = 3; // For crafting.
                container.itemHolder().itemEntityAdd(itemEntityOre);
                this.entities.push(container);
                var randomizerSeed = this.randomizer.getNextRandom();
                var place = new GameFramework.PlaceRoom(this.name, "Demo", size, this.entities, randomizerSeed);
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
                var place = new GameFramework.PlaceRoom(this.name, "Demo", size, this.entities, randomizerSeed);
                return place;
            }
            buildParallax(size, placeNameToReturnTo) {
                this.name = "Parallax";
                this.size = size;
                this.entities = [];
                this.entityBuildExit(placeNameToReturnTo);
                this.entitiesAllGround();
                this.build_Camera(this.cameraViewSize, this.size);
                var entityCamera = this.build_Camera(this.cameraViewSize, this.size);
                this.entities.splice(0, 0, ...this.entityBuildBackground(entityCamera.camera()));
                var randomizerSeed = this.randomizer.getNextRandom();
                var place = new GameFramework.PlaceRoom(this.name, "Demo", size, this.entities, randomizerSeed);
                return place;
            }
            buildTunnels(size, placeNameToReturnTo) {
                size = size.clone().multiplyScalar(4);
                this.build_Interior("Tunnels", size, placeNameToReturnTo);
                var randomizerSeed = this.randomizer.getNextRandom();
                var networkNodeCount = 24;
                var network = GameFramework.Network.random(networkNodeCount, this.randomizer);
                network = network.transform(new GameFramework.Transform_Scale(size));
                //var tunnelsVisual = new VisualNetwork(network);
                var tunnelsVisual = new GameFramework.VisualGroup([]);
                var wallThickness = 4; // todo
                var tunnelWidth = wallThickness * 8;
                var color = GameFramework.Color.byName("Red");
                var nodes = network.nodes;
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    var visualWallNode = new GameFramework.VisualOffset(new GameFramework.VisualCircle(tunnelWidth, null, color, wallThickness), node.pos.clone());
                    tunnelsVisual.children.push(visualWallNode);
                }
                var links = network.links;
                for (var i = 0; i < links.length; i++) {
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
                    var visualWallRight = new GameFramework.VisualLine(tunnelMidlineToWallRight.clone().add(node0Pos).add(nodeCenterToTunnel), tunnelMidlineToWallRight.clone().add(node1Pos).subtract(nodeCenterToTunnel), color, wallThickness);
                    tunnelsVisual.children.push(visualWallRight);
                    var visualWallLeft = new GameFramework.VisualLine(tunnelMidlineToWallLeft.clone().add(node0Pos).add(nodeCenterToTunnel), tunnelMidlineToWallLeft.clone().add(node1Pos).subtract(nodeCenterToTunnel), color, wallThickness);
                    tunnelsVisual.children.push(visualWallLeft);
                }
                var tunnelsEntity = new GameFramework.Entity("Tunnels", [
                    GameFramework.Drawable.fromVisual(tunnelsVisual),
                    GameFramework.Locatable.create()
                ]);
                this.entities.push(tunnelsEntity);
                var place = new GameFramework.PlaceRoom(this.name, "Demo", size, this.entities, randomizerSeed);
                return place;
            }
            buildZoned(size, placeNameToReturnTo) {
                this.entities = [];
                this.entityBuildExit(placeNameToReturnTo);
                var zones = [];
                var placeSizeInZones = new GameFramework.Coords(3, 3, 1);
                var zonePosInZones = GameFramework.Coords.create();
                var zoneSize = size;
                var neighborOffsets = [
                    new GameFramework.Coords(1, 0, 0),
                    new GameFramework.Coords(1, 1, 0),
                    new GameFramework.Coords(0, 1, 0),
                    new GameFramework.Coords(-1, 1, 0),
                    new GameFramework.Coords(-1, 0, 0),
                    new GameFramework.Coords(-1, -1, 0),
                    new GameFramework.Coords(0, -1, 0),
                    new GameFramework.Coords(1, -1, 0)
                ];
                var neighborPos = GameFramework.Coords.create();
                var boxZeroes = new GameFramework.Box(GameFramework.Coords.create(), GameFramework.Coords.create());
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
                        var zone = new GameFramework.Zone("Zone" + zonePosInZones.toStringXY(), GameFramework.Box.fromMinAndSize(zonePos, zoneSize), neighborNames, [
                            entityBoulderCorner
                        ]);
                        zones.push(zone);
                    }
                }
                var zoneStart = zones[0];
                zoneStart.entities.push(...this.entities);
                var zonesByName = GameFramework.ArrayHelper.addLookupsByName(zones);
                var posInZones = GameFramework.Coords.create();
                var placeSize = placeSizeInZones.clone().multiply(zoneSize);
                var place = new GameFramework.PlaceZoned("Zoned", // name
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
                var mapSizeInCells = new GameFramework.Coords(mapCellSource[0].length, mapCellSource.length, 1);
                var mapCellSize = size.clone().divide(mapSizeInCells).ceiling();
                var mapCellSizeHalf = mapCellSize.clone().half();
                var entityExitPosRange = new GameFramework.Box(mapCellSize.clone().half(), null);
                var exit = this.entityBuildFromDefn(this.entityDefnsByName.get("Exit"), entityExitPosRange, this.randomizer);
                var exitPortal = exit.portal();
                exitPortal.destinationPlaceName = placeNameToReturnTo;
                exitPortal.destinationEntityName = this.name;
                this.entities.push(exit);
                var cellCollider = new GameFramework.Box(mapCellSizeHalf.clone(), mapCellSize);
                var cellCollide = (u, w, p, e0, e1) => {
                    var traversable = e0.traversable();
                    if (traversable != null) {
                        if (traversable.isBlocking) {
                            u.collisionHelper.collideEntitiesBounce(e0, e1);
                        }
                    }
                };
                var cellCollidable = new GameFramework.Collidable(0, cellCollider, [GameFramework.Playable.name], cellCollide);
                var neighborOffsets = [
                    // e, se, s, sw, w, nw, n, ne
                    new GameFramework.Coords(1, 0, 0), new GameFramework.Coords(1, 1, 0), new GameFramework.Coords(0, 1, 0),
                    new GameFramework.Coords(-1, 1, 0), new GameFramework.Coords(-1, 0, 0), new GameFramework.Coords(-1, -1, 0),
                    new GameFramework.Coords(0, -1, 0), new GameFramework.Coords(1, -1, 0)
                ];
                var colorToTerrainVisualsByName = (colorName) => {
                    var color = GameFramework.Color.byName(colorName);
                    var borderWidthAsFraction = .25;
                    var borderSizeCorner = mapCellSize.clone().multiplyScalar(borderWidthAsFraction).ceiling();
                    var borderSizeVerticalHalf = mapCellSize.clone().multiply(new GameFramework.Coords(borderWidthAsFraction, .5, 0)).ceiling();
                    var borderSizeHorizontalHalf = mapCellSize.clone().multiply(new GameFramework.Coords(.5, borderWidthAsFraction, 0)).ceiling();
                    var isCenteredFalse = false;
                    var visualsByName = new Map([
                        ["Center", new GameFramework.VisualRectangle(mapCellSize, color, null, isCenteredFalse)],
                        [
                            "InsideSE",
                            new GameFramework.VisualGroup([
                                // s
                                new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), new GameFramework.Coords(mapCellSize.x / 2, mapCellSize.y - borderSizeCorner.y, 0)),
                                // e
                                new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), new GameFramework.Coords(mapCellSize.x - borderSizeCorner.x, mapCellSize.y / 2, 0))
                            ])
                        ],
                        [
                            "InsideSW",
                            new GameFramework.VisualGroup([
                                // s
                                new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), new GameFramework.Coords(0, mapCellSize.y - borderSizeCorner.y, 0)),
                                // w
                                new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), new GameFramework.Coords(0, mapCellSize.y / 2, 0))
                            ])
                        ],
                        [
                            "InsideNW",
                            new GameFramework.VisualGroup([
                                // n
                                new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), GameFramework.Coords.create()),
                                // w
                                new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), GameFramework.Coords.create())
                            ])
                        ],
                        [
                            "InsideNE",
                            new GameFramework.VisualGroup([
                                // n
                                new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), new GameFramework.Coords(mapCellSize.x / 2, 0, 0)),
                                // e
                                new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), new GameFramework.Coords(mapCellSize.x - borderSizeCorner.x, 0, 0)),
                            ])
                        ],
                        [
                            "OutsideSE",
                            new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeCorner, color, null, isCenteredFalse), GameFramework.Coords.create())
                        ],
                        [
                            "OutsideSW",
                            new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeCorner, color, null, isCenteredFalse), new GameFramework.Coords(mapCellSize.x - borderSizeCorner.x, 0, 0))
                        ],
                        [
                            "OutsideNW",
                            new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeCorner, color, null, isCenteredFalse), new GameFramework.Coords(mapCellSize.x - borderSizeCorner.x, mapCellSize.y - borderSizeCorner.y, 0))
                        ],
                        [
                            "OutsideNE",
                            new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeCorner, color, null, isCenteredFalse), new GameFramework.Coords(0, mapCellSize.y - borderSizeCorner.y, 0))
                        ],
                        [
                            "ETop",
                            new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), new GameFramework.Coords(mapCellSize.x - borderSizeCorner.x, 0, 0))
                        ],
                        [
                            "EBottom",
                            new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), new GameFramework.Coords(mapCellSize.x - borderSizeCorner.x, mapCellSize.y / 2, 0))
                        ],
                        [
                            "SRight",
                            new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), new GameFramework.Coords(mapCellSize.x / 2, mapCellSize.y - borderSizeCorner.y, 0))
                        ],
                        [
                            "SLeft",
                            new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), new GameFramework.Coords(0, mapCellSize.y - borderSizeCorner.y, 0))
                        ],
                        [
                            "WBottom",
                            new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), new GameFramework.Coords(0, mapCellSize.y / 2, 0))
                        ],
                        [
                            "WTop",
                            new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), GameFramework.Coords.create())
                        ],
                        [
                            "NLeft",
                            new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), GameFramework.Coords.create())
                        ],
                        [
                            "NRight",
                            new GameFramework.VisualOffset(new GameFramework.VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), new GameFramework.Coords(mapCellSize.x / 2, 0, 0))
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
                var universe = this.universe;
                var terrainNameToVisuals = (terrainName) => {
                    var imageName = "Terrain-" + terrainName;
                    var terrainVisualImageCombined = new GameFramework.VisualImageFromLibrary(imageName);
                    var imageSizeInPixels = terrainVisualImageCombined.image(universe).sizeInPixels;
                    var imageSizeInTiles = new GameFramework.Coords(5, 5, 1);
                    var tileSizeInPixels = imageSizeInPixels.clone().divide(imageSizeInTiles);
                    var tileSizeInPixelsHalf = tileSizeInPixels.clone().half();
                    var tileCenterBounds = new GameFramework.Box(imageSizeInPixels.clone().half(), tileSizeInPixels);
                    var terrainVisualCenter = new GameFramework.VisualImageScaledPartial(terrainVisualImageCombined, tileCenterBounds, mapCellSize // sizeToDraw
                    );
                    // hack - Correct for centering.
                    terrainVisualCenter = new GameFramework.VisualOffset(terrainVisualCenter, mapCellSizeHalf);
                    var tileOffsetInTilesHalf = GameFramework.Coords.create();
                    var visualOffsetInMapCellsHalf = GameFramework.Coords.create();
                    var offsetsToVisual = (tileOffsetInTilesHalf, visualOffsetInMapCellsHalf) => {
                        var terrainVisualBounds = GameFramework.Box.fromMinAndSize(tileOffsetInTilesHalf.clone().multiply(tileSizeInPixelsHalf), tileSizeInPixelsHalf);
                        var terrainVisual = new GameFramework.VisualImageScaledPartial(terrainVisualImageCombined, terrainVisualBounds, mapCellSizeHalf // sizeToDraw
                        );
                        // hack - Correct for centering.
                        terrainVisual = new GameFramework.VisualOffset(terrainVisual, visualOffsetInMapCellsHalf.clone().multiply(mapCellSizeHalf));
                        return terrainVisual;
                    };
                    var terrainVisualInsideSE = offsetsToVisual(tileOffsetInTilesHalf.overwriteWithDimensions(6, 6, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, 1.5, 0));
                    var terrainVisualInsideSW = offsetsToVisual(tileOffsetInTilesHalf.overwriteWithDimensions(3, 6, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, 1.5, 0));
                    var terrainVisualInsideNW = offsetsToVisual(tileOffsetInTilesHalf.overwriteWithDimensions(3, 3, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, .5, 0));
                    var terrainVisualInsideNE = offsetsToVisual(tileOffsetInTilesHalf.overwriteWithDimensions(6, 3, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, .5, 0));
                    var terrainVisualOutsideNW = offsetsToVisual(tileOffsetInTilesHalf.overwriteWithDimensions(0, 0, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, 1.5, 0));
                    var terrainVisualOutsideNE = offsetsToVisual(tileOffsetInTilesHalf.overwriteWithDimensions(9, 0, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, 1.5, 0));
                    var terrainVisualOutsideSE = offsetsToVisual(tileOffsetInTilesHalf.overwriteWithDimensions(9, 9, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, .5, 0));
                    var terrainVisualOutsideSW = offsetsToVisual(tileOffsetInTilesHalf.overwriteWithDimensions(0, 9, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, .5, 0));
                    var terrainVisualEBottom = offsetsToVisual // really more W
                    (tileOffsetInTilesHalf.overwriteWithDimensions(0, 5, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, 1.5, 0));
                    var terrainVisualSRight = offsetsToVisual(tileOffsetInTilesHalf.overwriteWithDimensions(5, 0, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, 1.5, 0));
                    var terrainVisualSLeft = offsetsToVisual(tileOffsetInTilesHalf.overwriteWithDimensions(4, 0, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, 1.5, 0));
                    var terrainVisualWBottom = offsetsToVisual(tileOffsetInTilesHalf.overwriteWithDimensions(9, 5, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, 1.5, 0));
                    var terrainVisualWTop = offsetsToVisual(tileOffsetInTilesHalf.overwriteWithDimensions(9, 4, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, .5, 0));
                    var terrainVisualNLeft = offsetsToVisual(tileOffsetInTilesHalf.overwriteWithDimensions(4, 9, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(.5, .5, 0));
                    var terrainVisualNRight = offsetsToVisual(tileOffsetInTilesHalf.overwriteWithDimensions(5, 9, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, .5, 0));
                    var terrainVisualETop = offsetsToVisual(tileOffsetInTilesHalf.overwriteWithDimensions(0, 4, 0), visualOffsetInMapCellsHalf.overwriteWithDimensions(1.5, .5, 0));
                    var terrainVisuals = [
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
                    return terrainVisuals;
                };
                var terrains = [
                    //name, codeChar, level, isBlocking, visual
                    new GameFramework.Terrain("Water", "~", 0, new GameFramework.Traversable(true), colorToTerrainVisualsByName("Blue")),
                    new GameFramework.Terrain("Sand", ".", 1, new GameFramework.Traversable(false), terrainNameToVisuals("Sand")),
                    new GameFramework.Terrain("Grass", ":", 2, new GameFramework.Traversable(false), colorToTerrainVisualsByName("Green")),
                    new GameFramework.Terrain("Trees", "Q", 3, new GameFramework.Traversable(false), colorToTerrainVisualsByName("GreenDark")),
                    new GameFramework.Terrain("Rock", "A", 4, new GameFramework.Traversable(false), colorToTerrainVisualsByName("Gray")),
                    new GameFramework.Terrain("Snow", "*", 5, new GameFramework.Traversable(false), colorToTerrainVisualsByName("White")),
                ];
                var terrainsByName = GameFramework.ArrayHelper.addLookupsByName(terrains);
                var terrainsByCodeChar = GameFramework.ArrayHelper.addLookups(terrains, (x) => x.codeChar);
                var map = new GameFramework.MapOfCells("Terrarium", mapSizeInCells, mapCellSize, null, // cellCreate
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
                    var neighborPos = GameFramework.Coords.create();
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
                    for (var n = 1; n < neighborTerrains.length; n += 2) // corners
                     {
                        var nPrev = GameFramework.NumberHelper.wrapToRangeMax(n - 1, neighborTerrains.length);
                        var nNext = GameFramework.NumberHelper.wrapToRangeMax(n + 1, neighborTerrains.length);
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
                    var cellVisual = new GameFramework.VisualGroup(cellVisuals);
                    var cellAsEntity = new GameFramework.Entity(this.name + cellPosInCells.toString(), [
                        new GameFramework.Boundable(new GameFramework.Box(GameFramework.Coords.create(), //cellPosInPixels,
                        mapCellSize)),
                        cellCollidable.clone(),
                        GameFramework.Drawable.fromVisual(cellVisual),
                        new GameFramework.Locatable(GameFramework.Disposition.fromPos(cellPosInPixels)),
                        cellTerrain.traversable
                    ]);
                    return cellAsEntity;
                };
                var mapCellsAsEntities = map.cellsAsEntities(mapAndCellPosToEntity);
                this.entities.push(...mapCellsAsEntities);
                var entityPosRange = new GameFramework.Box(size.clone().half(), size.clone().subtract(this.marginSize));
                var randomizer = this.randomizer;
                this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Carnivore"), 1, null, entityPosRange, randomizer));
                this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Doughnut"), 1, 12, entityPosRange, randomizer));
                this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Flower"), 1, null, entityPosRange, randomizer));
                this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Grass"), 12, null, entityPosRange, randomizer));
                this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Grazer"), 3, null, entityPosRange, randomizer));
                this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("MushroomGenerator"), 2, null, entityPosRange, randomizer));
                this.entities.push(...this.entitiesBuildFromDefnAndCount(this.entityDefnsByName.get("Tree"), 6, null, entityPosRange, randomizer));
                var randomizerSeed = this.randomizer.getNextRandom();
                var place = new GameFramework.PlaceRoom(this.name, "Demo", size, this.entities, randomizerSeed);
                return place;
            }
            build_Camera(cameraViewSize, placeSize) {
                var cameraEntity = this.entityBuildCamera(cameraViewSize, placeSize);
                this.entities.push(cameraEntity);
                return cameraEntity;
            }
            build_Exterior(placePos, placeNamesToIncludePortalsTo) {
                var entityDefns = this.entityDefnsByName;
                var entities = this.entities;
                var size = this.size;
                var entityPosRange = new GameFramework.Box(size.clone().half(), size.clone().subtract(this.marginSize));
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
                var entitySize = new GameFramework.Coords(1, 1, 1).multiplyScalar(entityDimension);
                var numberOfKeysToUnlockGoal = 5;
                var goalEntity = this.entityBuildGoal(entities, entityDimension, entitySize, numberOfKeysToUnlockGoal);
                var entityPosRange = new GameFramework.Box(this.size.clone().half(), this.size.clone().subtract(this.marginSize));
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
                var wallThickness = this.entityBuildObstacleWalls(GameFramework.Color.byName("Gray"), areNeighborsConnectedESWN, namePrefix, placePos, 0 // damagePerHit
                );
                var marginThickness = wallThickness * 8;
                var marginSize = new GameFramework.Coords(1, 1, 0).multiplyScalar(marginThickness);
                this.marginSize = marginSize;
            }
            // Constructor helpers.
            entityBuildCamera(cameraViewSize, placeSize) {
                var viewSizeHalf = cameraViewSize.clone().half();
                var cameraHeightAbovePlayfield = cameraViewSize.x;
                var cameraZ = 0 - cameraHeightAbovePlayfield;
                var cameraPosBox = GameFramework.Box.fromMinAndMax(viewSizeHalf.clone().zSet(cameraZ), placeSize.clone().subtract(viewSizeHalf).zSet(cameraZ));
                var cameraPos = viewSizeHalf.clone();
                var cameraLoc = new GameFramework.Disposition(cameraPos, GameFramework.Orientation.Instances().ForwardZDownY.clone(), null);
                var camera = new GameFramework.Camera(cameraViewSize, cameraHeightAbovePlayfield, // focalLength
                cameraLoc, GameFramework.Locatable.entitiesSortByZThenY);
                var cameraBoundable = new GameFramework.Boundable(camera.viewCollider);
                var cameraCollidable = GameFramework.Collidable.fromCollider(camera.viewCollider);
                var cameraConstrainable = new GameFramework.Constrainable([
                    new GameFramework.Constraint_AttachToEntityWithName("Player"),
                    new GameFramework.Constraint_ContainInBox(cameraPosBox)
                ]);
                var cameraEntity = new GameFramework.Entity(GameFramework.Camera.name, [
                    camera,
                    cameraBoundable,
                    cameraCollidable,
                    cameraConstrainable,
                    new GameFramework.Locatable(cameraLoc),
                    GameFramework.Movable.create()
                ]);
                return cameraEntity;
            }
            entityBuildBackground(camera) {
                var returnValues = [];
                var visualBackgroundDimension = 100;
                var visualBackgroundCellSize = new GameFramework.Coords(.5, .5, .01).multiplyScalar(visualBackgroundDimension);
                var visualBackgroundBottom = new GameFramework.VisualRepeating(visualBackgroundCellSize, camera.viewSize.clone(), // viewSize
                new GameFramework.VisualRectangle(visualBackgroundCellSize, null, new GameFramework.Color(null, null, [1, 1, 1, 0.02]), null), true // expandViewStartAndEndByCell
                );
                var entityBackgroundBottom = new GameFramework.Entity("BackgroundBottom", [
                    new GameFramework.Locatable(GameFramework.Disposition.fromPos(new GameFramework.Coords(0, 0, camera.focalLength))),
                    GameFramework.Drawable.fromVisual(visualBackgroundBottom),
                ]);
                returnValues.push(entityBackgroundBottom);
                visualBackgroundCellSize =
                    new GameFramework.Coords(1, 1, .01).multiplyScalar(visualBackgroundDimension);
                var visualBackgroundTop = new GameFramework.VisualRepeating(visualBackgroundCellSize, // cellSize
                camera.viewSize.clone(), // viewSize
                new GameFramework.VisualRectangle(visualBackgroundCellSize, null, new GameFramework.Color(null, null, [1, 1, 1, 0.06]), null), true // expandViewStartAndEndByCell
                );
                var entityBackgroundTop = new GameFramework.Entity("BackgroundTop", [
                    GameFramework.Locatable.create(),
                    GameFramework.Drawable.fromVisual(visualBackgroundTop),
                ]);
                returnValues.push(entityBackgroundTop);
                return returnValues;
            }
            entityBuildExit(placeNameToReturnTo) {
                var entityPosRange = new GameFramework.Box(this.size.clone().half(), this.size.clone().subtract(this.marginSize));
                var exit = this.entityBuildFromDefn(this.entityDefnsByName.get("Exit"), entityPosRange, this.randomizer);
                var exitPortal = exit.portal();
                exitPortal.destinationPlaceName = placeNameToReturnTo;
                exitPortal.destinationEntityName = this.name;
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
            entityBuildFromDefn(entityDefn, posRange, randomizer) {
                var entity = entityDefn.clone();
                var entityLocatable = entity.locatable();
                if (entityLocatable != null) {
                    entityLocatable.loc.pos.randomize(randomizer).multiply(posRange.size).add(posRange.min());
                }
                return entity;
            }
            entityBuildGoal(entities, entityDimension, entitySize, numberOfKeysToUnlockGoal) {
                var itemKeyColor = GameFramework.Color.byName("Yellow");
                var goalPos = GameFramework.Coords.create().randomize(this.randomizer).multiplyScalar(.5).addDimensions(.25, .25, 0).multiply(this.size);
                var goalLoc = GameFramework.Disposition.fromPos(goalPos);
                var goalColor = GameFramework.Color.byName("GreenDark");
                var goalVisual = new GameFramework.VisualGroup([
                    GameFramework.VisualRectangle.fromSizeAndColorFill(entitySize, goalColor),
                    GameFramework.VisualText.fromTextAndColor("" + numberOfKeysToUnlockGoal, itemKeyColor)
                ]);
                if (this.visualsHaveText) {
                    goalVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor("Exit", goalColor), new GameFramework.Coords(0, 0 - entityDimension * 2, 0)));
                }
                var goalEntity = new GameFramework.Entity("Goal", [
                    new GameFramework.Locatable(goalLoc),
                    GameFramework.Collidable.fromCollider(new GameFramework.Box(GameFramework.Coords.create(), entitySize)),
                    GameFramework.Drawable.fromVisual(goalVisual),
                    new GameFramework.Goal(numberOfKeysToUnlockGoal),
                ]);
                entities.push(goalEntity);
                return goalEntity;
            }
            entityBuildKeys(places, entityDimension, numberOfKeysToUnlockGoal, marginSize) {
                var entityDimensionHalf = entityDimension / 2;
                var sizeMinusMargins = marginSize.clone().double().invert().add(this.size);
                var itemDefnKeyName = "Key";
                var itemKeyVisual = this.itemDefnsByName.get(itemDefnKeyName).visual;
                for (var i = 0; i < numberOfKeysToUnlockGoal; i++) {
                    var itemKeyPos = GameFramework.Coords.create().randomize(this.randomizer).multiply(sizeMinusMargins).add(marginSize);
                    var itemKeyCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                    var itemKeyEntity = new GameFramework.Entity(itemDefnKeyName + i, [
                        new GameFramework.Item(itemDefnKeyName, 1),
                        new GameFramework.Locatable(GameFramework.Disposition.fromPos(itemKeyPos)),
                        GameFramework.Collidable.fromCollider(itemKeyCollider),
                        GameFramework.Drawable.fromVisual(itemKeyVisual),
                    ]);
                    var place = GameFramework.ArrayHelper.random(places, this.randomizer);
                    place.entityToSpawnAdd(itemKeyEntity);
                }
            }
            entityBuildLoader(entityDefn, entityCount, entityPosRange, randomizer) {
                var placeBuilder = this;
                var loadable = new GameFramework.Loadable((u, w, place, e) => // load
                 {
                    var placeAsPlaceRoom = place;
                    var randomizer = new GameFramework.RandomizerLCG(placeAsPlaceRoom.randomizerSeed, null, null, null);
                    var entityPosRange = new GameFramework.Box(place.size.clone().half(), place.size.clone());
                    var entitiesCreated = placeBuilder.entitiesBuildFromDefnAndCount(entityDefn, entityCount, null, entityPosRange, randomizer);
                    place.entitiesToSpawnAdd(entitiesCreated);
                }, (u, w, p, e) => // unload
                 {
                    p.entitiesToRemove.push(...p.entities.filter(x => x.name.startsWith("Mine")));
                });
                var returnValue = new GameFramework.Entity("Loader" + entityDefn.name, [
                    loadable
                ]);
                return returnValue;
            }
            entityBuildObstacleWalls(wallColor, areNeighborsConnectedESWN, placeNamePrefix, placePos, damagePerHit) {
                areNeighborsConnectedESWN = areNeighborsConnectedESWN || [false, false, false, false];
                var entities = this.entities;
                var numberOfWalls = 4;
                var wallThickness = 5;
                var doorwayWidthHalf = wallThickness * 4;
                var portalSizeWE = new GameFramework.Coords(.25, 1, 0).multiplyScalar(2 * doorwayWidthHalf);
                var portalSizeNS = new GameFramework.Coords(1, .25, 0).multiplyScalar(2 * doorwayWidthHalf);
                var neighborOffsets = [
                    new GameFramework.Coords(1, 0, 0),
                    new GameFramework.Coords(0, 1, 0),
                    new GameFramework.Coords(-1, 0, 0),
                    new GameFramework.Coords(0, -1, 0)
                ];
                var portalCollide = (u, w, p, ePortal, eOther) => {
                    if (eOther.playable() != null) {
                        var usable = ePortal.usable();
                        if (usable == null) {
                            var portal = ePortal.portal();
                            portal.use(u, w, p, eOther, ePortal);
                        }
                    }
                };
                var forceFieldCollide = (u, w, p, ePortal, eOther) => {
                    if (eOther.playable() != null) {
                        var forceField = ePortal.forceField();
                        if (forceField != null) {
                            forceField.applyToEntity(eOther);
                        }
                    }
                };
                for (var i = 0; i < numberOfWalls; i++) {
                    var wallSize;
                    var isNorthOrSouthWall = (i % 2 == 1);
                    if (isNorthOrSouthWall) {
                        wallSize = new GameFramework.Coords(this.size.x, wallThickness, 1);
                    }
                    else {
                        wallSize = new GameFramework.Coords(wallThickness, this.size.y, 1);
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
                    var wallCollider = new GameFramework.Box(GameFramework.Coords.create(), wallSize);
                    var wallObstacle = new GameFramework.Obstacle();
                    var wallCollidable = new GameFramework.Collidable(0, wallCollider, [GameFramework.Movable.name], wallObstacle.collide);
                    var wallVisual = GameFramework.VisualRectangle.fromSizeAndColorFill(wallSize, wallColor);
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
                        var wallPartLoc = new GameFramework.Disposition(wallPartPos, null, null);
                        var wallEntity = new GameFramework.Entity("ObstacleWall" + i + "_" + d, [
                            new GameFramework.Locatable(wallPartLoc),
                            wallCollidable,
                            GameFramework.Drawable.fromVisual(wallVisual),
                            wallObstacle
                        ]);
                        if (damagePerHit > 0) {
                            var damager = new GameFramework.Damager(new GameFramework.Damage(10, null, null));
                            wallEntity.propertyAddForPlace(damager, null);
                        }
                        entities.push(wallEntity);
                    }
                    if (isNeighborConnected) {
                        var portalPos = wallPos.clone();
                        var neighborOffset = neighborOffsets[i];
                        var portalSize = (i % 2 == 0) ? portalSizeWE : portalSizeNS;
                        portalPos.add(neighborOffset.clone().multiply(portalSize));
                        var neighborPos = placePos.clone().add(neighborOffset);
                        var neighborName = placeNamePrefix + neighborPos.toStringXY();
                        var portal = new GameFramework.Portal(neighborName, "PortalToNeighbor" + ((i + 2) % 4), neighborOffset.clone().double());
                        var portalBox = new GameFramework.Box(GameFramework.Coords.create(), portalSize);
                        var collidable = new GameFramework.Collidable(0, portalBox, [GameFramework.Playable.name], portalCollide);
                        var locatable = new GameFramework.Locatable(new GameFramework.Disposition(portalPos, null, null));
                        var portalEntity = new GameFramework.Entity("PortalToNeighbor" + i, [
                            collidable,
                            locatable,
                            GameFramework.Movable.create(),
                            portal
                        ]);
                        entities.push(portalEntity);
                        var forceField = new GameFramework.ForceField(null, neighborOffset.clone().invert());
                        var forceFieldCollidable = new GameFramework.Collidable(0, portalBox, [GameFramework.Playable.name], forceFieldCollide);
                        var forceFieldEntity = new GameFramework.Entity("PortalToNeighbor" + i + "_ForceField", [
                            forceFieldCollidable,
                            forceField,
                            locatable,
                            GameFramework.Movable.create() // hack - For CollisionTracker.
                        ]);
                        entities.push(forceFieldEntity);
                    }
                }
                return wallThickness;
            }
            entityBuildRadioMessage(visualForPortrait, message) {
                return new GameFramework.Entity("RadioMessage", [
                    new GameFramework.Recurrent(20, // ticksPerRecurrence
                    1, // timesToRecur
                    // recur
                    (u, w, p, e) => {
                        var player = p.player();
                        var playerItemHolder = player.itemHolder();
                        var itemRadio = new GameFramework.Item("Walkie-Talkie", 1);
                        var doesPlayerHaveRadio = playerItemHolder.hasItem(itemRadio);
                        if (doesPlayerHaveRadio == false) {
                            e.recurrent().timesRecurredSoFar = 0;
                        }
                        else {
                            var wordBubble = new GameFramework.WordBubble(visualForPortrait, [
                                message
                            ]);
                            var wordBubbleAsControl = wordBubble.toControl(u);
                            var venuesForLayers = [
                                u.venueCurrent,
                                wordBubbleAsControl.toVenue()
                            ];
                            u.venueNext = new GameFramework.VenueLayered(venuesForLayers, null);
                        }
                    })
                ]);
            }
            entityDefnBuildStore(entityDimension) {
                var storeColor = GameFramework.Color.byName("Brown");
                var entitySize = new GameFramework.Coords(1, 1, 1).multiplyScalar(entityDimension);
                var visual = new GameFramework.VisualGroup([
                    GameFramework.VisualRectangle.fromSizeAndColorFill(new GameFramework.Coords(1, 1.5, 0).multiplyScalar(entityDimension), storeColor),
                    new GameFramework.VisualOffset(GameFramework.VisualRectangle.fromSizeAndColorFill(new GameFramework.Coords(1.1, .2, 0).multiplyScalar(entityDimension), GameFramework.Color.byName("Gray")), new GameFramework.Coords(0, -.75, 0).multiplyScalar(entityDimension)),
                ]);
                if (this.visualsHaveText) {
                    visual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor("Store", storeColor), new GameFramework.Coords(0, 0 - entityDimension * 2, 0)));
                }
                var storeEntityDefn = new GameFramework.Entity("Store", [
                    GameFramework.Collidable.fromCollider(new GameFramework.Box(GameFramework.Coords.create(), entitySize)),
                    GameFramework.Drawable.fromVisual(visual),
                    new GameFramework.ItemStore("Coin"),
                    new GameFramework.ItemHolder([
                        new GameFramework.Item("Coin", 100),
                        new GameFramework.Item("Bow", 1),
                        new GameFramework.Item("Key", 10),
                        new GameFramework.Item("Medicine", 100)
                    ].map(x => x.toEntity()), null, // weightMax
                    null // reachRadius
                    ),
                    GameFramework.Locatable.create(),
                    new GameFramework.Usable((u, w, p, eUsing, eUsed) => {
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
                var itemAccessoryCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var itemAccessoryEntityDefn = new GameFramework.Entity(itemDefnAccessoryName, [
                    new GameFramework.Item(itemDefnAccessoryName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemAccessoryCollider),
                    GameFramework.Drawable.fromVisual(itemAccessoryVisual),
                    GameFramework.Equippable.create()
                ]);
                return itemAccessoryEntityDefn;
            }
            entityDefnBuildArmor(entityDimension) {
                var itemDefnArmorName = "Armor";
                var itemDefn = this.itemDefnsByName.get(itemDefnArmorName);
                var itemArmorVisual = itemDefn.visual;
                var path = itemArmorVisual.children[0].verticesAsPath;
                var itemArmorCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimension / 2);
                var collidable = GameFramework.Collidable.fromCollider(itemArmorCollider);
                var box = new GameFramework.Box(GameFramework.Coords.create(), GameFramework.Coords.create()).ofPoints(path.points);
                box.center = itemArmorCollider.center;
                var boundable = new GameFramework.Boundable(box);
                var itemArmorEntityDefn = new GameFramework.Entity(itemDefnArmorName, [
                    new GameFramework.Armor(.5),
                    boundable,
                    collidable,
                    GameFramework.Equippable.create(),
                    new GameFramework.Item(itemDefnArmorName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Drawable.fromVisual(itemArmorVisual),
                ]);
                return itemArmorEntityDefn;
            }
            entityDefnBuildArrow(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var itemDefnArrowName = "Arrow";
                var itemArrowVisual = this.itemDefnsByName.get(itemDefnArrowName).visual;
                var arrowSize = new GameFramework.Coords(1, 1, 1);
                var itemArrowCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var collidable = GameFramework.Collidable.fromCollider(itemArrowCollider);
                var bounds = new GameFramework.Box(itemArrowCollider.center, arrowSize);
                var boundable = new GameFramework.Boundable(bounds);
                var roundsPerPile = 5;
                var itemArrowEntityDefn = new GameFramework.Entity(itemDefnArrowName, [
                    boundable,
                    collidable,
                    GameFramework.Drawable.fromVisual(itemArrowVisual),
                    new GameFramework.Item(itemDefnArrowName, roundsPerPile),
                    GameFramework.Locatable.create(),
                ]);
                return itemArrowEntityDefn;
            }
            entityDefnBuildBomb(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var itemDefnBombName = "Bomb";
                var itemBombVisual = this.itemDefnsByName.get(itemDefnBombName).visual;
                var itemBombCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var itemBombDevice = new GameFramework.Device("Bomb", 10, // ticksToCharge
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
                    var projectileVisual = new GameFramework.VisualGroup([
                        entityDevice.drawable().visual
                        // todo - Add sparks?
                    ]);
                    var userDirection = userVel.clone().normalize();
                    var userRadius = entityUser.collidable().collider.radius;
                    var projectilePos = userPos.clone().add(userDirection.clone().multiplyScalar(userRadius + projectileDimension).double());
                    var projectileOri = new GameFramework.Orientation(userVel.clone().normalize(), null);
                    var projectileLoc = new GameFramework.Disposition(projectilePos, projectileOri, null);
                    projectileLoc.vel.overwriteWith(userVel).clearZ().double();
                    var projectileCollider = new GameFramework.Sphere(GameFramework.Coords.create(), projectileDimension);
                    // todo
                    var projectileCollide = null;
                    var projectileDie = (u, w, p, entityDying) => {
                        var explosionRadius = 32;
                        var explosionVisual = GameFramework.VisualCircle.fromRadiusAndColorFill(explosionRadius, GameFramework.Color.byName("Yellow"));
                        var explosionCollider = new GameFramework.Sphere(GameFramework.Coords.create(), explosionRadius);
                        var explosionCollide = (universe, world, place, entityProjectile, entityOther) => {
                            var killable = entityOther.killable();
                            if (killable != null) {
                                killable.damageApply(universe, world, place, entityProjectile, entityOther, entityProjectile.damager().damagePerHit);
                            }
                        };
                        var explosionEntity = new GameFramework.Entity("BombExplosion", [
                            new GameFramework.Collidable(0, explosionCollider, [GameFramework.Killable.name], explosionCollide),
                            new GameFramework.Damager(new GameFramework.Damage(20, null, null)),
                            GameFramework.Drawable.fromVisual(explosionVisual),
                            new GameFramework.Ephemeral(8, null),
                            entityDying.locatable()
                        ]);
                        p.entityToSpawnAdd(explosionEntity);
                    };
                    var projectileEntity = new GameFramework.Entity("ProjectileBomb", [
                        new GameFramework.Ephemeral(64, projectileDie),
                        new GameFramework.Locatable(projectileLoc),
                        new GameFramework.Collidable(0, projectileCollider, [GameFramework.Collidable.name], projectileCollide),
                        new GameFramework.Constrainable([new GameFramework.Constraint_FrictionXY(.03, .5)]),
                        GameFramework.Drawable.fromVisual(projectileVisual),
                        GameFramework.Equippable.create()
                    ]);
                    p.entityToSpawnAdd(projectileEntity);
                });
                var itemBombEntityDefn = new GameFramework.Entity(itemDefnBombName, [
                    new GameFramework.Item(itemDefnBombName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemBombCollider),
                    itemBombDevice,
                    GameFramework.Drawable.fromVisual(itemBombVisual),
                    GameFramework.Equippable.create()
                ]);
                return itemBombEntityDefn;
            }
            entityDefnBuildBook(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var itemDefnBookName = "Book";
                var itemBookVisual = this.itemDefnsByName.get(itemDefnBookName).visual;
                var itemBookCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var itemBookEntityDefn = new GameFramework.Entity(itemDefnBookName, [
                    new GameFramework.Item(itemDefnBookName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemBookCollider),
                    GameFramework.Drawable.fromVisual(itemBookVisual),
                ]);
                return itemBookEntityDefn;
            }
            entityDefnBuildBow(entityDimension) {
                entityDimension = entityDimension * 2;
                var itemDefnName = "Bow";
                var itemBowVisual = this.itemDefnsByName.get(itemDefnName).visual;
                var itemBowCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimension / 2);
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
                    var projectileOri = new GameFramework.Orientation(userVel.clone().normalize(), null);
                    var projectileLoc = new GameFramework.Disposition(projectilePos, projectileOri, null);
                    projectileLoc.vel.overwriteWith(userVel).clearZ().double();
                    var projectileCollider = new GameFramework.Sphere(GameFramework.Coords.create(), projectileDimension);
                    var projectileCollide = (universe, world, place, entityProjectile, entityOther) => {
                        var killable = entityOther.killable();
                        if (killable != null) {
                            killable.damageApply(universe, world, place, entityProjectile, entityOther, null);
                            entityProjectile.killable().integrity = 0;
                        }
                    };
                    var visualStrike = GameFramework.VisualCircle.fromRadiusAndColorFill(8, GameFramework.Color.byName("Red"));
                    var killable = new GameFramework.Killable(1, // integrityMax
                    null, // damageApply
                    (universe, world, place, entityKillable) => // die
                     {
                        var entityStrike = new GameFramework.Entity("ArrowStrike", [
                            new GameFramework.Ephemeral(8, null),
                            GameFramework.Drawable.fromVisual(visualStrike),
                            entityKillable.locatable()
                        ]);
                        place.entityToSpawnAdd(entityStrike);
                    });
                    var projectileEntity = new GameFramework.Entity("ProjectileArrow", [
                        new GameFramework.Damager(new GameFramework.Damage(10, null, null)),
                        new GameFramework.Ephemeral(32, null),
                        killable,
                        new GameFramework.Locatable(projectileLoc),
                        new GameFramework.Collidable(0, // ticksToWaitBetweenCollisions
                        projectileCollider, [GameFramework.Killable.name], projectileCollide),
                        GameFramework.Drawable.fromVisual(projectileVisual),
                    ]);
                    p.entityToSpawnAdd(projectileEntity);
                };
                var itemBowDevice = new GameFramework.Device("Bow", 10, // ticksToCharge
                (u, w, p, entity) => // initialize
                 {
                    // todo
                }, (u, w, p, e) => // update
                 {
                    // todo
                }, itemBowUse);
                var itemBowEntityDefn = new GameFramework.Entity(itemDefnName, [
                    new GameFramework.Item(itemDefnName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemBowCollider),
                    GameFramework.Drawable.fromVisual(itemBowVisual),
                    GameFramework.Equippable.create(),
                    itemBowDevice
                ]);
                return itemBowEntityDefn;
            }
            entityDefnBuildBread(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var itemDefnBreadName = "Bread";
                var itemBreadVisual = this.itemDefnsByName.get(itemDefnBreadName).visual;
                var itemBreadCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var itemBreadEntityDefn = new GameFramework.Entity(itemDefnBreadName, [
                    new GameFramework.Item(itemDefnBreadName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemBreadCollider),
                    GameFramework.Drawable.fromVisual(itemBreadVisual),
                ]);
                return itemBreadEntityDefn;
            }
            entityDefnBuildCar(entityDimension) {
                entityDimension *= .75;
                var defnName = "Car";
                var frames = new Array();
                var frameSizeScaled = new GameFramework.Coords(4, 3, 0).multiplyScalar(entityDimension);
                var visualTileset = new GameFramework.VisualImageFromLibrary("Car");
                var tileSizeInPixels = new GameFramework.Coords(64, 48, 0);
                var tilesetSizeInTiles = new GameFramework.Coords(8, 4, 0);
                var tilePosInTiles = GameFramework.Coords.create();
                for (var y = 0; y < tilesetSizeInTiles.y; y++) {
                    tilePosInTiles.y = y;
                    for (var x = 0; x < tilesetSizeInTiles.x; x++) {
                        tilePosInTiles.x = x;
                        var regionPos = tileSizeInPixels.clone().multiply(tilePosInTiles);
                        var regionToDrawAsBox = GameFramework.Box.fromMinAndSize(regionPos, tileSizeInPixels);
                        var visualForFrame = new GameFramework.VisualImageScaledPartial(visualTileset, regionToDrawAsBox, frameSizeScaled);
                        frames.push(visualForFrame);
                    }
                }
                var carVisualBody = new GameFramework.VisualDirectional(frames[0], // visualForNoDirection
                frames, // visualsForDirections
                null // headingInTurnsGetForEntity
                );
                var carVisual = new GameFramework.VisualGroup([
                    carVisualBody
                ]);
                if (this.visualsHaveText) {
                    carVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(defnName, GameFramework.Color.byName("Blue")), new GameFramework.Coords(0, 0 - entityDimension * 2.5, 0)));
                }
                var carCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimension / 2);
                var carCollide = (universe, world, place, entityVehicle, entityOther) => {
                    if (entityOther.portal() != null) {
                        var usable = entityOther.usable();
                        if (usable == null) {
                            var portal = entityOther.portal();
                            portal.use(universe, world, place, entityVehicle, entityOther);
                        }
                    }
                    else {
                        universe.collisionHelper.collideEntitiesBlock(entityVehicle, entityOther);
                    }
                };
                var carCollidable = new GameFramework.Collidable(0, carCollider, [GameFramework.Collidable.name], carCollide);
                var carConstrainable = new GameFramework.Constrainable([
                    new GameFramework.Constraint_FrictionXY(.03, .2)
                ]);
                var carLoc = GameFramework.Disposition.create();
                //carLoc.spin = new Rotation(Coords.Instances().ZeroZeroOne, new Reference(.01));
                var carUsable = new GameFramework.Usable((u, w, p, eUsing, eUsed) => {
                    var vehicle = eUsed.propertiesByName.get(GameFramework.Vehicle.name);
                    vehicle.entityOccupant = eUsing;
                    p.entitiesToRemove.push(eUsing);
                    return null;
                });
                var vehicle = new GameFramework.Vehicle(.2, // accelerationPerTick
                5, // speedMax
                .01 // steeringAngleInTurns
                );
                var carEntityDefn = new GameFramework.Entity(defnName, [
                    new GameFramework.Locatable(carLoc),
                    carCollidable,
                    carConstrainable,
                    GameFramework.Drawable.fromVisual(carVisual),
                    carUsable,
                    vehicle
                ]);
                return carEntityDefn;
            }
            entityDefnBuildCoin(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var itemDefnCoinName = "Coin";
                var itemCoinVisual = this.itemDefnsByName.get(itemDefnCoinName).visual;
                var itemCoinCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var itemCoinEntityDefn = new GameFramework.Entity(itemDefnCoinName, [
                    new GameFramework.Item(itemDefnCoinName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemCoinCollider),
                    GameFramework.Drawable.fromVisual(itemCoinVisual),
                ]);
                return itemCoinEntityDefn;
            }
            entityDefnBuildCrystal(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var itemDefnCrystalName = "Crystal";
                var itemCrystalVisual = this.itemDefnsByName.get(itemDefnCrystalName).visual;
                var itemCrystalCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var itemCrystalEntityDefn = new GameFramework.Entity(itemDefnCrystalName, [
                    GameFramework.Collidable.fromCollider(itemCrystalCollider),
                    GameFramework.Drawable.fromVisual(itemCrystalVisual),
                    new GameFramework.Item(itemDefnCrystalName, 1),
                    GameFramework.Locatable.create()
                ]);
                return itemCrystalEntityDefn;
            }
            entityDefnBuildDoughnut(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var itemDefnDoughnutName = "Doughnut";
                var itemDoughnutVisual = this.itemDefnsByName.get(itemDefnDoughnutName).visual;
                var itemDoughnutCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var itemDoughnutEntityDefn = new GameFramework.Entity(itemDefnDoughnutName, [
                    new GameFramework.Item(itemDefnDoughnutName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemDoughnutCollider),
                    GameFramework.Drawable.fromVisual(itemDoughnutVisual),
                ]);
                return itemDoughnutEntityDefn;
            }
            entityDefnBuildFlower(entityDimension) {
                entityDimension *= .5;
                var itemDefnName = "Flower";
                var visual = this.itemDefnsByName.get(itemDefnName).visual;
                var collider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimension);
                var entityDefn = new GameFramework.Entity(itemDefnName, [
                    new GameFramework.Item(itemDefnName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(collider),
                    GameFramework.Drawable.fromVisual(visual)
                ]);
                return entityDefn;
            }
            entityDefnBuildFruit(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var itemDefnFruitName = "Fruit";
                var itemFruitVisual = this.itemDefnsByName.get(itemDefnFruitName).visual;
                var itemFruitCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var itemFruitEntityDefn = new GameFramework.Entity(itemDefnFruitName, [
                    new GameFramework.Item(itemDefnFruitName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemFruitCollider),
                    GameFramework.Drawable.fromVisual(itemFruitVisual)
                ]);
                return itemFruitEntityDefn;
            }
            entityDefnBuildGenerator(entityDefnToGenerate) {
                var generator = new GameFramework.Generator(entityDefnToGenerate, 1200, // ticksToGenerate
                1 // entitiesGeneratedMax
                );
                var entityDefnGenerator = new GameFramework.Entity(entityDefnToGenerate.name + "Generator", [
                    generator,
                    GameFramework.Locatable.create()
                ]);
                return entityDefnGenerator;
            }
            entityDefnBuildGrass(entityDimension) {
                entityDimension /= 2;
                var itemDefnName = "Grass";
                var itemGrassVisual = this.itemDefnsByName.get(itemDefnName).visual;
                var itemGrassCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimension / 2);
                var itemGrassEntityDefn = new GameFramework.Entity(itemDefnName, [
                    new GameFramework.Item(itemDefnName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemGrassCollider),
                    GameFramework.Drawable.fromVisual(itemGrassVisual)
                ]);
                return itemGrassEntityDefn;
            }
            entityDefnBuildHeart(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var itemDefnHeartName = "Heart";
                var itemHeartVisual = this.itemDefnsByName.get(itemDefnHeartName).visual;
                var itemHeartCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var itemHeartEntityDefn = new GameFramework.Entity(itemDefnHeartName, [
                    new GameFramework.Item(itemDefnHeartName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemHeartCollider),
                    GameFramework.Drawable.fromVisual(itemHeartVisual)
                ]);
                return itemHeartEntityDefn;
            }
            entityDefnBuildIron(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var itemDefnIronName = "Iron";
                var itemIronVisual = this.itemDefnsByName.get(itemDefnIronName).visual;
                var itemIronCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var itemIronEntityDefn = new GameFramework.Entity(itemDefnIronName, [
                    new GameFramework.Item(itemDefnIronName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemIronCollider),
                    GameFramework.Drawable.fromVisual(itemIronVisual)
                ]);
                return itemIronEntityDefn;
            }
            entityDefnBuildIronOre(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var itemDefnOreName = "Iron Ore";
                var itemOreVisual = this.itemDefnsByName.get(itemDefnOreName).visual;
                var itemOreCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var itemOreEntityDefn = new GameFramework.Entity(itemDefnOreName, [
                    new GameFramework.Item(itemDefnOreName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemOreCollider),
                    GameFramework.Drawable.fromVisual(itemOreVisual)
                ]);
                return itemOreEntityDefn;
            }
            entityDefnBuildLog(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var itemDefnLogName = "Log";
                var itemLogVisual = this.itemDefnsByName.get(itemDefnLogName).visual;
                var itemLogCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var itemLogEntityDefn = new GameFramework.Entity(itemDefnLogName, [
                    new GameFramework.Item(itemDefnLogName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemLogCollider),
                    GameFramework.Drawable.fromVisual(itemLogVisual)
                ]);
                return itemLogEntityDefn;
            }
            entityDefnBuildMeat(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var itemDefnMeatName = "Meat";
                var itemMeatDefn = this.itemDefnsByName.get(itemDefnMeatName);
                var itemMeatVisual = itemMeatDefn.visual;
                var itemMeatCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var itemMeatEntityDefn = new GameFramework.Entity(itemDefnMeatName, [
                    new GameFramework.Item(itemDefnMeatName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemMeatCollider),
                    GameFramework.Drawable.fromVisual(itemMeatVisual),
                    new GameFramework.Usable(itemMeatDefn.use)
                ]);
                return itemMeatEntityDefn;
            }
            entityDefnBuildMedicine(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var itemDefnMedicineName = "Medicine";
                var itemMedicineVisual = this.itemDefnsByName.get(itemDefnMedicineName).visual;
                var itemMedicineCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var itemMedicineEntityDefn = new GameFramework.Entity(itemDefnMedicineName, [
                    new GameFramework.Item(itemDefnMedicineName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemMedicineCollider),
                    GameFramework.Drawable.fromVisual(itemMedicineVisual),
                    GameFramework.Equippable.create()
                ]);
                return itemMedicineEntityDefn;
            }
            entityDefnBuildMushroom(entityDimension) {
                entityDimension /= 2;
                var itemDefnName = "Mushroom";
                var itemMushroomVisual = this.itemDefnsByName.get(itemDefnName).visual;
                var itemMushroomCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimension / 2);
                var itemMushroomEntityDefn = new GameFramework.Entity(itemDefnName, [
                    new GameFramework.Item(itemDefnName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemMushroomCollider),
                    GameFramework.Drawable.fromVisual(itemMushroomVisual)
                ]);
                return itemMushroomEntityDefn;
            }
            entityDefnBuildPick(entityDimension) {
                var itemDefnName = "Pick";
                var itemPickVisual = this.itemDefnsByName.get(itemDefnName).visual;
                var itemPickCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimension / 2);
                var itemPickDevice = new GameFramework.Device("Pick", 10, // ticksToCharge
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
                var itemPickEntityDefn = new GameFramework.Entity(itemDefnName, [
                    new GameFramework.Item(itemDefnName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemPickCollider),
                    itemPickDevice,
                    GameFramework.Drawable.fromVisual(itemPickVisual),
                    GameFramework.Equippable.create()
                ]);
                return itemPickEntityDefn;
            }
            entityDefnBuildPotion(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var itemDefnPotionName = "Potion";
                var itemPotionColor = GameFramework.Color.byName("Blue");
                var itemPotionVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(1, 1, 0),
                        new GameFramework.Coords(-1, 1, 0),
                        new GameFramework.Coords(-.2, 0, 0),
                        new GameFramework.Coords(-.2, -.5, 0),
                        new GameFramework.Coords(.2, -.5, 0),
                        new GameFramework.Coords(.2, 0, 0)
                    ]).transform(GameFramework.Transform_Scale.fromScalar(entityDimension)), itemPotionColor, GameFramework.Color.byName("White"))
                ]);
                if (this.visualsHaveText) {
                    itemPotionVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemDefnPotionName, itemPotionColor), new GameFramework.Coords(0, 0 - entityDimension, 0)));
                }
                var itemPotionCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var itemPotionEntityDefn = new GameFramework.Entity(itemDefnPotionName, [
                    new GameFramework.Item(itemDefnPotionName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemPotionCollider),
                    GameFramework.Drawable.fromVisual(itemPotionVisual)
                ]);
                return itemPotionEntityDefn;
            }
            entityDefnBuildShovel(entityDimension) {
                var itemDefnName = "Shovel";
                var itemShovelVisual = this.itemDefnsByName.get(itemDefnName).visual;
                var itemShovelCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimension / 2);
                var itemShovelDevice = new GameFramework.Device("Shovel", 10, // ticksToCharge
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
                var itemShovelEntityDefn = new GameFramework.Entity(itemDefnName, [
                    new GameFramework.Item(itemDefnName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemShovelCollider),
                    itemShovelDevice,
                    GameFramework.Drawable.fromVisual(itemShovelVisual),
                    GameFramework.Equippable.create()
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
                var itemSwordCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimension / 2);
                var itemSwordDeviceUse = (universe, world, place, entityUser, entityDevice) => // use
                 {
                    var userLoc = entityUser.locatable().loc;
                    var userPos = userLoc.pos;
                    var userVel = userLoc.vel;
                    var userSpeed = userVel.magnitude();
                    if (userSpeed == 0) {
                        return;
                    }
                    var userTirable = entityUser.tirable();
                    var staminaToFire = 10;
                    if (userTirable.stamina < staminaToFire) {
                        var message = "Too tired!";
                        place.entitySpawn(universe, world, universe.entityBuilder.messageFloater(message, userPos.clone(), GameFramework.Color.byName("Red")));
                        return;
                    }
                    userTirable.staminaSubtract(staminaToFire);
                    var userDirection = userVel.clone().normalize();
                    var userRadius = entityUser.collidable().collider.radius;
                    var projectileDimension = 1.5;
                    var projectilePos = userPos.clone().add(userDirection.clone().multiplyScalar(userRadius + projectileDimension).double());
                    var projectileOri = new GameFramework.Orientation(userVel.clone().normalize(), null);
                    var projectileVisual = entityDevice.drawable().visual;
                    projectileVisual = projectileVisual.children[0].clone();
                    projectileVisual.transform(new GameFramework.Transform_RotateRight(1));
                    var projectileLoc = new GameFramework.Disposition(projectilePos, projectileOri, null);
                    projectileLoc.vel.overwriteWith(userVel).clearZ().double();
                    var projectileCollider = new GameFramework.Sphere(GameFramework.Coords.create(), projectileDimension);
                    var projectileCollide = (universe, world, place, entityProjectile, entityOther) => {
                        var killable = entityOther.killable();
                        if (killable != null) {
                            var damageToApply = entityProjectile.damager().damagePerHit;
                            killable.damageApply(universe, world, place, entityProjectile, entityOther, damageToApply);
                            entityProjectile.killable().integrity = 0;
                        }
                    };
                    var visualStrike = GameFramework.VisualCircle.fromRadiusAndColorFill(8, GameFramework.Color.byName("Red"));
                    var killable = new GameFramework.Killable(1, // integrityMax
                    null, // damageApply
                    (universe, world, place, entityKillable) => // die
                     {
                        var entityStrike = new GameFramework.Entity("SwordStrike", [
                            new GameFramework.Ephemeral(8, null),
                            GameFramework.Drawable.fromVisual(visualStrike),
                            entityKillable.locatable()
                        ]);
                        place.entityToSpawnAdd(entityStrike);
                    });
                    var effectsAndChances = new Array();
                    if (damageTypeName != null) {
                        var effect;
                        if (damageTypeName == "Cold") {
                            effect = GameFramework.Effect.Instances().Frozen;
                        }
                        else if (damageTypeName == "Heat") {
                            effect = GameFramework.Effect.Instances().Burning;
                        }
                        else {
                            throw ("Unrecognized damage type: " + damageTypeName);
                        }
                        var effectAndChance = [effect, 1];
                        effectsAndChances = [effectAndChance];
                    }
                    var projectileDamager = new GameFramework.Damager(new GameFramework.Damage(10, damageTypeName, effectsAndChances));
                    var projectileEntity = new GameFramework.Entity("ProjectileSword", [
                        projectileDamager,
                        new GameFramework.Ephemeral(8, null),
                        killable,
                        new GameFramework.Locatable(projectileLoc),
                        new GameFramework.Collidable(0, projectileCollider, [GameFramework.Killable.name], projectileCollide),
                        GameFramework.Drawable.fromVisual(projectileVisual)
                    ]);
                    place.entityToSpawnAdd(projectileEntity);
                };
                var itemSwordDevice = new GameFramework.Device(itemDefnName, 10, // ticksToCharge
                null, // init
                null, // update
                itemSwordDeviceUse);
                var itemSwordVisual = this.itemDefnsByName.get(itemDefnName).visual.clone();
                itemSwordVisual.transform(new GameFramework.Transform_Translate(new GameFramework.Coords(0, -1.1 * entityDimension, 0)));
                var itemSwordEntityDefn = new GameFramework.Entity(itemDefnName, [
                    new GameFramework.Item(itemDefnName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemSwordCollider),
                    GameFramework.Drawable.fromVisual(itemSwordVisual),
                    itemSwordDevice,
                    GameFramework.Equippable.create()
                ]);
                return itemSwordEntityDefn;
            }
            entityDefnBuildToolset(entityDimension) {
                var itemDefnName = "Toolset";
                var itemToolsetVisual = this.itemDefnsByName.get(itemDefnName).visual;
                var itemToolsetCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimension / 2);
                var itemToolsetEntityDefn = new GameFramework.Entity(itemDefnName, [
                    new GameFramework.Item(itemDefnName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemToolsetCollider),
                    GameFramework.Drawable.fromVisual(itemToolsetVisual)
                ]);
                return itemToolsetEntityDefn;
            }
            entityDefnBuildTorch(entityDimension) {
                var itemDefnName = "Torch";
                var itemTorchVisual = this.itemDefnsByName.get(itemDefnName).visual;
                var itemTorchCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimension / 2);
                var itemTorchEntityDefn = new GameFramework.Entity(itemDefnName, [
                    GameFramework.Animatable.create(),
                    new GameFramework.Item(itemDefnName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemTorchCollider),
                    GameFramework.Drawable.fromVisual(itemTorchVisual)
                ]);
                return itemTorchEntityDefn;
            }
            entityDefnBuildWeight(entityDimension) {
                var itemDefnName = "Weight";
                var itemWeightVisual = this.itemDefnsByName.get(itemDefnName).visual;
                var itemWeightCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimension / 2);
                var itemWeightEntityDefn = new GameFramework.Entity(itemDefnName, [
                    new GameFramework.Item(itemDefnName, 1),
                    GameFramework.Locatable.create(),
                    GameFramework.Collidable.fromCollider(itemWeightCollider),
                    GameFramework.Drawable.fromVisual(itemWeightVisual)
                ]);
                return itemWeightEntityDefn;
            }
            entityDefnsBuild(entityDimension) {
                var entityDefnFlower = this.entityDefnBuildFlower(entityDimension);
                var entityDefnGrass = this.entityDefnBuildGrass(entityDimension);
                var entityDefnMushroom = this.entityDefnBuildMushroom(entityDimension);
                var eb = this.emplacementsBuilder;
                var mb = this.moversBuilder;
                var entityDefns = [
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
        GameFramework.PlaceBuilderDemo = PlaceBuilderDemo;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
