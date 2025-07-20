"use strict";
class PlaceBuilderDemo // Main.
 {
    constructor(universe, randomizer, cameraViewSize) {
        this.universe = universe;
        this.randomizer = randomizer || RandomizerLCG.default();
        this.visualsHaveText = false;
        this.entityDimension = 10;
        this.font = FontNameAndHeight.fromHeightInPixels(this.entityDimension);
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
    }
    buildBase(size, placeNameToReturnTo) {
        this.build_Interior("Base", size, placeNameToReturnTo);
        //this.build_Interior_WithoutWallsOrExit("Base", size);
        var entityPosRange = BoxAxisAligned.fromCenterAndSize(size.clone().half(), size.clone().subtract(this.marginSize));
        var randomizer = this.randomizer;
        var entityDefns = this.entityDefnsByName;
        var e = this.entities;
        e.push(this.entityBuildFromDefn(entityDefns.get("Player"), entityPosRange, randomizer));
        var epebfdac = (a, b, c) => e.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get(a), b, c, entityPosRange, randomizer));
        epebfdac("Anvil", 1, null);
        epebfdac("Arrow", 1, 20);
        epebfdac("Bar", 1, null);
        epebfdac("Bomb", 3, null);
        epebfdac("Book", 1, null);
        epebfdac("Bow", 1, null);
        epebfdac("Bread", 1, 5);
        epebfdac("Campfire", 1, null);
        epebfdac("Car", 1, null);
        epebfdac("Doughnut", 1, 12);
        epebfdac("Friendly", 1, null);
        epebfdac("Heart", 1, null);
        epebfdac("Meat", 1, null);
        epebfdac("Pillow", 1, null);
        epebfdac("Sword", 1, null);
        epebfdac("SwordCold", 1, null);
        epebfdac("SwordHeat", 1, null);
        epebfdac("Toolset", 1, null);
        epebfdac("Torch", 1, null);
        epebfdac("TrafficCone", 10, null);
        epebfdac("Weight", 1, null);
        var ring = this.entitiesBuildFromDefnAndCount(entityDefns.get("Ring"), 1, null, entityPosRange, randomizer)[0];
        var ringLoc = Locatable.of(ring).loc;
        ringLoc.spin.angleInTurnsRef.value = .001;
        this.entities.push(ring);
        var container = this.entityBuildFromDefn(entityDefns.get("Container"), entityPosRange, randomizer);
        var itemEntityOre = this.entityBuildFromDefn(entityDefns.get("Iron Ore"), entityPosRange, randomizer);
        var itemOre = Item.of(itemEntityOre);
        itemOre.quantitySet(3); // For crafting.
        ItemHolder.of(container).itemAdd(itemOre);
        this.entities.push(container);
        var randomizerSeed = this.randomizer.fraction();
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
        this.entities.splice(0, 0, ...this.entityBuildBackground(Camera.of(entityCamera)));
        var randomizerSeed = this.randomizer.fraction();
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
        this.entities.splice(0, 0, ...this.entityBuildBackground(Camera.of(entityCamera)));
        var randomizerSeed = this.randomizer.fraction();
        var place = new PlaceRoom(this.name, "Demo", size, this.entities, randomizerSeed);
        return place;
    }
    buildTunnels(size, placeNameToReturnTo) {
        size = size.clone().multiplyScalar(4);
        this.build_Interior("Tunnels", size, placeNameToReturnTo);
        var randomizerSeed = this.randomizer.fraction();
        var networkNodeCount = 24;
        var network = Network.random(networkNodeCount, this.randomizer);
        network = network.transform(Transform_Scale.fromScaleFactors(size));
        //var tunnelsVisual = new VisualNetwork(network);
        var tunnelsVisual = VisualGroup.fromChildren([]);
        var wallThickness = 4; // todo
        var tunnelWidth = wallThickness * 8;
        var color = Color.Instances().Red;
        var nodes = network.nodes;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var visualWallNode = VisualOffset.fromOffsetAndChild(node.pos.clone(), VisualCircle.fromRadiusColorBorderAndThickness(tunnelWidth, color, wallThickness));
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
        var tunnelsEntity = Entity.fromNameAndProperties("Tunnels", [
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
        var placeSizeInZones = Coords.fromXYZ(3, 3, 1);
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
        var boxZeroes = BoxAxisAligned.create();
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
                var zone = new Zone("Zone" + zonePosInZones.toStringXY(), BoxAxisAligned.fromMinAndSize(zonePos, zoneSize), neighborNames, [
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
        // zoneStart.name, // zoneStartName
        (zoneName) => zonesByName.get(zoneName), (posToCheck) => // zoneAtPos
         zonesByName.get("Zone" + posInZones.overwriteWith(posToCheck).divide(zoneSize).floor().toStringXY()));
        var entityCamera = this.build_Camera(this.cameraViewSize, place.size());
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
        var mapSizeInCells = Coords.fromXYZ(mapCellSourceAsStrings[0].length, mapCellSourceAsStrings.length, 1);
        var mapCellSize = size.clone().divide(mapSizeInCells).ceiling();
        var mapCellSizeHalf = mapCellSize.clone().half();
        var entityExitPosRange = BoxAxisAligned.fromCenterAndSize(mapCellSize.clone().half(), Coords.create() // ?
        );
        var exit = this.entityBuildFromDefn(this.entityDefnsByName.get("Exit"), entityExitPosRange, this.randomizer);
        var exitPortal = Portal.of(exit);
        exitPortal.destinationPlaceName = placeNameToReturnTo;
        exitPortal.destinationEntityName = this.name;
        this.entities.push(exit);
        var cellCollider = BoxAxisAligned.fromCenterAndSize(mapCellSizeHalf.clone(), mapCellSize);
        var cellCollide = (uwpe) => {
            var e0 = uwpe.entity;
            var traversable = Traversable.of(e0);
            if (traversable != null) {
                if (traversable.isBlocking) {
                    var u = uwpe.universe;
                    var e1 = uwpe.entity2;
                    u.collisionHelper.collideEntitiesBounce(e0, e1);
                }
            }
        };
        var cellCollidable = Collidable.fromColliderPropertyNameAndCollide(cellCollider, Playable.name, cellCollide);
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
            var visualsByName = new Map([
                ["Center", VisualRectangle.fromSizeAndColorFill(mapCellSize, color)],
                [
                    "InsideSE",
                    VisualGroup.fromChildren([
                        // s
                        VisualOffset.fromOffsetAndChild(Coords.fromXY(mapCellSize.x / 2, mapCellSize.y - borderSizeCorner.y), VisualRectangle.fromSizeAndColorFill(borderSizeHorizontalHalf, color)),
                        // e
                        VisualOffset.fromOffsetAndChild(Coords.fromXY(mapCellSize.x - borderSizeCorner.x, mapCellSize.y / 2), VisualRectangle.fromSizeAndColorFill(borderSizeVerticalHalf, color))
                    ])
                ],
                [
                    "InsideSW",
                    VisualGroup.fromChildren([
                        // s
                        VisualOffset.fromOffsetAndChild(Coords.fromXY(0, mapCellSize.y - borderSizeCorner.y), VisualRectangle.fromSizeAndColorFill(borderSizeHorizontalHalf, color)),
                        // w
                        VisualOffset.fromOffsetAndChild(Coords.fromXY(0, mapCellSize.y / 2), VisualRectangle.fromSizeAndColorFill(borderSizeVerticalHalf, color))
                    ])
                ],
                [
                    "InsideNW",
                    VisualGroup.fromChildren([
                        // n
                        VisualOffset.fromOffsetAndChild(Coords.zeroes(), VisualRectangle.fromSizeAndColorFill(borderSizeHorizontalHalf, color)),
                        // w
                        VisualOffset.fromOffsetAndChild(Coords.zeroes(), VisualRectangle.fromSizeAndColorFill(borderSizeVerticalHalf, color))
                    ])
                ],
                [
                    "InsideNE",
                    VisualGroup.fromChildren([
                        // n
                        VisualOffset.fromOffsetAndChild(Coords.fromXY(mapCellSize.x / 2, 0), VisualRectangle.fromSizeAndColorFill(borderSizeHorizontalHalf, color)),
                        // e
                        VisualOffset.fromOffsetAndChild(Coords.fromXY(mapCellSize.x - borderSizeCorner.x, 0), VisualRectangle.fromSizeAndColorFill(borderSizeVerticalHalf, color)),
                    ])
                ],
                [
                    "OutsideSE",
                    VisualOffset.fromOffsetAndChild(Coords.zeroes(), VisualRectangle.fromSizeAndColorFill(borderSizeCorner, color))
                ],
                [
                    "OutsideSW",
                    VisualOffset.fromOffsetAndChild(Coords.fromXY(mapCellSize.x - borderSizeCorner.x, 0), VisualRectangle.fromSizeAndColorFill(borderSizeCorner, color))
                ],
                [
                    "OutsideNW",
                    VisualOffset.fromOffsetAndChild(Coords.fromXY(mapCellSize.x - borderSizeCorner.x, mapCellSize.y - borderSizeCorner.y), VisualRectangle.fromSizeAndColorFill(borderSizeCorner, color))
                ],
                [
                    "OutsideNE",
                    VisualOffset.fromOffsetAndChild(Coords.fromXY(0, mapCellSize.y - borderSizeCorner.y), VisualRectangle.fromSizeAndColorFill(borderSizeCorner, color))
                ],
                [
                    "ETop",
                    VisualOffset.fromOffsetAndChild(Coords.fromXY(mapCellSize.x - borderSizeCorner.x, 0), VisualRectangle.fromSizeAndColorFill(borderSizeVerticalHalf, color))
                ],
                [
                    "EBottom",
                    VisualOffset.fromOffsetAndChild(Coords.fromXY(mapCellSize.x - borderSizeCorner.x, mapCellSize.y / 2), VisualRectangle.fromSizeAndColorFill(borderSizeVerticalHalf, color))
                ],
                [
                    "SRight",
                    VisualOffset.fromOffsetAndChild(Coords.fromXY(mapCellSize.x / 2, mapCellSize.y - borderSizeCorner.y), VisualRectangle.fromSizeAndColorFill(borderSizeHorizontalHalf, color))
                ],
                [
                    "SLeft",
                    VisualOffset.fromOffsetAndChild(Coords.fromXY(0, mapCellSize.y - borderSizeCorner.y), VisualRectangle.fromSizeAndColorFill(borderSizeHorizontalHalf, color))
                ],
                [
                    "WBottom",
                    VisualOffset.fromOffsetAndChild(Coords.fromXY(0, mapCellSize.y / 2), VisualRectangle.fromSizeAndColorFill(borderSizeVerticalHalf, color))
                ],
                [
                    "WTop",
                    VisualOffset.fromOffsetAndChild(Coords.zeroes(), VisualRectangle.fromSizeAndColorFill(borderSizeVerticalHalf, color))
                ],
                [
                    "NLeft",
                    VisualOffset.fromOffsetAndChild(Coords.zeroes(), VisualRectangle.fromSizeAndColorFill(borderSizeHorizontalHalf, color))
                ],
                [
                    "NRight",
                    VisualOffset.fromOffsetAndChild(Coords.fromXY(mapCellSize.x / 2, 0), VisualRectangle.fromSizeAndColorFill(borderSizeHorizontalHalf, color))
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
            var visualsAsGroup = VisualGroup.fromChildren(visualsInOrder);
            return visualsAsGroup;
        };
        var universe = this.universe;
        var terrainNameToVisual = (terrainName) => {
            var imageName = "Terrain-" + terrainName;
            var terrainVisualImageCombined = new VisualImageFromLibrary(imageName);
            var image = terrainVisualImageCombined.image(universe);
            var imageSizeInPixels = image.sizeInPixels;
            var imageSizeInTiles = new Coords(5, 5, 1);
            var tileSizeInPixels = imageSizeInPixels.clone().divide(imageSizeInTiles);
            var tileSizeInPixelsHalf = tileSizeInPixels.clone().half();
            var tileCenterBounds = BoxAxisAligned.fromCenterAndSize(imageSizeInPixels.clone().half(), tileSizeInPixels);
            var terrainVisualCenter = new VisualImageScaledPartial(tileCenterBounds, mapCellSize, // sizeToDraw
            terrainVisualImageCombined);
            // hack - Correct for centering.
            terrainVisualCenter = VisualOffset.fromOffsetAndChild(mapCellSizeHalf, terrainVisualCenter);
            var tileOffsetInTilesHalf = Coords.create();
            var visualOffsetInMapCellsHalf = Coords.create();
            var offsetsToVisual = (tileOffsetInTilesHalf, visualOffsetInMapCellsHalf) => {
                var terrainVisualBounds = BoxAxisAligned.fromMinAndSize(tileOffsetInTilesHalf.clone().multiply(tileSizeInPixelsHalf), tileSizeInPixelsHalf);
                var terrainVisual = new VisualImageScaledPartial(terrainVisualBounds, mapCellSizeHalf, // sizeToDraw
                terrainVisualImageCombined);
                // hack - Correct for centering.
                terrainVisual = VisualOffset.fromOffsetAndChild(visualOffsetInMapCellsHalf.clone().multiply(mapCellSizeHalf), terrainVisual);
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
            var terrainVisualsAsGroup = VisualGroup.fromChildren(terrainVisuals);
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
                if (map.cellAtPosInCellsExists(neighborPos)) {
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
            var cellVisual = VisualGroup.fromChildren(cellVisuals);
            var cellAsEntity = Entity.fromNameAndProperties(this.name + cellPosInCells.toString(), [
                new Boundable(BoxAxisAligned.fromSize(mapCellSize)),
                cellCollidable.clone(),
                Drawable.fromVisual(cellVisual),
                Locatable.fromPos(cellPosInPixels),
                cellTerrain.traversable
            ]);
            return cellAsEntity;
        };
        var mapCellsAsEntities = map.cellsAsEntities(mapAndCellPosToEntity);
        this.entities.push(...mapCellsAsEntities);
        var entityPosRange = new BoxAxisAligned(size.clone().half(), size.clone().subtract(this.marginSize));
        var randomizer = this.randomizer;
        var ebfdac = (a, b, c, d, e) => this.entitiesBuildFromDefnAndCount(a, b, c, d, e);
        this.entities.push(...ebfdac(this.entityDefnsByName.get("Carnivore"), 1, null, entityPosRange, randomizer));
        this.entities.push(...ebfdac(this.entityDefnsByName.get("Doughnut"), 1, 12, entityPosRange, randomizer));
        this.entities.push(...ebfdac(this.entityDefnsByName.get("Flower"), 1, null, entityPosRange, randomizer));
        this.entities.push(...ebfdac(this.entityDefnsByName.get("Grass"), 12, null, entityPosRange, randomizer));
        this.entities.push(...ebfdac(this.entityDefnsByName.get("Grazer"), 3, null, entityPosRange, randomizer));
        this.entities.push(...ebfdac(this.entityDefnsByName.get("MushroomGenerator"), 2, null, entityPosRange, randomizer));
        this.entities.push(...ebfdac(this.entityDefnsByName.get("Tree"), 6, null, entityPosRange, randomizer));
        var randomizerSeed = this.randomizer.fraction();
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
        var entityPosRange = new BoxAxisAligned(size.clone().half(), size.clone().subtract(this.marginSize));
        var randomizer = this.randomizer;
        var es = entities;
        var epebfdac = (a, b) => es.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get(a), b, null, entityPosRange, randomizer));
        epebfdac("EnemyGeneratorChaserNormal", 1);
        epebfdac("EnemyGeneratorChaserCold", 1);
        epebfdac("EnemyGeneratorChaserHeat", 1);
        epebfdac("EnemyGeneratorRunnerNormal", 1);
        epebfdac("EnemyGeneratorShooterNormal", 1);
        epebfdac("EnemyGeneratorTankNormal", 1);
        epebfdac("Bar", 1);
        //entities.push(...this.entitiesBuildFromDefnAndCount(entityDefns.get("Mine"), 48, null, entityPosRange, randomizer));
        epebfdac("Tree", 10);
        epebfdac("Armor", 1);
        epebfdac("Boulder", 3);
        epebfdac("Carnivore", 1);
        epebfdac("Crystal", 2);
        epebfdac("Flower", 6);
        epebfdac("Fruit", 1);
        epebfdac("GrassGenerator", 3);
        epebfdac("Grazer", 1);
        epebfdac("Iron Ore", 1);
        epebfdac("Medicine", 2);
        epebfdac("MushroomGenerator", 1);
        epebfdac("Pick", 1);
        epebfdac("Shovel", 1);
        epebfdac("Speed Boots", 1);
        var entityMineLoader = this.entityBuildLoader(entityDefns.get("Mine"), 48, entityPosRange, randomizer);
        entities.push(entityMineLoader);
        var entityRadioMessage = this.entityBuildRadioMessage(Drawable.of(entityDefns.get("Friendly")).visual, "This is " + this.name + ".");
        entities.push(entityRadioMessage);
        placeNamesToIncludePortalsTo.forEach(placeName => {
            var entityDefnPortal = this.entityDefnsByName.get("Portal");
            var entityPortal = this.entityBuildFromDefn(entityDefnPortal, entityPosRange, randomizer);
            entityPortal.name = placeName;
            Portal.of(entityPortal).destinationPlaceName = placeName;
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
        var entityPosRange = BoxAxisAligned.fromCenterAndSize(this.size.clone().half(), this.size.clone().subtract(this.marginSize));
        var entityRing = this.entityBuildFromDefn(entityDefns.get("Ring"), entityPosRange, this.randomizer);
        var ringLoc = Locatable.of(entityRing).loc;
        ringLoc.pos.overwriteWith(Locatable.of(goalEntity).loc.pos);
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
    build_Interior_WithoutWallsOrExit(name, size) {
        // This method is a debugging helper AND a Zen riddle.
        // How can a place be "interior" without walls or an exit?
        this.name = name;
        this.size = size;
        this.entities = [];
        this.build_Camera(this.cameraViewSize, this.size);
    }
    build_SizeWallsAndMargins(namePrefix, placePos, areNeighborsConnectedESWN) {
        this.size = this.size.clearZ();
        var wallThickness = this.entityBuildObstacleWalls(Color.Instances().Gray, areNeighborsConnectedESWN, namePrefix, placePos, 0 // damagePerHit
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
        var cameraPosBox = BoxAxisAligned.fromMinAndMax(viewSizeHalf.clone().zSet(cameraZ), placeSize.clone().subtract(viewSizeHalf).zSet(cameraZ));
        var cameraPos = viewSizeHalf.clone();
        var cameraLoc = Disposition.fromPosAndOri(cameraPos, Orientation.Instances().ForwardZDownY.clone());
        var camera = new Camera(cameraViewSize, cameraHeightAbovePlayfield, // focalLength
        cameraLoc, (entities) => Camera.entitiesSortByRenderingOrderThenZThenY(entities));
        var cameraEntity = camera.toEntityFollowingEntityWithName("Player");
        Constrainable.of(cameraEntity).constraintAdd(new Constraint_ContainInBox(cameraPosBox));
        return cameraEntity;
    }
    entityBuildBackground(camera) {
        var returnValues = [];
        var visualBackgroundDimension = 100;
        var visualBackgroundCellSize = new Coords(.5, .5, .01).multiplyScalar(visualBackgroundDimension);
        var visualBackgroundBottom = new VisualRepeating(visualBackgroundCellSize, camera.viewSize.clone(), // viewSize
        VisualRectangle.fromSizeAndColorBorder(visualBackgroundCellSize, Color.fromFractionsRgba(1, 1, 1, 0.02)), true // expandViewStartAndEndByCell
        );
        var entityBackgroundBottom = Entity.fromNameAndProperties("BackgroundBottom", [
            new Locatable(Disposition.fromPos(new Coords(0, 0, camera.focalLength))),
            Drawable.fromVisual(visualBackgroundBottom),
        ]);
        returnValues.push(entityBackgroundBottom);
        visualBackgroundCellSize =
            Coords.fromXYZ(1, 1, .01).multiplyScalar(visualBackgroundDimension);
        var visualBackgroundTop = new VisualRepeating(visualBackgroundCellSize, // cellSize
        camera.viewSize.clone(), // viewSize
        new VisualRectangle(visualBackgroundCellSize, null, new Color(null, null, [1, 1, 1, 0.06]), null), true // expandViewStartAndEndByCell
        );
        var entityBackgroundTop = Entity.fromNameAndProperties("BackgroundTop", [
            Locatable.create(),
            Drawable.fromVisual(visualBackgroundTop),
        ]);
        returnValues.push(entityBackgroundTop);
        return returnValues;
    }
    entityBuildExit(placeNameToReturnTo) {
        var entityPosRange = new BoxAxisAligned(this.size.clone().half(), this.size.clone().subtract(this.marginSize));
        var exit = this.entityBuildFromDefn(this.entityDefnsByName.get("Exit"), entityPosRange, this.randomizer);
        var exitPortal = Portal.of(exit);
        exitPortal.destinationPlaceName = placeNameToReturnTo;
        exitPortal.destinationEntityName = this.name;
        this.entities.push(exit);
        return exit;
    }
    entitiesAllGround() {
        this.entities.forEach((x) => { if (Locatable.of(x) != null) {
            Locatable.of(x).loc.pos.z = 0;
        } });
    }
    entitiesBuildFromDefnAndCount(entityDefn, entityCount, itemQuantityPerEntity, posRange, randomizer) {
        var returnEntities = [];
        for (var i = 0; i < entityCount; i++) {
            var entity = this.entityBuildFromDefn(entityDefn, posRange, randomizer);
            var entityItem = Item.of(entity);
            if (entityItem != null) {
                entityItem.quantitySet(itemQuantityPerEntity || 1);
            }
            returnEntities.push(entity);
        }
        return returnEntities;
    }
    entityBuildFromDefn(entityDefn, posRange, randomizer) {
        var entity = entityDefn.clone();
        var entityLocatable = Locatable.of(entity);
        if (entityLocatable != null) {
            entityLocatable.loc.pos.randomize(randomizer).multiply(posRange.size).add(posRange.min());
        }
        return entity;
    }
    entityBuildGoal(entities, entitySize, numberOfKeysToUnlockGoal) {
        var itemKeyColor = Color.Instances().Yellow;
        var goalPos = Coords.create().randomize(this.randomizer).multiplyScalar(.5).addDimensions(.25, .25, 0).multiply(this.size);
        var goalLoc = Disposition.fromPos(goalPos);
        var goalColor = Color.Instances().GreenDark;
        var goalVisual = VisualGroup.fromChildren([
            VisualRectangle.fromSizeAndColorFill(entitySize, goalColor),
            VisualText.fromTextImmediateFontAndColor("" + numberOfKeysToUnlockGoal, this.font, itemKeyColor)
        ]);
        if (this.visualsHaveText) {
            goalVisual.children.push(VisualOffset.fromOffsetAndChild(Coords.fromXY(0, 0 - this.entityDimension * 2), VisualText.fromTextImmediateFontAndColor("Exit", this.font, goalColor)));
        }
        var goalEntity = Entity.fromNameAndProperties("Goal", [
            Locatable.fromDisp(goalLoc),
            Collidable.fromCollider(BoxAxisAligned.fromSize(entitySize)),
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
            var itemKeyCollider = Sphere.fromRadius(entityDimensionHalf);
            var itemKeyEntity = Entity.fromNameAndProperties(itemDefnKeyName + i, [
                Item.fromDefnName(itemDefnKeyName),
                Locatable.fromPos(itemKeyPos),
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
            var randomizer = RandomizerLCG.fromSeed(placeAsPlaceRoom.randomizerSeed);
            var placeSize = place.size();
            var entityPosRange = BoxAxisAligned.fromCenterAndSize(placeSize.clone().half(), placeSize.clone());
            var entitiesCreated = placeBuilder.entitiesBuildFromDefnAndCount(entityDefn, entityCount, null, entityPosRange, randomizer);
            place.entitiesToSpawnAdd(entitiesCreated);
        }, (uwpe) => // unload
         {
            var p = uwpe.place;
            var entitiesToRemove = p.entitiesAll().filter((x) => x.name.startsWith("Mine"));
            p.entitiesToRemoveAdd(entitiesToRemove);
        });
        var returnValue = Entity.fromNameAndProperties("Loader" + entityDefn.name, [
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
            if (Playable.of(eOther) != null) {
                var ePortal = uwpe.entity;
                var usable = Usable.of(ePortal);
                if (usable == null) {
                    var portal = Portal.of(ePortal);
                    uwpe.entitiesSwap(); // hack
                    portal.use(uwpe);
                    uwpe.entitiesSwap();
                }
            }
        };
        var forceFieldCollide = (uwpe) => {
            var eOther = uwpe.entity2;
            if (Playable.of(eOther) != null) {
                var ePortal = uwpe.entity;
                var forceField = ForceField.of(ePortal);
                if (forceField != null) {
                    forceField.applyToEntity(eOther);
                }
            }
        };
        for (var i = 0; i < numberOfWalls; i++) {
            var wallSize;
            var isNorthOrSouthWall = (i % 2 == 1);
            if (isNorthOrSouthWall) {
                wallSize = Coords.fromXYZ(this.size.x, wallThickness, 1);
            }
            else {
                wallSize = Coords.fromXYZ(wallThickness, this.size.y, 1);
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
            var wallCollider = BoxAxisAligned.fromSize(wallSize);
            var wallObstacle = new Obstacle();
            var wallCollidable = Collidable.fromColliderPropertyNameAndCollide(wallCollider, Movable.name, (uwpe) => wallObstacle.collide(uwpe));
            var wallBoundable = Boundable.fromCollidable(wallCollidable);
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
                var wallPartLoc = Disposition.fromPos(wallPartPos);
                var wallEntity = Entity.fromNameAndProperties("ObstacleWall" + i + "_" + d, [
                    wallBoundable,
                    wallCollidable,
                    Drawable.fromVisual(wallVisual),
                    new Locatable(wallPartLoc),
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
                var portalBox = BoxAxisAligned.fromSize(portalSize);
                var collidable = Collidable.fromColliderPropertyNameAndCollide(portalBox, Playable.name, portalCollide);
                var locatable = Locatable.fromPos(portalPos);
                var portalEntity = Entity.fromNameAndProperties("PortalToNeighbor" + i, [
                    Boundable.fromCollidable(collidable),
                    collidable,
                    locatable,
                    Movable.default(), // hack - For CollisionTracker.
                    portal
                ]);
                entities.push(portalEntity);
                var forceField = new ForceField(null, neighborOffset.clone().invert());
                var forceFieldCollidable = Collidable.fromColliderPropertyNameAndCollide(portalBox, Playable.name, forceFieldCollide);
                var forceFieldEntity = Entity.fromNameAndProperties("PortalToNeighbor" + i + "_ForceField", [
                    Boundable.fromCollidable(forceFieldCollidable),
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
        return Entity.fromNameAndProperties("RadioMessage", [
            new Recurrent(20, // ticksPerRecurrence
            1, // timesToRecur
            // recur
            (uwpe) => {
                var u = uwpe.universe;
                var p = uwpe.place;
                var e = uwpe.entity;
                var player = Playable.entityFromPlace(p);
                var playerItemHolder = ItemHolder.of(player);
                var itemRadio = Item.fromDefnName("Walkie-Talkie");
                var doesPlayerHaveRadio = playerItemHolder.hasItem(itemRadio);
                if (doesPlayerHaveRadio == false) {
                    Recurrent.of(e).timesRecurredSoFar = 0;
                }
                else {
                    var wordBubble = new WordBubble(visualForPortrait, [
                        message
                    ]);
                    var wordBubbleAsControl = wordBubble.toControl(u);
                    var venuesForLayers = [
                        u.venueCurrent(),
                        wordBubbleAsControl.toVenue()
                    ];
                    u.venueTransitionTo(new VenueLayered(venuesForLayers, null));
                }
            })
        ]);
    }
    entityDefnBuildStore() {
        var storeColor = Color.Instances().Brown;
        var entitySize = Coords.ones().multiplyScalar(this.entityDimension);
        var visual = VisualGroup.fromChildren([
            VisualRectangle.fromSizeAndColorFill(Coords.fromXY(1, 1.5).multiplyScalar(this.entityDimension), storeColor),
            VisualOffset.fromOffsetAndChild(Coords.fromXY(0, -.75).multiplyScalar(this.entityDimension), VisualRectangle.fromSizeAndColorFill(Coords.fromXY(1.1, .2).multiplyScalar(this.entityDimension), Color.Instances().Gray)),
        ]);
        if (this.visualsHaveText) {
            visual.children.push(VisualOffset.fromOffsetAndChild(Coords.fromXY(0, 0 - this.entityDimension * 2), VisualText.fromTextImmediateFontAndColor("Store", this.font, storeColor)));
        }
        var storeEntityDefn = Entity.fromNameAndProperties("Store", [
            Collidable.fromCollider(BoxAxisAligned.fromSize(entitySize)),
            Drawable.fromVisual(visual),
            new ItemStore("Coin"),
            ItemHolder.fromItems([
                Item.fromDefnNameAndQuantity("Coin", 100),
                Item.fromDefnNameAndQuantity("Bow", 1),
                Item.fromDefnNameAndQuantity("Key", 10),
                Item.fromDefnNameAndQuantity("Medicine", 100)
            ]),
            Locatable.create(),
            Usable.fromUse((uwpe) => {
                var eUsed = uwpe.entity2;
                ItemStore.of(eUsed).use(uwpe);
            })
        ]);
        return storeEntityDefn;
    }
    // Entity definitions.
    entityDefnBuildAccessory() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnAccessoryName = "Speed Boots";
        var itemAccessoryVisual = this.itemDefnsByName.get(itemDefnAccessoryName).visual;
        var itemAccessoryCollider = Sphere.fromRadius(entityDimensionHalf);
        var itemAccessoryEntityDefn = Entity.fromNameAndProperties(itemDefnAccessoryName, [
            Item.fromDefnName(itemDefnAccessoryName),
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
        var itemArmorCollider = Sphere.fromRadius(this.entityDimension / 2);
        var collidable = Collidable.fromCollider(itemArmorCollider);
        var box = BoxAxisAligned
            .create()
            .containPoints(path.points);
        box.center = itemArmorCollider.center;
        var boundable = new Boundable(box);
        var itemArmorEntityDefn = Entity.fromNameAndProperties(itemDefnArmorName, [
            new Armor(.5),
            boundable,
            collidable,
            Equippable.default(),
            Item.fromDefnName(itemDefnArmorName),
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
        var itemArrowCollider = Sphere.fromRadius(entityDimensionHalf);
        var collidable = Collidable.fromCollider(itemArrowCollider);
        var bounds = BoxAxisAligned.fromCenterAndSize(itemArrowCollider.center, arrowSize);
        var boundable = new Boundable(bounds);
        var roundsPerPile = 5;
        var itemArrowEntityDefn = Entity.fromNameAndProperties(itemDefnArrowName, [
            boundable,
            collidable,
            Drawable.fromVisual(itemArrowVisual),
            Item.fromDefnNameAndQuantity(itemDefnArrowName, roundsPerPile),
            Locatable.create(),
        ]);
        return itemArrowEntityDefn;
    }
    entityDefnBuildBomb() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnBombName = "Bomb";
        var itemBombVisual = this.itemDefnsByName.get(itemDefnBombName).visual;
        var itemBombCollider = Sphere.fromRadius(entityDimensionHalf);
        var itemBombDevice = Device.fromNameTicksToChargeAndUse("Bomb", 10, // ticksToCharge
        (uwpe) => this.entityDefnBuildBomb_Use(uwpe));
        var collidable = Collidable.fromCollider(itemBombCollider);
        var drawable = Drawable.fromVisual(itemBombVisual);
        var item = Item.fromDefnName(itemDefnBombName);
        var locatable = Locatable.create();
        var equippable = Equippable.default();
        var boundable = Boundable.fromCollidable(collidable);
        var itemBombEntityDefn = Entity.fromNameAndProperties(itemDefnBombName, [
            boundable,
            collidable,
            drawable,
            equippable,
            item,
            itemBombDevice,
            locatable
        ]);
        return itemBombEntityDefn;
    }
    entityDefnBuildBomb_Use(uwpe) {
        var entityUser = uwpe.entity;
        var entityDevice = uwpe.entity2;
        var userAsItemHolder = ItemHolder.of(entityUser);
        var hasAmmo = userAsItemHolder.hasItemWithDefnNameAndQuantity("Bomb", 1);
        if (hasAmmo == false) {
            return;
        }
        userAsItemHolder.itemSubtractDefnNameAndQuantity("Bomb", 1);
        EquipmentUser.of(entityUser).unequipItemsNoLongerHeld(uwpe);
        var userLoc = Locatable.of(entityUser).loc;
        var userPos = userLoc.pos;
        var userVel = userLoc.vel;
        var userSpeed = userVel.magnitude();
        if (userSpeed == 0) {
            return;
        }
        var projectileDimension = 1.5;
        var projectileVisual = VisualGroup.fromChildren([
            Drawable.of(entityDevice).visual
            // todo - Add sparks?
        ]);
        var userDirection = userVel.clone().normalize();
        var userRadius = Collidable.of(entityUser).collider.radius();
        var projectilePos = userPos.clone().add(userDirection
            .clone()
            .multiplyScalar(userRadius + projectileDimension)
            .double());
        var projectileOri = Orientation.fromForward(userVel.clone().normalize());
        var projectileLoc = Disposition.fromPosAndOri(projectilePos, projectileOri);
        projectileLoc.vel.overwriteWith(userVel).clearZ().double();
        var projectileCollider = Sphere.fromRadius(projectileDimension);
        // todo
        var projectileCollide = null;
        var collidable = Collidable.fromColliderPropertyNameAndCollide(projectileCollider, Collidable.name, projectileCollide);
        var projectileEntity = Entity.fromNameAndProperties("ProjectileBomb", [
            Ephemeral.fromTicksToLiveAndExpire(64, this.entityDefnBuildBomb_Use_ProjectileDie),
            Locatable.fromLoc(projectileLoc),
            collidable,
            Constrainable.fromConstraint(new Constraint_FrictionXY(.03, .5)),
            Drawable.fromVisual(projectileVisual),
            Equippable.default()
        ]);
        uwpe.place.entityToSpawnAdd(projectileEntity);
    }
    entityDefnBuildBomb_Use_ProjectileDie(uwpe) {
        var explosionRadius = 32;
        var explosionVisual = VisualCircle.fromRadiusAndColorFill(explosionRadius, Color.Instances().Yellow);
        var explosionCollider = Sphere.fromRadius(explosionRadius);
        var explosionCollide = (uwpe) => {
            var entityProjectile = uwpe.entity;
            var entityOther = uwpe.entity2;
            var killable = Killable.of(entityOther);
            if (killable != null) {
                killable.damageApply(uwpe, Damager.of(entityProjectile).damagePerHit);
            }
        };
        var entityDying = uwpe.entity;
        var collidable = Collidable.fromColliderPropertyNameAndCollide(explosionCollider, Killable.name, explosionCollide);
        var explosionEntity = Entity.fromNameAndProperties("BombExplosion", [
            collidable,
            Damager.fromDamagePerHit(Damage.fromAmount(20)),
            Drawable.fromVisual(explosionVisual),
            Ephemeral.fromTicksToLive(8),
            Locatable.of(entityDying)
        ]);
        uwpe.place.entityToSpawnAdd(explosionEntity);
    }
    entityDefnBuildBook() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnBookName = "Book";
        var itemBookVisual = this.itemDefnsByName.get(itemDefnBookName).visual;
        var itemBookCollider = Sphere.fromRadius(entityDimensionHalf);
        var collidable = Collidable.fromCollider(itemBookCollider);
        var drawable = Drawable.fromVisual(itemBookVisual);
        var item = Item.fromDefnName(itemDefnBookName);
        var locatable = Locatable.create();
        var boundable = Boundable.fromCollidable(collidable);
        var itemBookEntityDefn = Entity.fromNameAndProperties(itemDefnBookName, [
            boundable,
            collidable,
            drawable,
            item,
            locatable
        ]);
        return itemBookEntityDefn;
    }
    entityDefnBuildBow() {
        var itemDefnName = "Bow";
        var itemBowVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemBowCollider = Sphere.fromRadius(this.entityDimension);
        var itemBowUse = (uwpe) => // use
         {
            var w = uwpe.world;
            var p = uwpe.place;
            var entityUser = uwpe.entity;
            var entityDevice = uwpe.entity2;
            var device = Device.of(entityDevice);
            var tickCurrent = w.timerTicksSoFar;
            var ticksSinceUsed = tickCurrent - device.tickLastUsed;
            if (ticksSinceUsed < device.ticksToCharge) {
                return;
            }
            var userAsItemHolder = ItemHolder.of(entityUser);
            var hasAmmo = userAsItemHolder.hasItemWithDefnNameAndQuantity("Arrow", 1);
            if (hasAmmo == false) {
                return;
            }
            userAsItemHolder.itemSubtractDefnNameAndQuantity("Arrow", 1);
            EquipmentUser.of(entityUser).unequipItemsNoLongerHeld(uwpe);
            device.tickLastUsed = tickCurrent;
            var userLoc = Locatable.of(entityUser).loc;
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
            var userRadius = Collidable.of(entityUser).collider.radius();
            var projectilePos = userPos.clone().add(userDirection
                .clone()
                .multiplyScalar(userRadius + projectileDimension)
                .double());
            var projectileOri = Orientation.fromForward(userVel.clone().normalize());
            var projectileLoc = Disposition.fromPosAndOri(projectilePos, projectileOri);
            projectileLoc.vel.overwriteWith(userVel).clearZ().double();
            var projectileCollider = Sphere.fromRadius(projectileDimension);
            var projectileCollide = (uwpe) => {
                var entityProjectile = uwpe.entity;
                var entityOther = uwpe.entity2;
                var killable = Killable.of(entityOther);
                if (killable != null) {
                    killable.damageApply(uwpe, null);
                    Killable.of(entityProjectile).kill();
                }
            };
            var visualStrike = VisualCircle.fromRadiusAndColorFill(8, Color.Instances().Red);
            var killable = Killable.fromDie((uwpe) => // die
             {
                var entityKillable = uwpe.entity;
                var entityStrike = Entity.fromNameAndProperties("ArrowStrike", [
                    new Ephemeral(8, null),
                    Drawable.fromVisual(visualStrike),
                    Locatable.of(entityKillable)
                ]);
                uwpe.place.entityToSpawnAdd(entityStrike);
            });
            var projectileEntity = Entity.fromNameAndProperties("ProjectileArrow", [
                Damager.fromDamagePerHit(Damage.fromAmount(10)),
                Ephemeral.fromTicksToLive(32),
                killable,
                Locatable.fromDisp(projectileLoc),
                Collidable.fromColliderPropertyNameAndCollide(projectileCollider, Killable.name, projectileCollide),
                Drawable.fromVisual(projectileVisual),
            ]);
            p.entityToSpawnAdd(projectileEntity);
        };
        var itemBowDevice = Device.fromNameTicksToChargeAndUse("Bow", 10, // ticksToCharge
        itemBowUse);
        var collidable = Collidable.fromCollider(itemBowCollider);
        var drawable = Drawable.fromVisual(itemBowVisual);
        var equippable = Equippable.default();
        var item = Item.fromDefnName(itemDefnName);
        var locatable = Locatable.create();
        var boundable = Boundable.fromCollidable(collidable);
        var itemBowEntityDefn = Entity.fromNameAndProperties(itemDefnName, [
            boundable,
            collidable,
            drawable,
            equippable,
            item,
            itemBowDevice,
            locatable
        ]);
        return itemBowEntityDefn;
    }
    entityDefnBuildBread() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnBreadName = "Bread";
        var itemBreadVisual = this.itemDefnsByName.get(itemDefnBreadName).visual;
        var itemBreadCollider = Sphere.fromRadius(entityDimensionHalf);
        var collidable = Collidable.fromCollider(itemBreadCollider);
        var boundable = Boundable.fromCollidable(collidable);
        var itemBreadEntityDefn = Entity.fromNameAndProperties(itemDefnBreadName, [
            boundable,
            collidable,
            Drawable.fromVisual(itemBreadVisual),
            Item.fromDefnName(itemDefnBreadName),
            Locatable.create(),
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
                var regionToDrawAsBox = BoxAxisAligned.fromMinAndSize(regionPos, tileSizeInPixels);
                var visualForFrame = new VisualImageScaledPartial(regionToDrawAsBox, frameSizeScaled, visualTileset);
                frames.push(visualForFrame);
            }
        }
        var carVisualBody = new VisualDirectional(frames[0], // visualForNoDirection
        frames, // visualsForDirections
        null // headingInTurnsGetForEntity
        );
        var carVisual = VisualGroup.fromChildren([
            carVisualBody
        ]);
        if (this.visualsHaveText) {
            carVisual.children.push(VisualOffset.fromOffsetAndChild(Coords.fromXY(0, 0 - entityDimension * 2.5), VisualText.fromTextImmediateFontAndColor(defnName, this.font, Color.Instances().Blue)));
        }
        var carCollider = Sphere.fromRadius(entityDimension / 2);
        var carCollide = (uwpe) => {
            var entityVehicle = uwpe.entity;
            var entityOther = uwpe.entity2;
            if (Portal.of(entityOther) != null) {
                var usable = Usable.of(entityOther);
                if (usable == null) {
                    var portal = Portal.of(entityOther);
                    portal.use(uwpe);
                }
            }
            else {
                var universe = uwpe.universe;
                universe.collisionHelper.collideEntitiesBlock(entityVehicle, entityOther);
            }
        };
        var carCollidable = Collidable.fromColliderPropertyNameAndCollide(carCollider, Collidable.name, carCollide);
        var carConstrainable = new Constrainable([
            new Constraint_FrictionXY(.03, .2)
        ]);
        var carLoc = Disposition.create();
        //carLoc.spin = new Rotation(Coords.Instances().ZeroZeroOne, new Reference(.01));
        var carUsable = Usable.fromUse((uwpe) => {
            var p = uwpe.place;
            var eUsing = uwpe.entity;
            var eUsed = uwpe.entity2;
            var vehicle = eUsed.propertiesByName.get(Vehicle.name);
            vehicle.entityOccupant = eUsing;
            p.entityToRemoveAdd(eUsing);
        });
        var vehicle = new Vehicle(.2, // accelerationPerTick
        5, // speedMax
        .01 // steeringAngleInTurns
        );
        var drawable = Drawable.fromVisual(carVisual);
        var locatable = Locatable.fromDisp(carLoc);
        var boundable = Boundable.fromCollidable(carCollidable);
        var carEntityDefn = Entity.fromNameAndProperties(defnName, [
            boundable,
            carCollidable,
            carConstrainable,
            drawable,
            locatable,
            carUsable,
            vehicle
        ]);
        return carEntityDefn;
    }
    entityDefnBuildCoin() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnCoinName = "Coin";
        var itemCoinVisual = this.itemDefnsByName.get(itemDefnCoinName).visual;
        var itemCoinCollider = Sphere.fromRadius(entityDimensionHalf);
        var collidable = Collidable.fromCollider(itemCoinCollider);
        var drawable = Drawable.fromVisual(itemCoinVisual);
        var item = Item.fromDefnName(itemDefnCoinName);
        var locatable = Locatable.create();
        var boundable = Boundable.fromCollidable(collidable);
        var itemCoinEntityDefn = Entity.fromNameAndProperties(itemDefnCoinName, [
            boundable,
            collidable,
            drawable,
            item,
            locatable
        ]);
        return itemCoinEntityDefn;
    }
    entityDefnBuildCrystal() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnCrystalName = "Crystal";
        var itemCrystalVisual = this.itemDefnsByName.get(itemDefnCrystalName).visual;
        var itemCrystalCollider = Sphere.fromRadius(entityDimensionHalf);
        var itemCrystalEntityDefn = Entity.fromNameAndProperties(itemDefnCrystalName, [
            Collidable.fromCollider(itemCrystalCollider),
            Drawable.fromVisual(itemCrystalVisual),
            Item.fromDefnName(itemDefnCrystalName),
            Locatable.create()
        ]);
        return itemCrystalEntityDefn;
    }
    entityDefnBuildDoughnut() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnDoughnutName = "Doughnut";
        var itemDoughnutVisual = this.itemDefnsByName.get(itemDefnDoughnutName).visual;
        var itemDoughnutCollider = Sphere.fromRadius(entityDimensionHalf);
        var collidable = Collidable.fromCollider(itemDoughnutCollider);
        var boundable = Boundable.fromCollidable(collidable);
        var itemDoughnutEntityDefn = Entity.fromNameAndProperties(itemDefnDoughnutName, [
            boundable,
            collidable,
            Drawable.fromVisual(itemDoughnutVisual),
            Item.fromDefnName(itemDefnDoughnutName),
            Locatable.create()
        ]);
        return itemDoughnutEntityDefn;
    }
    entityDefnBuildFlower() {
        var entityDimension = this.entityDimension * .5;
        var itemDefnName = "Flower";
        var visual = this.itemDefnsByName.get(itemDefnName).visual;
        var collider = Sphere.fromRadius(entityDimension);
        var entityDefn = Entity.fromNameAndProperties(itemDefnName, [
            Item.fromDefnName(itemDefnName),
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
        var itemFruitCollider = Sphere.fromRadius(entityDimensionHalf);
        var itemFruitEntityDefn = Entity.fromNameAndProperties(itemDefnFruitName, [
            Item.fromDefnName(itemDefnFruitName),
            Locatable.create(),
            Collidable.fromCollider(itemFruitCollider),
            Drawable.fromVisual(itemFruitVisual)
        ]);
        return itemFruitEntityDefn;
    }
    entityDefnBuildGenerator(entityDefnToGenerate) {
        var generator = EntityGenerator.fromEntityTicksBatchMaxesAndPosBox(entityDefnToGenerate, 1200, // ticksPerGeneration
        1, // entitiesPerGeneration
        1, // entitiesGeneratedMaxConcurrent
        null, // entitiesGeneratedMaxAllTime
        null // boxToGenerateEntitiesWithin
        );
        var entityDefnGenerator = Entity.fromNameAndProperties(entityDefnToGenerate.name + "Generator", [
            generator,
            Locatable.create()
        ]);
        return entityDefnGenerator;
    }
    entityDefnBuildGrass() {
        var entityDimension = this.entityDimension / 2;
        var itemDefnName = "Grass";
        var itemGrassVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemGrassCollider = Sphere.fromRadius(entityDimension / 2);
        var itemGrassEntityDefn = Entity.fromNameAndProperties(itemDefnName, [
            Item.fromDefnName(itemDefnName),
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
        var itemHeartCollider = Sphere.fromRadius(entityDimensionHalf);
        var collidable = Collidable.fromCollider(itemHeartCollider);
        var boundable = Boundable.fromCollidable(collidable);
        var itemHeartEntityDefn = Entity.fromNameAndProperties(itemDefnHeartName, [
            boundable,
            collidable,
            Drawable.fromVisual(itemHeartVisual),
            Item.fromDefnName(itemDefnHeartName),
            Locatable.create(),
        ]);
        return itemHeartEntityDefn;
    }
    entityDefnBuildIron() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnIronName = "Iron";
        var itemIronVisual = this.itemDefnsByName.get(itemDefnIronName).visual;
        var itemIronCollider = Sphere.fromRadius(entityDimensionHalf);
        var itemIronEntityDefn = Entity.fromNameAndProperties(itemDefnIronName, [
            Item.fromDefnName(itemDefnIronName),
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
        var itemOreCollider = Sphere.fromRadius(entityDimensionHalf);
        var itemOreEntityDefn = Entity.fromNameAndProperties(itemDefnOreName, [
            Item.fromDefnName(itemDefnOreName),
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
        var itemLogCollider = Sphere.fromRadius(entityDimensionHalf);
        var itemLogEntityDefn = Entity.fromNameAndProperties(itemDefnLogName, [
            Item.fromDefnName(itemDefnLogName),
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
        var itemMeatCollider = Sphere.fromRadius(entityDimensionHalf);
        var collidable = Collidable.fromCollider(itemMeatCollider);
        var boundable = Boundable.fromCollidable(collidable);
        var itemMeatEntityDefn = Entity.fromNameAndProperties(itemDefnMeatName, [
            boundable,
            collidable,
            Drawable.fromVisual(itemMeatVisual),
            Item.fromDefnName(itemDefnMeatName),
            Locatable.create(),
            Usable.fromUse((uwpe) => itemMeatDefn.use(uwpe))
        ]);
        return itemMeatEntityDefn;
    }
    entityDefnBuildMedicine() {
        var entityDimensionHalf = this.entityDimension / 2;
        var itemDefnMedicineName = "Medicine";
        var itemMedicineVisual = this.itemDefnsByName.get(itemDefnMedicineName).visual;
        var itemMedicineCollider = Sphere.fromRadius(entityDimensionHalf);
        var itemMedicineEntityDefn = Entity.fromNameAndProperties(itemDefnMedicineName, [
            Collidable.fromCollider(itemMedicineCollider),
            Drawable.fromVisual(itemMedicineVisual),
            Equippable.default(),
            Item.fromDefnName(itemDefnMedicineName),
            Locatable.create()
        ]);
        return itemMedicineEntityDefn;
    }
    entityDefnBuildMushroom() {
        var entityDimension = this.entityDimension / 2;
        var itemDefnName = "Mushroom";
        var itemMushroomVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemMushroomCollider = Sphere.fromRadius(entityDimension / 2);
        var itemMushroomEntityDefn = Entity.fromNameAndProperties(itemDefnName, [
            Item.fromDefnName(itemDefnName),
            Locatable.create(),
            Collidable.fromCollider(itemMushroomCollider),
            Drawable.fromVisual(itemMushroomVisual)
        ]);
        return itemMushroomEntityDefn;
    }
    entityDefnBuildPick() {
        var itemDefnName = "Pick";
        var itemPickVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemPickCollider = Sphere.fromRadius(this.entityDimension / 2);
        var itemPickDevice = Device.fromNameTicksToChargeAndUse("Pick", 10, // ticksToCharge
        (uwpe) => // use
         {
            var p = uwpe.place;
            var eUser = uwpe.entity;
            var bouldersInPlace = p.entitiesAll().filter(x => x.name.startsWith("Boulder"));
            var rangeMax = 20; // todo
            var boulderInRange = bouldersInPlace.filter((x) => Locatable.of(x).distanceFromEntity(eUser) < rangeMax)[0];
            if (boulderInRange != null) {
                Killable.of(boulderInRange).kill();
            }
        });
        var itemPickEntityDefn = Entity.fromNameAndProperties(itemDefnName, [
            Item.fromDefnName(itemDefnName),
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
        var colors = Color.Instances();
        var itemPotionColor = colors.Blue;
        var itemPotionVisual = VisualGroup.fromChildren([
            VisualPolygon.fromPathAndColorsFillAndBorder(Path.fromPoints([
                Coords.fromXY(1, 1),
                Coords.fromXY(-1, 1),
                Coords.fromXY(-.2, 0),
                Coords.fromXY(-.2, -.5),
                Coords.fromXY(.2, -.5),
                Coords.fromXY(.2, 0)
            ]).transform(Transform_Scale.fromScalar(this.entityDimension)), itemPotionColor, colors.White)
        ]);
        if (this.visualsHaveText) {
            itemPotionVisual.children.push(VisualOffset.fromOffsetAndChild(Coords.fromXY(0, 0 - this.entityDimension), VisualText.fromTextImmediateFontAndColor(itemDefnPotionName, this.font, itemPotionColor)));
        }
        var itemPotionCollider = Sphere.fromRadius(entityDimensionHalf);
        var itemPotionEntityDefn = Entity.fromNameAndProperties(itemDefnPotionName, [
            Item.fromDefnName(itemDefnPotionName),
            Locatable.create(),
            Collidable.fromCollider(itemPotionCollider),
            Drawable.fromVisual(itemPotionVisual)
        ]);
        return itemPotionEntityDefn;
    }
    entityDefnBuildShovel() {
        var itemDefnName = "Shovel";
        var itemShovelVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemShovelCollider = Sphere.fromRadius(this.entityDimension / 2);
        var itemShovelDevice = Device.fromNameTicksToChargeAndUse("Shovel", 10, // ticksToCharge
        (uwpe) => // use
         {
            var p = uwpe.place;
            var eUser = uwpe.entity;
            var holesInPlace = p.entitiesAll().filter(x => x.name.startsWith("Hole"));
            var rangeMax = 20; // todo
            var holeInRange = holesInPlace.filter(x => Locatable.of(x).distanceFromEntity(eUser) < rangeMax)[0];
            if (holeInRange != null) {
                var isHoleEmpty = (ItemHolder.of(holeInRange).items.length == 0);
                if (isHoleEmpty) {
                    p.entityToRemoveAdd(holeInRange);
                }
                else {
                    var holeInRangePerceptible = Perceptible.of(holeInRange);
                    holeInRangePerceptible.isHiding =
                        (holeInRangePerceptible.isHiding == false);
                }
            }
            else {
                Locatable.of(eUser).entitySpawnWithDefnName(uwpe, "Hole");
            }
        });
        var itemShovelEntityDefn = Entity.fromNameAndProperties(itemDefnName, [
            Item.fromDefnName(itemDefnName),
            Locatable.create(),
            Collidable.fromCollider(itemShovelCollider),
            itemShovelDevice,
            Drawable.fromVisual(itemShovelVisual),
            Equippable.default()
        ]);
        return itemShovelEntityDefn;
    }
    entityDefnBuildSword() {
        return this.entityDefnBuildSword_WithDamageTypeName(null);
    }
    entityDefnBuildSwordCold() {
        return this.entityDefnBuildSword_WithDamageTypeName("Cold");
    }
    entityDefnBuildSwordHeat() {
        return this.entityDefnBuildSword_WithDamageTypeName("Heat");
    }
    entityDefnBuildSword_WithDamageTypeName(damageTypeName) {
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
        var itemSwordCollider = Sphere.fromRadius(this.entityDimension / 2);
        var itemSwordDeviceUse = (uwpe) => this.entityDefnBuildSword_DeviceUse(damageTypeName, uwpe);
        var itemSwordDevice = Device.fromNameTicksToChargeAndUse(itemDefnName, 10, itemSwordDeviceUse);
        var itemSwordVisual = this.itemDefnsByName.get(itemDefnName).visual.clone();
        itemSwordVisual.transform(Transform_Translate.fromDisplacement(Coords.fromXY(0, -1.1 * this.entityDimension)));
        var collidable = Collidable.fromCollider(itemSwordCollider);
        var boundable = Boundable.fromCollidable(collidable);
        var drawable = Drawable.fromVisual(itemSwordVisual);
        var equippable = Equippable.default();
        var item = Item.fromDefnName(itemDefnName);
        var locatable = Locatable.create();
        var itemSwordEntityDefn = Entity.fromNameAndProperties(itemDefnName, [
            boundable,
            collidable,
            drawable,
            equippable,
            item,
            itemSwordDevice,
            locatable,
        ]);
        return itemSwordEntityDefn;
    }
    entityDefnBuildSword_DeviceUse(damageTypeName, uwpe) {
        var universe = uwpe.universe;
        var world = uwpe.world;
        var place = uwpe.place;
        var entityUser = uwpe.entity;
        var entityDevice = uwpe.entity2;
        var userLoc = Locatable.of(entityUser).loc;
        var userPos = userLoc.pos;
        var userVel = userLoc.vel;
        var userSpeed = userVel.magnitude();
        if (userSpeed == 0) {
            return;
        }
        var userTirable = Tirable.of(entityUser);
        var staminaToFire = 10;
        if (userTirable.stamina < staminaToFire) {
            var message = "Too tired!";
            place.entitySpawn2(universe, world, universe.entityBuilder.messageFloater(message, this.font, userPos.clone(), Color.Instances().Red));
            return;
        }
        userTirable.staminaSubtract(staminaToFire);
        var userDirection = userVel.clone().normalize();
        var userRadius = Collidable.of(entityUser).collider.radius();
        var projectileDimension = 1.5;
        var projectilePos = userPos.clone().add(userDirection
            .clone()
            .multiplyScalar(userRadius + projectileDimension)
            .double());
        var projectileOri = Orientation.fromForward(userVel.clone().normalize());
        var projectileVisual = Drawable.of(entityDevice).visual;
        projectileVisual = projectileVisual.children[0].clone();
        projectileVisual.transform(new Transform_RotateRight(1));
        var projectileLoc = Disposition.fromPosAndOri(projectilePos, projectileOri);
        projectileLoc.vel.overwriteWith(userVel).clearZ().double();
        var projectileCollider = Sphere.fromRadius(projectileDimension);
        var projectileCollide = (uwpe) => {
            var entityProjectile = uwpe.entity;
            var entityOther = uwpe.entity2;
            var killable = Killable.of(entityOther);
            if (killable != null) {
                var damageToApply = Damager.of(entityProjectile).damagePerHit;
                killable.damageApply(uwpe, damageToApply);
                Killable.of(entityProjectile).kill();
            }
        };
        var visualStrike = VisualCircle.fromRadiusAndColorFill(8, Color.Instances().Red);
        var killable = Killable.fromDie((uwpe) => // die
         {
            var entityKillable = uwpe.entity;
            var entityStrike = Entity.fromNameAndProperties("SwordStrike", [
                Ephemeral.fromTicksToLive(8),
                Drawable.fromVisual(visualStrike),
                Locatable.of(entityKillable)
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
        var projectileEntity = Entity.fromNameAndProperties("ProjectileSword", [
            projectileDamager,
            Ephemeral.fromTicksToLive(8),
            killable,
            Locatable.fromDisp(projectileLoc),
            Collidable.fromColliderPropertyNamesToCollideWithAndCollide(projectileCollider, [Killable.name], projectileCollide),
            Drawable.fromVisual(projectileVisual)
        ]);
        place.entityToSpawnAdd(projectileEntity);
    }
    entityDefnBuildToolset() {
        var itemDefnName = "Toolset";
        var itemToolsetVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemToolsetCollider = Sphere.fromRadius(this.entityDimension / 2);
        var collidable = Collidable.fromCollider(itemToolsetCollider);
        var boundable = Boundable.fromCollidable(collidable);
        var itemToolsetEntityDefn = Entity.fromNameAndProperties(itemDefnName, [
            boundable,
            collidable,
            Drawable.fromVisual(itemToolsetVisual),
            Item.fromDefnName(itemDefnName),
            Locatable.create()
        ]);
        return itemToolsetEntityDefn;
    }
    entityDefnBuildTorch() {
        var itemDefnName = "Torch";
        var itemTorchVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemTorchCollider = Sphere.fromRadius(this.entityDimension / 2);
        var collidable = Collidable.fromCollider(itemTorchCollider);
        var boundable = Boundable.fromCollidable(collidable);
        var itemTorchEntityDefn = Entity.fromNameAndProperties(itemDefnName, [
            Animatable2.create(),
            boundable,
            collidable,
            Drawable.fromVisual(itemTorchVisual),
            Item.fromDefnName(itemDefnName),
            Locatable.create()
        ]);
        return itemTorchEntityDefn;
    }
    entityDefnBuildWeight() {
        var itemDefnName = "Weight";
        var itemWeightVisual = this.itemDefnsByName.get(itemDefnName).visual;
        var itemWeightCollider = Sphere.fromRadius(this.entityDimension / 2);
        var collidable = Collidable.fromCollider(itemWeightCollider);
        var boundable = Boundable.fromCollidable(collidable);
        var itemWeightEntityDefn = Entity.fromNameAndProperties(itemDefnName, [
            boundable,
            collidable,
            Drawable.fromVisual(itemWeightVisual),
            Item.fromDefnName(itemDefnName),
            Locatable.create()
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
            this.entityDefnBuildSword(),
            this.entityDefnBuildSwordCold(),
            this.entityDefnBuildSwordHeat(),
            this.entityDefnBuildToolset(),
            this.entityDefnBuildTorch(),
            this.entityDefnBuildWeight(),
        ];
        return entityDefns;
    }
    // Helpers.
    textWithColorAddToVisual(text, color, visual) {
        if (this.visualsHaveText) {
            visual.children.push(VisualOffset.fromOffsetAndChild(Coords.fromXY(0, 0 - this.entityDimension), VisualText.fromTextImmediateFontAndColor(text, this.font, color)));
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
    cellAtPosInCellsNoOverwrite(map, posInCells) {
        return this.cellAtPosInCells(map, posInCells, this.cellCreate());
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) {
        return this;
    }
}
