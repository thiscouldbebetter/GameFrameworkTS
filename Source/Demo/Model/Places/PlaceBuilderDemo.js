"use strict";
class PlaceBuilderDemo // Main.
 {
    constructor(universe, randomizer, cameraViewSize) {
        this.universe = universe;
        this.randomizer = randomizer || RandomizerLCG.default();
        this.visualsHaveText = false;
        this.entityDimension = 10;
        this.actionsBuilder = new PlaceBuilderDemo_Actions(this);
        this.emplacementsBuilder = new PlaceBuilderDemo_Emplacements(this);
        this.itemsBuilder = new PlaceBuilderDemo_Items(this);
        this.moversBuilder = new PlaceBuilderDemo_Movers(this);
        this.actions = this.actionsBuilder.actionsBuild();
        this.actionToInputsMappings = this.actionsBuilder.actionToInputsMappingsBuild();
        this.activityDefns = this.actionsBuilder.activityDefnsBuild();
        this.cameraViewSize = cameraViewSize;
        this.itemDefns = this.itemsBuilder.itemDefnsBuild();
        this.itemDefnsByName = ArrayHelper.addLookupsByName(this.itemDefns);
        this.entityDefns = this.entityDefnsBuild();
        this.entityDefnsByName = ArrayHelper.addLookupsByName(this.entityDefns);
        this.fontHeight = 10;
    }
    buildBase(size, placeNameToReturnTo) {
        this.build_Interior("Base", size, placeNameToReturnTo);
        var entityPosRange = new Box(size.clone().half(), size.clone().subtract(this.marginSize));
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
        var itemOre = itemEntityOre.item();
        itemOre.quantity = 3; // For crafting.
        container.itemHolder().itemAdd(itemOre);
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
            this.build_Goal();
        }
        this.entitiesAllGround();
        var entityCamera = this.build_Camera(this.cameraViewSize, this.size);
        this.entities.splice(0, 0, ...this.entityBuildBackground(entityCamera.camera()));
        var randomizerSeed = this.randomizer.getNextRandom();
        var place = new PlaceRoom(this.name, "Demo", size, this.entities, randomizerSeed);
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
        //var tunnelsVisual = new VisualNetwork(network);
        var tunnelsVisual = new VisualGroup([]);
        var wallThickness = 4; // todo
        var tunnelWidth = wallThickness * 8;
        var color = Color.byName("Red");
        var nodes = network.nodes;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var visualWallNode = new VisualOffset(new VisualCircle(tunnelWidth, null, color, wallThickness), node.pos.clone());
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
            var visualWallRight = new VisualLine(tunnelMidlineToWallRight.clone().add(node0Pos).add(nodeCenterToTunnel), tunnelMidlineToWallRight.clone().add(node1Pos).subtract(nodeCenterToTunnel), color, wallThickness);
            tunnelsVisual.children.push(visualWallRight);
            var visualWallLeft = new VisualLine(tunnelMidlineToWallLeft.clone().add(node0Pos).add(nodeCenterToTunnel), tunnelMidlineToWallLeft.clone().add(node1Pos).subtract(nodeCenterToTunnel), color, wallThickness);
            tunnelsVisual.children.push(visualWallLeft);
        }
        var tunnelsEntity = new Entity("Tunnels", [
            Drawable.fromVisual(tunnelsVisual),
            Locatable.create()
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
        var zonePosInZones = Coords.create();
        var zoneSize = size;
        var neighborOffsets = [
            Coords.fromXY(1, 0),
            Coords.fromXY(1, 1),
            Coords.fromXY(0, 1),
            Coords.fromXY(-1, 1),
            Coords.fromXY(-1, 0),
            Coords.fromXY(-1, -1),
            Coords.fromXY(0, -1),
            Coords.fromXY(1, -1)
        ];
        var neighborPos = Coords.create();
        var boxZeroes = new Box(Coords.create(), Coords.create());
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
        var posInZones = Coords.create();
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
        var mapCellSourceAsStrings = [
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
        var mapSizeInCells = new Coords(mapCellSourceAsStrings[0].length, mapCellSourceAsStrings.length, 1);
        var mapCellSize = size.clone().divide(mapSizeInCells).ceiling();
        var mapCellSizeHalf = mapCellSize.clone().half();
        var entityExitPosRange = new Box(mapCellSize.clone().half(), null);
        var exit = this.entityBuildFromDefn(this.entityDefnsByName.get("Exit"), entityExitPosRange, this.randomizer);
        var exitPortal = exit.portal();
        exitPortal.destinationPlaceName = placeNameToReturnTo;
        exitPortal.destinationEntityName = this.name;
        this.entities.push(exit);
        var cellCollider = new Box(mapCellSizeHalf.clone(), mapCellSize);
        var cellCollide = (uwpe) => {
            var e0 = uwpe.entity;
            var traversable = e0.traversable();
            if (traversable != null) {
                if (traversable.isBlocking) {
                    var u = uwpe.universe;
                    var e1 = uwpe.entity2;
                    u.collisionHelper.collideEntitiesBounce(e0, e1);
                }
            }
        };
        var cellCollidable = new Collidable(false, // canCollideAgainWithoutSeparating
        0, cellCollider, [Playable.name], cellCollide);
        var neighborOffsets = [
            // e, se, s, sw, w, nw, n, ne
            Coords.fromXY(1, 0), Coords.fromXY(1, 1), Coords.fromXY(0, 1),
            Coords.fromXY(-1, 1), Coords.fromXY(-1, 0), Coords.fromXY(-1, -1),
            Coords.fromXY(0, -1), Coords.fromXY(1, -1)
        ];
        var colorToTerrainVisualByName = (colorName) => {
            var color = Color.byName(colorName);
            var borderWidthAsFraction = .25;
            var borderSizeCorner = mapCellSize.clone().multiplyScalar(borderWidthAsFraction).ceiling();
            var borderSizeVerticalHalf = mapCellSize.clone().multiply(Coords.fromXY(borderWidthAsFraction, .5)).ceiling();
            var borderSizeHorizontalHalf = mapCellSize.clone().multiply(Coords.fromXY(.5, borderWidthAsFraction)).ceiling();
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
                        new VisualOffset(new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), Coords.create()),
                        // w
                        new VisualOffset(new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), Coords.create())
                    ])
                ],
                [
                    "InsideNE",
                    new VisualGroup([
                        // n
                        new VisualOffset(new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), Coords.fromXY(mapCellSize.x / 2, 0)),
                        // e
                        new VisualOffset(new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), Coords.fromXY(mapCellSize.x - borderSizeCorner.x, 0)),
                    ])
                ],
                [
                    "OutsideSE",
                    new VisualOffset(new VisualRectangle(borderSizeCorner, color, null, isCenteredFalse), Coords.create())
                ],
                [
                    "OutsideSW",
                    new VisualOffset(new VisualRectangle(borderSizeCorner, color, null, isCenteredFalse), Coords.fromXY(mapCellSize.x - borderSizeCorner.x, 0))
                ],
                [
                    "OutsideNW",
                    new VisualOffset(new VisualRectangle(borderSizeCorner, color, null, isCenteredFalse), Coords.fromXY(mapCellSize.x - borderSizeCorner.x, mapCellSize.y - borderSizeCorner.y))
                ],
                [
                    "OutsideNE",
                    new VisualOffset(new VisualRectangle(borderSizeCorner, color, null, isCenteredFalse), Coords.fromXY(0, mapCellSize.y - borderSizeCorner.y))
                ],
                [
                    "ETop",
                    new VisualOffset(new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), Coords.fromXY(mapCellSize.x - borderSizeCorner.x, 0))
                ],
                [
                    "EBottom",
                    new VisualOffset(new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), Coords.fromXY(mapCellSize.x - borderSizeCorner.x, mapCellSize.y / 2))
                ],
                [
                    "SRight",
                    new VisualOffset(new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), Coords.fromXY(mapCellSize.x / 2, mapCellSize.y - borderSizeCorner.y))
                ],
                [
                    "SLeft",
                    new VisualOffset(new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), new Coords(0, mapCellSize.y - borderSizeCorner.y, 0))
                ],
                [
                    "WBottom",
                    new VisualOffset(new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), Coords.fromXY(0, mapCellSize.y / 2))
                ],
                [
                    "WTop",
                    new VisualOffset(new VisualRectangle(borderSizeVerticalHalf, color, null, isCenteredFalse), Coords.create())
                ],
                [
                    "NLeft",
                    new VisualOffset(new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), Coords.create())
                ],
                [
                    "NRight",
                    new VisualOffset(new VisualRectangle(borderSizeHorizontalHalf, color, null, isCenteredFalse), Coords.fromXY(mapCellSize.x / 2, 0))
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
            var visualsAsGroup = new VisualGroup(visualsInOrder);
            return visualsAsGroup;
        };
        var universe = this.universe;
        var terrainNameToVisual = (terrainName) => {
            var imageName = "Terrain-" + terrainName;
            var terrainVisualImageCombined = new VisualImageFromLibrary(imageName);
            var imageSizeInPixels = terrainVisualImageCombined.image(universe).sizeInPixels;
            var imageSizeInTiles = new Coords(5, 5, 1);
            var tileSizeInPixels = imageSizeInPixels.clone().divide(imageSizeInTiles);
            var tileSizeInPixelsHalf = tileSizeInPixels.clone().half();
            var tileCenterBounds = new Box(imageSizeInPixels.clone().half(), tileSizeInPixels);
            var terrainVisualCenter = new VisualImageScaledPartial(terrainVisualImageCombined, tileCenterBounds, mapCellSize // sizeToDraw
            );
            // hack - Correct for centering.
            terrainVisualCenter = new VisualOffset(terrainVisualCenter, mapCellSizeHalf);
            var tileOffsetInTilesHalf = Coords.create();
            var visualOffsetInMapCellsHalf = Coords.create();
            var offsetsToVisual = (tileOffsetInTilesHalf, visualOffsetInMapCellsHalf) => {
                var terrainVisualBounds = Box.fromMinAndSize(tileOffsetInTilesHalf.clone().multiply(tileSizeInPixelsHalf), tileSizeInPixelsHalf);
                var terrainVisual = new VisualImageScaledPartial(terrainVisualImageCombined, terrainVisualBounds, mapCellSizeHalf // sizeToDraw
                );
                // hack - Correct for centering.
                terrainVisual = new VisualOffset(terrainVisual, visualOffsetInMapCellsHalf.clone().multiply(mapCellSizeHalf));
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
            var terrainVisualsAsGroup = new VisualGroup(terrainVisuals);
            return terrainVisualsAsGroup;
        };
        var terrains = [
            //name, codeChar, level, isBlocking, visual
            new Terrain("Water", "~", 0, new Traversable(true), colorToTerrainVisualByName("Blue")),
            new Terrain("Sand", ".", 1, new Traversable(false), terrainNameToVisual("Sand")),
            new Terrain("Grass", ":", 2, new Traversable(false), colorToTerrainVisualByName("Green")),
            new Terrain("Trees", "Q", 3, new Traversable(false), colorToTerrainVisualByName("GreenDark")),
            new Terrain("Rock", "A", 4, new Traversable(false), colorToTerrainVisualByName("Gray")),
            new Terrain("Snow", "*", 5, new Traversable(false), colorToTerrainVisualByName("White")),
        ];
        var terrainsByName = ArrayHelper.addLookupsByName(terrains);
        var mapCellSource = new MapOfCellsCellSourceTerrain(terrains, mapCellSourceAsStrings);
        var map = new MapOfCells("Terrarium", mapSizeInCells, mapCellSize, mapCellSource);
        var mapAndCellPosToEntity = (map, cellPosInCells) => {
            var cellVisuals = [];
            var cell = map.cellAtPosInCells(cellPosInCells);
            var cellTerrain = terrainsByName.get(cell.visualName);
            var cellTerrainVisuals = cellTerrain.visual.children;
            cellVisuals.push(cellTerrainVisuals[0]);
            var cellPosInPixels = cellPosInCells.clone().multiply(map.cellSize);
            var neighborTerrains = [];
            var neighborPos = Coords.create();
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
                    var visualForBorder = neighborTerrainToUse.visual.children[borderVisualIndex];
                    cellVisuals.push(visualForBorder);
                }
            }
            var cellVisual = new VisualGroup(cellVisuals);
            var cellAsEntity = new Entity(this.name + cellPosInCells.toString(), [
                new Boundable(new Box(Coords.create(), //cellPosInPixels,
                mapCellSize)),
                cellCollidable.clone(),
                Drawable.fromVisual(cellVisual),
                new Locatable(Disposition.fromPos(cellPosInPixels)),
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
    build_Goal() {
        var entityDefns = this.entityDefnsByName;
        var entities = this.entities;
        var entityDefns = this.entityDefnsByName;
        var entities = this.entities;
        var entitySize = Coords.ones().multiplyScalar(this.entityDimension);
        var numberOfKeysToUnlockGoal = 5;
        var goalEntity = this.entityBuildGoal(entities, entitySize, numberOfKeysToUnlockGoal);
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
        var wallThickness = this.entityBuildObstacleWalls(Color.byName("Gray"), areNeighborsConnectedESWN, namePrefix, placePos, 0 // damagePerHit
        );
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
        cameraLoc, Locatable.entitiesSortByZThenY);
        var cameraBoundable = new Boundable(camera.viewCollider);
        var cameraCollidable = Collidable.fromCollider(camera.viewCollider);
        var cameraConstrainable = new Constrainable([
            new Constraint_AttachToEntityWithName("Player"),
            new Constraint_ContainInBox(cameraPosBox)
        ]);
        var cameraEntity = new Entity(Camera.name, [
            camera,
            cameraBoundable,
            cameraCollidable,
            cameraConstrainable,
            new Locatable(cameraLoc),
            Movable.default()
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
            new Locatable(Disposition.fromPos(new Coords(0, 0, camera.focalLength))),
            Drawable.fromVisual(visualBackgroundBottom),
        ]);
        returnValues.push(entityBackgroundBottom);
        visualBackgroundCellSize =
            new Coords(1, 1, .01).multiplyScalar(visualBackgroundDimension);
        var visualBackgroundTop = new VisualRepeating(visualBackgroundCellSize, // cellSize
        camera.viewSize.clone(), // viewSize
        new VisualRectangle(visualBackgroundCellSize, null, new Color(null, null, [1, 1, 1, 0.06]), null), true // expandViewStartAndEndByCell
        );
        var entityBackgroundTop = new Entity("BackgroundTop", [
            Locatable.create(),
            Drawable.fromVisual(visualBackgroundTop),
        ]);
        returnValues.push(entityBackgroundTop);
        return returnValues;
    }
    entityBuildExit(placeNameToReturnTo) {
        var entityPosRange = new Box(this.size.clone().half(), this.size.clone().subtract(this.marginSize));
        var exit = this.entityBuildFromDefn(this.entityDefnsByName.get("Exit"), entityPosRange, this.randomizer);
        var exitPortal = exit.portal();
        exitPortal.destinationPlaceName = placeNameToReturnTo;
        exitPortal.destinationEntityName = this.name;
        this.entities.push(exit);
        return exit;
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
    entityBuildGoal(entities, entitySize, numberOfKeysToUnlockGoal) {
        var fontHeight = this.entityDimension;
        var itemKeyColor = Color.byName("Yellow");
        var goalPos = Coords.create().randomize(this.randomizer).multiplyScalar(.5).addDimensions(.25, .25, 0).multiply(this.size);
        var goalLoc = Disposition.fromPos(goalPos);
        var goalColor = Color.byName("GreenDark");
        var goalVisual = new VisualGroup([
            VisualRectangle.fromSizeAndColorFill(entitySize, goalColor),
            VisualText.fromTextHeightAndColor("" + numberOfKeysToUnlockGoal, fontHeight, itemKeyColor)
        ]);
        if (this.visualsHaveText) {
            goalVisual.children.push(new VisualOffset(VisualText.fromTextHeightAndColor("Exit", fontHeight, goalColor), Coords.fromXY(0, 0 - this.entityDimension * 2)));
        }
        var goalEntity = new Entity("Goal", [
            new Locatable(goalLoc),
            Collidable.fromCollider(new Box(Coords.create(), entitySize)),
            Drawable.fromVisual(goalVisual),
            new Goal(numberOfKeysToUnlockGoal),
        ]);
        entities.push(goalEntity);
        return goalEntity;
    }
    entityBuildKeys(places, numberOfKeysToUnlockGoal, marginSize) {
        var entityDimensionHalf = this.entityDimension / 2;
        var sizeMinusMargins = marginSize.clone().double().invert().add(this.size);
        var itemDefnKeyName = "Key";
        var itemKeyVisual = this.itemDefnsByName.get(itemDefnKeyName).visual;
        for (var i = 0; i < numberOfKeysToUnlockGoal; i++) {
            var itemKeyPos = Coords.create().randomize(this.randomizer).multiply(sizeMinusMargins).add(marginSize);
            var itemKeyCollider = new Sphere(Coords.create(), entityDimensionHalf);
            var itemKeyEntity = new Entity(itemDefnKeyName + i, [
                new Item(itemDefnKeyName, 1),
                new Locatable(Disposition.fromPos(itemKeyPos)),
                Collidable.fromCollider(itemKeyCollider),
                Drawable.fromVisual(itemKeyVisual),
            ]);
            var place = ArrayHelper.random(places, this.randomizer);
            place.entityToSpawnAdd(itemKeyEntity);
        }
    }
    entityBuildLoader(entityDefn, entityCount, entityPosRange, randomizer) {
        var placeBuilder = this;
        var loadable = new LoadableProperty((uwpe) => // load
         {
            var place = uwpe.place;
            var placeAsPlaceRoom = place;
            var randomizer = new RandomizerLCG(placeAsPlaceRoom.randomizerSeed, null, null, null);
            var entityPosRange = new Box(place.size.clone().half(), place.size.clone());
            var entitiesCreated = placeBuilder.entitiesBuildFromDefnAndCount(entityDefn, entityCount, null, entityPosRange, randomizer);
            place.entitiesToSpawnAdd(entitiesCreated);
        }, (uwpe) => // unload
         {
            var p = uwpe.place;
            p.entitiesToRemove.push(...p.entities.filter((x) => x.name.startsWith("Mine")));
        });
        var returnValue = new Entity("Loader" + entityDefn.name, [
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
        var portalSizeWE = Coords.fromXY(.25, 1).multiplyScalar(2 * doorwayWidthHalf);
        var portalSizeNS = Coords.fromXY(1, .25).multiplyScalar(2 * doorwayWidthHalf);
        var neighborOffsets = [
            Coords.fromXY(1, 0),
            Coords.fromXY(0, 1),
            Coords.fromXY(-1, 0),
            Coords.fromXY(0, -1)
        ];
        var portalCollide = (uwpe) => {
            var eOther = uwpe.entity2;
            if (eOther.playable() != null) {
                var ePortal = uwpe.entity;
                var usable = ePortal.usable();
                if (usable == null) {
                    var portal = ePortal.portal();
                    portal.use(uwpe);
                }
            }
        };
        var forceFieldCollide = (uwpe) => {
            var eOther = uwpe.entity2;
            if (eOther.playable() != null) {
                var ePortal = uwpe.entity;
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
            var wallCollider = new Box(Coords.create(), wallSize);
            var wallObstacle = new Obstacle();
            var wallCollidable = new Collidable(false, // canCollideAgainWithoutSeparating
            0, wallCollider, [Movable.name], wallObstacle.collide);
            var wallVisual = VisualRectangle.fromSizeAndColorFill(wallSize, wallColor);
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
                    wallCollidable,
                    Drawable.fromVisual(wallVisual),
                    wallObstacle
                ]);
                if (damagePerHit > 0) {
                    var damager = Damager.fromDamagePerHit(Damage.fromAmount(10));
                    wallEntity.propertyAdd(damager);
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
                var portal = new Portal(neighborName, "PortalToNeighbor" + ((i + 2) % 4), neighborOffset.clone().double());
                var portalBox = new Box(Coords.create(), portalSize);
                var collidable = new Collidable(false, // canCollideAgainWithoutSeparating
                0, // ticks
                portalBox, [Playable.name], portalCollide);
                var locatable = new Locatable(new Disposition(portalPos, null, null));
                var portalEntity = new Entity("PortalToNeighbor" + i, [
                    collidable,
                    locatable,
                    Movable.default(),
                    portal
                ]);
                entities.push(portalEntity);
                var forceField = new ForceField(null, neighborOffset.clone().invert());
                var forceFieldCollidable = new Collidable(false, // canCollideAgainWithoutSeparating
                0, // ticks
                portalBox, [Playable.name], forceFieldCollide);
                var forceFieldEntity = new Entity("PortalToNeighbor" + i + "_ForceField", [
                    forceFieldCollidable,
                    forceField,
                    locatable,
                    Movable.default() // hack - For CollisionTracker.
                ]);
                entities.push(forceFieldEntity);
            }
        }
        return wallThickness;
    }
    entityBuildRadioMessage(visualForPortrait, message) {
        return new Entity("RadioMessage", [
            new Recurrent(20, // ticksPerRecurrence
            1, // timesToRecur
            // recur
            (uwpe) => {
                var u = uwpe.universe;
                var p = uwpe.place;
                var e = uwpe.entity;
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
                        wordBubbleAsControl.toVenue()
                    ];
                    u.venueNext = new VenueLayered(venuesForLayers, null);
                }
            })
        ]);
    }
    entityDefnBuildStore() {
        var storeColor = Color.byName("Brown");
        var entitySize = Coords.ones().multiplyScalar(this.entityDimension);
        var visual = new VisualGroup([
            VisualRectangle.fromSizeAndColorFill(Coords.fromXY(1, 1.5).multiplyScalar(this.entityDimension), storeColor),
            new VisualOffset(VisualRectangle.fromSizeAndColorFill(Coords.fromXY(1.1, .2).multiplyScalar(this.entityDimension), Color.byName("Gray")), Coords.fromXY(0, -.75).multiplyScalar(this.entityDimension)),
        ]);
        if (this.visualsHaveText) {
            var fontHeight = this.entityDimension;
            visual.children.push(new VisualOffset(VisualText.fromTextHeightAndColor("Store", fontHeight, storeColor), Coords.fromXY(0, 0 - this.entityDimension * 2)));
        }
        var storeEntityDefn = new Entity("Store", [
            Collidable.fromCollider(new Box(Coords.create(), entitySize)),
            Drawable.fromVisual(visual),
            new ItemStore("Coin"),
            new ItemHolder([
                new Item("Coin", 100),
                new Item("Bow", 1),
                new Item("Key", 10),
                new Item("Medicine", 100)
            ], null, // weightMax
            null // reachRadius
            ),
            Locatable.create(),
            new Usable((uwpe) => {
                var eUsed = uwpe.entity2;
                eUsed.itemStore().use(uwpe);
                return null;
            })
        ]);
        return storeEntityDefn;
    }
    // Entity definitions.
    entityDefnBuildAccessory() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnAccessoryName = "Speed Boots";
        var itemAccessoryVisual = this.itemDefnsByName.get(itemDefnAccessoryName).visual;
        var itemAccessoryCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var itemAccessoryEntityDefn = new Entity(itemDefnAccessoryName, [
            new Item(itemDefnAccessoryName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemAccessoryCollider),
            Drawable.fromVisual(itemAccessoryVisual),
            Equippable.default()
        ]);
        return itemAccessoryEntityDefn;
    }
    entityDefnBuildArmor() {
        var itemDefnArmorName = "Armor";
        var itemDefn = this.itemDefnsByName.get(itemDefnArmorName);
        var itemArmorVisual = itemDefn.visual;
        var path = itemArmorVisual.children[0].verticesAsPath;
        var itemArmorCollider = new Sphere(Coords.create(), this.entityDimension / 2);
        var collidable = Collidable.fromCollider(itemArmorCollider);
        var box = new Box(Coords.create(), Coords.create()).ofPoints(path.points);
        box.center = itemArmorCollider.center;
        var boundable = new Boundable(box);
        var itemArmorEntityDefn = new Entity(itemDefnArmorName, [
            new Armor(.5),
            boundable,
            collidable,
            Equippable.default(),
            new Item(itemDefnArmorName, 1),
            Locatable.create(),
            Drawable.fromVisual(itemArmorVisual),
        ]);
        return itemArmorEntityDefn;
    }
    entityDefnBuildArrow() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnArrowName = "Arrow";
        var itemArrowVisual = this.itemDefnsByName.get(itemDefnArrowName).visual;
        var arrowSize = Coords.ones();
        var itemArrowCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var collidable = Collidable.fromCollider(itemArrowCollider);
        var bounds = new Box(itemArrowCollider.center, arrowSize);
        var boundable = new Boundable(bounds);
        var roundsPerPile = 5;
        var itemArrowEntityDefn = new Entity(itemDefnArrowName, [
            boundable,
            collidable,
            Drawable.fromVisual(itemArrowVisual),
            new Item(itemDefnArrowName, roundsPerPile),
            Locatable.create(),
        ]);
        return itemArrowEntityDefn;
    }
    entityDefnBuildBomb() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnBombName = "Bomb";
        var itemBombVisual = this.itemDefnsByName.get(itemDefnBombName).visual;
        var itemBombCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var itemBombDevice = new Device("Bomb", 10, // ticksToCharge
        (uwpe) => // initialize
         {
            // todo
        }, (uwpe) => // update
         {
            // todo
        }, (uwpe) => // use
         {
            var entityUser = uwpe.entity;
            var entityDevice = uwpe.entity2;
            var userAsItemHolder = entityUser.itemHolder();
            var hasAmmo = userAsItemHolder.hasItemWithDefnNameAndQuantity("Bomb", 1);
            if (hasAmmo == false) {
                return;
            }
            userAsItemHolder.itemSubtractDefnNameAndQuantity("Bomb", 1);
            entityUser.equipmentUser().unequipItemsNoLongerHeld(uwpe);
            var userLoc = entityUser.locatable().loc;
            var userPos = userLoc.pos;
            var userVel = userLoc.vel;
            var userSpeed = userVel.magnitude();
            if (userSpeed == 0) {
                return;
            }
            var projectileDimension = 1.5;
            var projectileVisual = new VisualGroup([
                entityDevice.drawable().visual
                // todo - Add sparks?
            ]);
            var userDirection = userVel.clone().normalize();
            var userRadius = entityUser.collidable().collider.radius;
            var projectilePos = userPos.clone().add(userDirection.clone().multiplyScalar(userRadius + projectileDimension).double());
            var projectileOri = new Orientation(userVel.clone().normalize(), null);
            var projectileLoc = new Disposition(projectilePos, projectileOri, null);
            projectileLoc.vel.overwriteWith(userVel).clearZ().double();
            var projectileCollider = new Sphere(Coords.create(), projectileDimension);
            // todo
            var projectileCollide = null;
            var projectileDie = (uwpe) => {
                var explosionRadius = 32;
                var explosionVisual = VisualCircle.fromRadiusAndColorFill(explosionRadius, Color.byName("Yellow"));
                var explosionCollider = new Sphere(Coords.create(), explosionRadius);
                var explosionCollide = (uwpe) => {
                    var entityProjectile = uwpe.entity;
                    var entityOther = uwpe.entity2;
                    var killable = entityOther.killable();
                    if (killable != null) {
                        killable.damageApply(uwpe, entityProjectile.damager().damagePerHit);
                    }
                };
                var entityDying = uwpe.entity;
                var explosionEntity = new Entity("BombExplosion", [
                    new Collidable(false, // canCollideAgainWithoutSeparating
                    0, // ticks
                    explosionCollider, [Killable.name], explosionCollide),
                    Damager.fromDamagePerHit(Damage.fromAmount(20)),
                    Drawable.fromVisual(explosionVisual),
                    new Ephemeral(8, null),
                    entityDying.locatable()
                ]);
                uwpe.place.entityToSpawnAdd(explosionEntity);
            };
            var projectileEntity = new Entity("ProjectileBomb", [
                new Ephemeral(64, projectileDie),
                new Locatable(projectileLoc),
                new Collidable(false, // canCollideAgainWithoutSeparating
                0, // ticks
                projectileCollider, [Collidable.name], projectileCollide),
                new Constrainable([new Constraint_FrictionXY(.03, .5)]),
                Drawable.fromVisual(projectileVisual),
                Equippable.default()
            ]);
            uwpe.place.entityToSpawnAdd(projectileEntity);
        });
        var itemBombEntityDefn = new Entity(itemDefnBombName, [
            new Item(itemDefnBombName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemBombCollider),
            itemBombDevice,
            Drawable.fromVisual(itemBombVisual),
            Equippable.default()
        ]);
        return itemBombEntityDefn;
    }
    entityDefnBuildBook() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnBookName = "Book";
        var itemBookVisual = this.itemDefnsByName.get(itemDefnBookName).visual;
        var itemBookCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var itemBookEntityDefn = new Entity(itemDefnBookName, [
            new Item(itemDefnBookName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemBookCollider),
            Drawable.fromVisual(itemBookVisual),
        ]);
        return itemBookEntityDefn;
    }
    entityDefnBuildBow() {
        var itemDefnName = "Bow";
        var itemBowVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemBowCollider = new Sphere(Coords.create(), this.entityDimension);
        var itemBowUse = (uwpe) => // use
         {
            var w = uwpe.world;
            var p = uwpe.place;
            var entityUser = uwpe.entity;
            var entityDevice = uwpe.entity2;
            var device = entityDevice.device();
            var tickCurrent = w.timerTicksSoFar;
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
            entityUser.equipmentUser().unequipItemsNoLongerHeld(uwpe);
            device.tickLastUsed = tickCurrent;
            var userLoc = entityUser.locatable().loc;
            var userPos = userLoc.pos;
            var userVel = userLoc.vel;
            var userSpeed = userVel.magnitude();
            if (userSpeed == 0) {
                return;
            }
            var projectileDimension = 1.5;
            var itemArrow = userAsItemHolder.itemsByDefnName("Arrow")[0];
            var itemArrowDefn = itemArrow.defn(w);
            var projectileVisual = itemArrowDefn.visual;
            var userDirection = userVel.clone().normalize();
            var userRadius = entityUser.collidable().collider.radius;
            var projectilePos = userPos.clone().add(userDirection.clone().multiplyScalar(userRadius + projectileDimension).double());
            var projectileOri = new Orientation(userVel.clone().normalize(), null);
            var projectileLoc = new Disposition(projectilePos, projectileOri, null);
            projectileLoc.vel.overwriteWith(userVel).clearZ().double();
            var projectileCollider = new Sphere(Coords.create(), projectileDimension);
            var projectileCollide = (uwpe) => {
                var entityProjectile = uwpe.entity;
                var entityOther = uwpe.entity2;
                var killable = entityOther.killable();
                if (killable != null) {
                    killable.damageApply(uwpe, null);
                    entityProjectile.killable().integrity = 0;
                }
            };
            var visualStrike = VisualCircle.fromRadiusAndColorFill(8, Color.byName("Red"));
            var killable = new Killable(1, // integrityMax
            null, // damageApply
            (uwpe) => // die
             {
                var entityKillable = uwpe.entity;
                var entityStrike = new Entity("ArrowStrike", [
                    new Ephemeral(8, null),
                    Drawable.fromVisual(visualStrike),
                    entityKillable.locatable()
                ]);
                uwpe.place.entityToSpawnAdd(entityStrike);
            });
            var projectileEntity = new Entity("ProjectileArrow", [
                Damager.fromDamagePerHit(Damage.fromAmount(10)),
                new Ephemeral(32, null),
                killable,
                new Locatable(projectileLoc),
                new Collidable(false, // canCollideAgainWithoutSeparating
                0, // ticksToWaitBetweenCollisions
                projectileCollider, [Killable.name], projectileCollide),
                Drawable.fromVisual(projectileVisual),
            ]);
            p.entityToSpawnAdd(projectileEntity);
        };
        var itemBowDevice = new Device("Bow", 10, // ticksToCharge
        (uwpe) => // initialize
         {
            // todo
        }, (uwpe) => // update
         {
            // todo
        }, itemBowUse);
        var itemBowEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemBowCollider),
            Drawable.fromVisual(itemBowVisual),
            Equippable.default(),
            itemBowDevice
        ]);
        return itemBowEntityDefn;
    }
    entityDefnBuildBread() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnBreadName = "Bread";
        var itemBreadVisual = this.itemDefnsByName.get(itemDefnBreadName).visual;
        var itemBreadCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var itemBreadEntityDefn = new Entity(itemDefnBreadName, [
            new Item(itemDefnBreadName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemBreadCollider),
            Drawable.fromVisual(itemBreadVisual),
        ]);
        return itemBreadEntityDefn;
    }
    entityDefnBuildCar() {
        var entityDimension = this.entityDimension * .75;
        var defnName = "Car";
        var frames = new Array();
        var frameSizeScaled = Coords.fromXY(4, 3).multiplyScalar(entityDimension);
        var visualTileset = new VisualImageFromLibrary("Car");
        var tileSizeInPixels = Coords.fromXY(64, 48);
        var tilesetSizeInTiles = Coords.fromXY(8, 4);
        var tilePosInTiles = Coords.create();
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
            carVisual.children.push(new VisualOffset(VisualText.fromTextHeightAndColor(defnName, entityDimension, Color.byName("Blue")), Coords.fromXY(0, 0 - entityDimension * 2.5)));
        }
        var carCollider = new Sphere(Coords.create(), entityDimension / 2);
        var carCollide = (uwpe) => {
            var entityVehicle = uwpe.entity;
            var entityOther = uwpe.entity2;
            if (entityOther.portal() != null) {
                var usable = entityOther.usable();
                if (usable == null) {
                    var portal = entityOther.portal();
                    portal.use(uwpe);
                }
            }
            else {
                var universe = uwpe.universe;
                universe.collisionHelper.collideEntitiesBlock(entityVehicle, entityOther);
            }
        };
        var carCollidable = new Collidable(false, // canCollideAgainWithoutSeparating
        0, carCollider, [Collidable.name], carCollide);
        var carConstrainable = new Constrainable([
            new Constraint_FrictionXY(.03, .2)
        ]);
        var carLoc = Disposition.create();
        //carLoc.spin = new Rotation(Coords.Instances().ZeroZeroOne, new Reference(.01));
        var carUsable = new Usable((uwpe) => {
            var p = uwpe.place;
            var eUsing = uwpe.entity;
            var eUsed = uwpe.entity2;
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
            Drawable.fromVisual(carVisual),
            carUsable,
            vehicle
        ]);
        return carEntityDefn;
    }
    entityDefnBuildCoin() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnCoinName = "Coin";
        var itemCoinVisual = this.itemDefnsByName.get(itemDefnCoinName).visual;
        var itemCoinCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var itemCoinEntityDefn = new Entity(itemDefnCoinName, [
            new Item(itemDefnCoinName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemCoinCollider),
            Drawable.fromVisual(itemCoinVisual),
        ]);
        return itemCoinEntityDefn;
    }
    entityDefnBuildCrystal() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnCrystalName = "Crystal";
        var itemCrystalVisual = this.itemDefnsByName.get(itemDefnCrystalName).visual;
        var itemCrystalCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var itemCrystalEntityDefn = new Entity(itemDefnCrystalName, [
            Collidable.fromCollider(itemCrystalCollider),
            Drawable.fromVisual(itemCrystalVisual),
            new Item(itemDefnCrystalName, 1),
            Locatable.create()
        ]);
        return itemCrystalEntityDefn;
    }
    entityDefnBuildDoughnut() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnDoughnutName = "Doughnut";
        var itemDoughnutVisual = this.itemDefnsByName.get(itemDefnDoughnutName).visual;
        var itemDoughnutCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var itemDoughnutEntityDefn = new Entity(itemDefnDoughnutName, [
            new Item(itemDefnDoughnutName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemDoughnutCollider),
            Drawable.fromVisual(itemDoughnutVisual),
        ]);
        return itemDoughnutEntityDefn;
    }
    entityDefnBuildFlower() {
        var entityDimension = this.entityDimension * .5;
        var itemDefnName = "Flower";
        var visual = this.itemDefnsByName.get(itemDefnName).visual;
        var collider = new Sphere(Coords.create(), entityDimension);
        var entityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            Locatable.create(),
            Collidable.fromCollider(collider),
            Drawable.fromVisual(visual)
        ]);
        return entityDefn;
    }
    entityDefnBuildFruit() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnFruitName = "Fruit";
        var itemFruitVisual = this.itemDefnsByName.get(itemDefnFruitName).visual;
        var itemFruitCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var itemFruitEntityDefn = new Entity(itemDefnFruitName, [
            new Item(itemDefnFruitName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemFruitCollider),
            Drawable.fromVisual(itemFruitVisual)
        ]);
        return itemFruitEntityDefn;
    }
    entityDefnBuildGenerator(entityDefnToGenerate) {
        var generator = new EntityGenerator(entityDefnToGenerate, RangeExtent.fromNumber(1200), // ticksPerGenerationAsRange
        RangeExtent.fromNumber(1), // entitiesPerGenerationAsRange
        1 // entitiesGeneratedMax
        );
        var entityDefnGenerator = new Entity(entityDefnToGenerate.name + "Generator", [
            generator,
            Locatable.create()
        ]);
        return entityDefnGenerator;
    }
    entityDefnBuildGrass() {
        var entityDimension = this.entityDimension / 2;
        var itemDefnName = "Grass";
        var itemGrassVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemGrassCollider = new Sphere(Coords.create(), entityDimension / 2);
        var itemGrassEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemGrassCollider),
            Drawable.fromVisual(itemGrassVisual)
        ]);
        return itemGrassEntityDefn;
    }
    entityDefnBuildHeart() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnHeartName = "Heart";
        var itemHeartVisual = this.itemDefnsByName.get(itemDefnHeartName).visual;
        var itemHeartCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var itemHeartEntityDefn = new Entity(itemDefnHeartName, [
            new Item(itemDefnHeartName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemHeartCollider),
            Drawable.fromVisual(itemHeartVisual)
        ]);
        return itemHeartEntityDefn;
    }
    entityDefnBuildIron() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnIronName = "Iron";
        var itemIronVisual = this.itemDefnsByName.get(itemDefnIronName).visual;
        var itemIronCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var itemIronEntityDefn = new Entity(itemDefnIronName, [
            new Item(itemDefnIronName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemIronCollider),
            Drawable.fromVisual(itemIronVisual)
        ]);
        return itemIronEntityDefn;
    }
    entityDefnBuildIronOre() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnOreName = "Iron Ore";
        var itemOreVisual = this.itemDefnsByName.get(itemDefnOreName).visual;
        var itemOreCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var itemOreEntityDefn = new Entity(itemDefnOreName, [
            new Item(itemDefnOreName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemOreCollider),
            Drawable.fromVisual(itemOreVisual)
        ]);
        return itemOreEntityDefn;
    }
    entityDefnBuildLog() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnLogName = "Log";
        var itemLogVisual = this.itemDefnsByName.get(itemDefnLogName).visual;
        var itemLogCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var itemLogEntityDefn = new Entity(itemDefnLogName, [
            new Item(itemDefnLogName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemLogCollider),
            Drawable.fromVisual(itemLogVisual)
        ]);
        return itemLogEntityDefn;
    }
    entityDefnBuildMeat() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnMeatName = "Meat";
        var itemMeatDefn = this.itemDefnsByName.get(itemDefnMeatName);
        var itemMeatVisual = itemMeatDefn.visual;
        var itemMeatCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var itemMeatEntityDefn = new Entity(itemDefnMeatName, [
            new Item(itemDefnMeatName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemMeatCollider),
            Drawable.fromVisual(itemMeatVisual),
            new Usable(itemMeatDefn.use)
        ]);
        return itemMeatEntityDefn;
    }
    entityDefnBuildMedicine() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnMedicineName = "Medicine";
        var itemMedicineVisual = this.itemDefnsByName.get(itemDefnMedicineName).visual;
        var itemMedicineCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var itemMedicineEntityDefn = new Entity(itemDefnMedicineName, [
            new Item(itemDefnMedicineName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemMedicineCollider),
            Drawable.fromVisual(itemMedicineVisual),
            Equippable.default()
        ]);
        return itemMedicineEntityDefn;
    }
    entityDefnBuildMushroom() {
        var entityDimension = this.entityDimension / 2;
        var itemDefnName = "Mushroom";
        var itemMushroomVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemMushroomCollider = new Sphere(Coords.create(), entityDimension / 2);
        var itemMushroomEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemMushroomCollider),
            Drawable.fromVisual(itemMushroomVisual)
        ]);
        return itemMushroomEntityDefn;
    }
    entityDefnBuildPick() {
        var itemDefnName = "Pick";
        var itemPickVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemPickCollider = new Sphere(Coords.create(), this.entityDimension / 2);
        var itemPickDevice = new Device("Pick", 10, // ticksToCharge
        null, // initialize: (uwpe: UniverseWorldPlaceEntities) => void,
        null, // update: (uwpe: UniverseWorldPlaceEntities) => void,
        (uwpe) => // use
         {
            var p = uwpe.place;
            var eUser = uwpe.entity;
            var bouldersInPlace = p.entities.filter(x => x.name.startsWith("Boulder"));
            var rangeMax = 20; // todo
            var boulderInRange = bouldersInPlace.filter((x) => x.locatable().distanceFromEntity(eUser) < rangeMax)[0];
            if (boulderInRange != null) {
                boulderInRange.killable().integrity = 0;
            }
        });
        var itemPickEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemPickCollider),
            itemPickDevice,
            Drawable.fromVisual(itemPickVisual),
            Equippable.default()
        ]);
        return itemPickEntityDefn;
    }
    entityDefnBuildPotion() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnPotionName = "Potion";
        var itemPotionColor = Color.byName("Blue");
        var itemPotionVisual = new VisualGroup([
            VisualPolygon.fromPathAndColors(new Path([
                Coords.fromXY(1, 1),
                Coords.fromXY(-1, 1),
                Coords.fromXY(-.2, 0),
                Coords.fromXY(-.2, -.5),
                Coords.fromXY(.2, -.5),
                Coords.fromXY(.2, 0)
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemPotionColor, Color.byName("White"))
        ]);
        if (this.visualsHaveText) {
            itemPotionVisual.children.push(new VisualOffset(VisualText.fromTextHeightAndColor(itemDefnPotionName, this.entityDimension, itemPotionColor), Coords.fromXY(0, 0 - this.entityDimension)));
        }
        var itemPotionCollider = new Sphere(Coords.create(), entityDimensionHalf);
        var itemPotionEntityDefn = new Entity(itemDefnPotionName, [
            new Item(itemDefnPotionName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemPotionCollider),
            Drawable.fromVisual(itemPotionVisual)
        ]);
        return itemPotionEntityDefn;
    }
    entityDefnBuildShovel() {
        var itemDefnName = "Shovel";
        var itemShovelVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemShovelCollider = new Sphere(Coords.create(), this.entityDimension / 2);
        var itemShovelDevice = new Device("Shovel", 10, // ticksToCharge
        null, // initialize: (uwpe: UniverseWorldPlaceEntities) => void,
        null, // update: (uwpe: UniverseWorldPlaceEntities) => void,
        (uwpe) => // use
         {
            var p = uwpe.place;
            var eUser = uwpe.entity;
            var holesInPlace = p.entities.filter(x => x.name.startsWith("Hole"));
            var rangeMax = 20; // todo
            var holeInRange = holesInPlace.filter(x => x.locatable().distanceFromEntity(eUser) < rangeMax)[0];
            if (holeInRange != null) {
                var isHoleEmpty = (holeInRange.itemHolder().items.length == 0);
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
                eUser.locatable().entitySpawnWithDefnName(uwpe, "Hole");
            }
        });
        var itemShovelEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemShovelCollider),
            itemShovelDevice,
            Drawable.fromVisual(itemShovelVisual),
            Equippable.default()
        ]);
        return itemShovelEntityDefn;
    }
    entityDefnBuildSword(damageTypeName) {
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
        var itemSwordCollider = new Sphere(Coords.create(), this.entityDimension / 2);
        var itemSwordDeviceUse = (uwpe) => // use
         {
            var universe = uwpe.universe;
            var world = uwpe.world;
            var place = uwpe.place;
            var entityUser = uwpe.entity;
            var entityDevice = uwpe.entity2;
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
                place.entitySpawn2(universe, world, universe.entityBuilder.messageFloater(message, 10, // fontHeightInPixels
                userPos.clone(), Color.byName("Red")));
                return;
            }
            userTirable.staminaSubtract(staminaToFire);
            var userDirection = userVel.clone().normalize();
            var userRadius = entityUser.collidable().collider.radius;
            var projectileDimension = 1.5;
            var projectilePos = userPos.clone().add(userDirection.clone().multiplyScalar(userRadius + projectileDimension).double());
            var projectileOri = new Orientation(userVel.clone().normalize(), null);
            var projectileVisual = entityDevice.drawable().visual;
            projectileVisual = projectileVisual.children[0].clone();
            projectileVisual.transform(new Transform_RotateRight(1));
            var projectileLoc = new Disposition(projectilePos, projectileOri, null);
            projectileLoc.vel.overwriteWith(userVel).clearZ().double();
            var projectileCollider = new Sphere(Coords.create(), projectileDimension);
            var projectileCollide = (uwpe) => {
                var entityProjectile = uwpe.entity;
                var entityOther = uwpe.entity2;
                var killable = entityOther.killable();
                if (killable != null) {
                    var damageToApply = entityProjectile.damager().damagePerHit;
                    killable.damageApply(uwpe, damageToApply);
                    entityProjectile.killable().integrity = 0;
                }
            };
            var visualStrike = VisualCircle.fromRadiusAndColorFill(8, Color.byName("Red"));
            var killable = new Killable(1, // integrityMax
            null, // damageApply
            (uwpe) => // die
             {
                var entityKillable = uwpe.entity;
                var entityStrike = new Entity("SwordStrike", [
                    new Ephemeral(8, null),
                    Drawable.fromVisual(visualStrike),
                    entityKillable.locatable()
                ]);
                place.entityToSpawnAdd(entityStrike);
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
                    throw ("Unrecognized damage type: " + damageTypeName);
                }
                var effectAndChance = [effect, 1];
                effectsAndChances = [effectAndChance];
            }
            var projectileDamager = Damager.fromDamagePerHit(new Damage(DiceRoll.fromOffset(10), damageTypeName, effectsAndChances));
            var projectileEntity = new Entity("ProjectileSword", [
                projectileDamager,
                new Ephemeral(8, null),
                killable,
                new Locatable(projectileLoc),
                new Collidable(false, // canCollideAgainWithoutSeparating
                0, projectileCollider, [Killable.name], projectileCollide),
                Drawable.fromVisual(projectileVisual)
            ]);
            place.entityToSpawnAdd(projectileEntity);
        };
        var itemSwordDevice = new Device(itemDefnName, 10, // ticksToCharge
        null, // init
        null, // update
        itemSwordDeviceUse);
        var itemSwordVisual = this.itemDefnsByName.get(itemDefnName).visual.clone();
        itemSwordVisual.transform(new Transform_Translate(Coords.fromXY(0, -1.1 * this.entityDimension)));
        var itemSwordEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemSwordCollider),
            Drawable.fromVisual(itemSwordVisual),
            itemSwordDevice,
            Equippable.default()
        ]);
        return itemSwordEntityDefn;
    }
    entityDefnBuildToolset() {
        var itemDefnName = "Toolset";
        var itemToolsetVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemToolsetCollider = new Sphere(Coords.create(), this.entityDimension / 2);
        var itemToolsetEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemToolsetCollider),
            Drawable.fromVisual(itemToolsetVisual)
        ]);
        return itemToolsetEntityDefn;
    }
    entityDefnBuildTorch() {
        var itemDefnName = "Torch";
        var itemTorchVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemTorchCollider = new Sphere(Coords.create(), this.entityDimension / 2);
        var itemTorchEntityDefn = new Entity(itemDefnName, [
            Animatable2.create(),
            new Item(itemDefnName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemTorchCollider),
            Drawable.fromVisual(itemTorchVisual)
        ]);
        return itemTorchEntityDefn;
    }
    entityDefnBuildWeight() {
        var itemDefnName = "Weight";
        var itemWeightVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemWeightCollider = new Sphere(Coords.create(), this.entityDimension / 2);
        var itemWeightEntityDefn = new Entity(itemDefnName, [
            new Item(itemDefnName, 1),
            Locatable.create(),
            Collidable.fromCollider(itemWeightCollider),
            Drawable.fromVisual(itemWeightVisual)
        ]);
        return itemWeightEntityDefn;
    }
    entityDefnsBuild() {
        var entityDefnFlower = this.entityDefnBuildFlower();
        var entityDefnGrass = this.entityDefnBuildGrass();
        var entityDefnMushroom = this.entityDefnBuildMushroom();
        var eb = this.emplacementsBuilder;
        var mb = this.moversBuilder;
        var entityDefns = [
            eb.entityDefnBuildAnvil(),
            eb.entityDefnBuildBoulder(),
            eb.entityDefnBuildCampfire(),
            eb.entityDefnBuildContainer(),
            eb.entityDefnBuildExit(),
            eb.entityDefnBuildHole(),
            eb.entityDefnBuildPortal(),
            eb.entityDefnBuildObstacleBar(),
            eb.entityDefnBuildObstacleMine(),
            eb.entityDefnBuildObstacleRing(),
            eb.entityDefnBuildPillow(),
            eb.entityDefnBuildTree(),
            eb.entityDefnBuildTrafficCone(),
            mb.entityDefnBuildEnemyGeneratorChaser(null),
            mb.entityDefnBuildEnemyGeneratorChaser("Cold"),
            mb.entityDefnBuildEnemyGeneratorChaser("Heat"),
            mb.entityDefnBuildEnemyGeneratorRunner(null),
            mb.entityDefnBuildEnemyGeneratorShooter(null),
            mb.entityDefnBuildEnemyGeneratorTank(null),
            mb.entityDefnBuildCarnivore(),
            mb.entityDefnBuildFriendly(),
            mb.entityDefnBuildGrazer(),
            mb.entityDefnBuildPlayer(this.cameraViewSize),
            this.entityDefnBuildAccessory(),
            this.entityDefnBuildArmor(),
            this.entityDefnBuildArrow(),
            this.entityDefnBuildBomb(),
            this.entityDefnBuildBook(),
            this.entityDefnBuildBow(),
            this.entityDefnBuildBread(),
            this.entityDefnBuildCar(),
            this.entityDefnBuildCoin(),
            this.entityDefnBuildCrystal(),
            this.entityDefnBuildDoughnut(),
            entityDefnFlower,
            this.entityDefnBuildFruit(),
            this.entityDefnBuildGenerator(entityDefnFlower),
            this.entityDefnBuildHeart(),
            this.entityDefnBuildIron(),
            this.entityDefnBuildIronOre(),
            this.entityDefnBuildLog(),
            this.entityDefnBuildMedicine(),
            this.entityDefnBuildMeat(),
            entityDefnMushroom,
            this.entityDefnBuildGenerator(entityDefnMushroom),
            entityDefnGrass,
            this.entityDefnBuildGenerator(entityDefnGrass),
            this.entityDefnBuildPick(),
            this.entityDefnBuildPotion(),
            this.entityDefnBuildShovel(),
            this.entityDefnBuildStore(),
            this.entityDefnBuildSword(null),
            this.entityDefnBuildSword("Cold"),
            this.entityDefnBuildSword("Heat"),
            this.entityDefnBuildToolset(),
            this.entityDefnBuildTorch(),
            this.entityDefnBuildWeight(),
        ];
        return entityDefns;
    }
    // Helpers.
    textWithColorAddToVisual(text, color, visual) {
        if (this.visualsHaveText) {
            visual.children.push(new VisualOffset(VisualText.fromTextHeightAndColor(text, this.entityDimension, color), Coords.fromXY(0, 0 - this.entityDimension)));
        }
    }
}
class MapOfCellsCellSourceTerrain {
    constructor(terrains, cellsAsStrings) {
        this.terrains = terrains;
        this.terrainsByCode =
            new Map(this.terrains.map(x => [x.code, x]));
        this.cellsAsStrings = cellsAsStrings;
    }
    cellCreate() {
        return MapCellObstacle.default();
    }
    cellAtPosInCells(map, cellPosInCells, cellToOverwrite) {
        if (cellPosInCells.isInRangeMax(map.sizeInCellsMinusOnes)) {
            var cellCode = this.cellsAsStrings[cellPosInCells.y][cellPosInCells.x];
            var cellTerrain = (this.terrainsByCode.get(cellCode) || this.terrains[0]);
            var cellVisualName = cellTerrain.name;
            var cellIsBlocking = cellTerrain.traversable.isBlocking;
            cellToOverwrite.visualName = cellVisualName;
            cellToOverwrite.isBlocking = cellIsBlocking;
        }
        else {
            cellToOverwrite = null;
        }
        return cellToOverwrite;
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) {
        return this;
    }
}
