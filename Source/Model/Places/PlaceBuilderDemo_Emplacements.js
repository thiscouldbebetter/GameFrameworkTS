"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class PlaceBuilderDemo_Emplacements {
            constructor(parent) {
                this.parent = parent;
            }
            entityDefnBuildAnvil(entityDimension) {
                var anvilName = "Anvil";
                var anvilVisual = new GameFramework.VisualImageScaled(new GameFramework.VisualImageFromLibrary(anvilName), new GameFramework.Coords(1, 1, 0).multiplyScalar(entityDimension * 2) // sizeScaled
                );
                anvilVisual = new GameFramework.VisualGroup([anvilVisual]);
                if (this.parent.visualsHaveText) {
                    anvilVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(anvilName, GameFramework.Color.byName("Blue")), new GameFramework.Coords(0, 0 - entityDimension * 2, 0)));
                }
                var anvilUse = (universe, w, p, entityUsing, entityUsed) => {
                    var itemCrafter = entityUsed.itemCrafter();
                    var itemCrafterAsControls = itemCrafter.toControl(universe, universe.display.sizeInPixels, entityUsed, // entityItemCrafter
                    entityUsing, // entityItemHolder
                    universe.venueCurrent, true // includeTitleAndDoneButton
                    );
                    var venueNext = itemCrafterAsControls.toVenue();
                    universe.venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    return "";
                };
                var anvilItemCrafter = new GameFramework.ItemCrafter([
                    new GameFramework.CraftingRecipe("Enhanced Armor", 0, // ticksToComplete,
                    [
                        new GameFramework.Item("Armor", 1),
                        new GameFramework.Item("Iron", 1),
                        new GameFramework.Item("Toolset", 1)
                    ], [
                        new GameFramework.Entity("", // name
                        [
                            new GameFramework.Item("Enhanced Armor", 1),
                            new GameFramework.Armor(.3)
                        ]),
                        new GameFramework.Entity("", // name
                        [
                            new GameFramework.Item("Toolset", 1)
                        ])
                    ])
                ]);
                var itemAnvilEntityDefn = new GameFramework.Entity(anvilName, [
                    new GameFramework.Locatable(new GameFramework.Disposition(GameFramework.Coords.create(), null, null)),
                    GameFramework.Drawable.fromVisual(anvilVisual),
                    anvilItemCrafter,
                    new GameFramework.ItemHolder([], null, null),
                    new GameFramework.Usable(anvilUse)
                ]);
                return itemAnvilEntityDefn;
            }
            entityDefnBuildBoulder(entityDimension) {
                entityDimension /= 2;
                var itemDefnName = "Boulder";
                var colorBoulder = GameFramework.Color.byName("Gray");
                var itemBoulderVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualArc(entityDimension * 2, // radiusOuter
                    0, // radiusInner
                    new GameFramework.Coords(-1, 0, 0), // directionMin
                    .5, // angleSpannedInTurns
                    colorBoulder, null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemBoulderVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(itemDefnName, colorBoulder), new GameFramework.Coords(0, 0 - entityDimension * 3, 0)));
                }
                var collider = new GameFramework.Box(GameFramework.Coords.create(), new GameFramework.Coords(1, .1, 1).multiplyScalar(entityDimension));
                var collidable = new GameFramework.Collidable(0, // ticksToWaitBetweenCollisions
                collider, [GameFramework.Collidable.name], // entityPropertyNamesToCollideWith,
                // collideEntities
                (u, w, p, e, e2) => {
                    u.collisionHelper.collideEntitiesBounce(e, e2);
                });
                var killable = new GameFramework.Killable(1, // integrityMax
                null, // damageApply
                (u, w, p, entityDying) => {
                    var entityDropped = entityDying.locatable().entitySpawnWithDefnName(u, w, p, entityDying, "Iron Ore");
                    entityDropped.item().quantity = GameFramework.DiceRoll.roll("1d3", null);
                });
                var itemBoulderEntityDefn = new GameFramework.Entity(itemDefnName, [
                    GameFramework.Locatable.create(),
                    collidable,
                    GameFramework.Drawable.fromVisual(itemBoulderVisual),
                    killable
                ]);
                return itemBoulderEntityDefn;
            }
            entityDefnBuildCampfire(entityDimension) {
                var entityDimensionHalf = entityDimension / 2;
                var campfireName = "Campfire";
                var campfireColor = GameFramework.Color.byName("Orange");
                var flameVisual = GameFramework.VisualBuilder.Instance().flame(entityDimension);
                var smokePuffVisual = GameFramework.VisualCircle.fromRadiusAndColorFill(entityDimensionHalf, GameFramework.Color.byName("GrayLight"));
                var smokeVisual = new GameFramework.VisualParticles("Smoke", null, // ticksToGenerate
                1 / 3, // particlesPerTick
                () => 50, // particleTicksToLiveGet
                // particleVelocityGet
                () => new GameFramework.Coords(.33, -1.5, 0).add(new GameFramework.Coords(Math.random() - 0.5, 0, 0)), new GameFramework.Transform_Dynamic((transformable) => {
                    var transformableAsVisualCircle = transformable;
                    transformableAsVisualCircle.radius *= 1.02;
                    var color = transformableAsVisualCircle.colorFill.clone();
                    color.alpha(color.alpha(null) * .95);
                    transformableAsVisualCircle.colorFill = color;
                    return transformable;
                }), smokePuffVisual);
                var itemLogVisual = this.parent.itemDefnsByName.get("Log").visual;
                var itemLogVisualMinusText = itemLogVisual.clone();
                if (this.parent.visualsHaveText) {
                    itemLogVisualMinusText.children.length--;
                }
                var campfireVisual = new GameFramework.VisualGroup([
                    smokeVisual,
                    itemLogVisualMinusText,
                    flameVisual,
                ]);
                if (this.parent.visualsHaveText) {
                    campfireVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(campfireName, campfireColor), new GameFramework.Coords(0, 0 - entityDimension * 2, 0)));
                }
                var campfireCollider = new GameFramework.Sphere(GameFramework.Coords.create(), entityDimensionHalf);
                var campfireCollide = (u, w, p, entityCampfire, entityOther) => {
                    var entityOtherEffectable = entityOther.effectable();
                    if (entityOtherEffectable != null) {
                        entityOtherEffectable.effectAdd(GameFramework.Effect.Instances().Burning.clone());
                        //entityCampfire.collidable().ticksUntilCanCollide = 50;
                    }
                };
                var campfireCollidable = new GameFramework.Collidable(0, // ticksToWaitBetweenCollisions
                campfireCollider, [GameFramework.Collidable.name], campfireCollide);
                var campfireEntityDefn = new GameFramework.Entity(campfireName, [
                    GameFramework.Animatable.create(),
                    campfireCollidable,
                    GameFramework.Drawable.fromVisual(campfireVisual),
                    GameFramework.Locatable.create()
                ]);
                return campfireEntityDefn;
            }
            entityDefnBuildContainer(entityDimension) {
                var containerColor = GameFramework.Color.byName("Orange");
                var entitySize = new GameFramework.Coords(1.5, 1, 0).multiplyScalar(entityDimension);
                var visual = new GameFramework.VisualGroup([
                    GameFramework.VisualRectangle.fromSizeAndColorFill(entitySize, containerColor),
                    GameFramework.VisualRectangle.fromSizeAndColorFill(new GameFramework.Coords(1.5 * entityDimension, 1, 0), GameFramework.Color.byName("Gray")),
                    GameFramework.VisualRectangle.fromSizeAndColorFill(new GameFramework.Coords(.5, .5, 0).multiplyScalar(entityDimension), GameFramework.Color.byName("Gray"))
                ]);
                if (this.parent.visualsHaveText) {
                    visual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor("Container", containerColor), new GameFramework.Coords(0, 0 - entityDimension, 0)));
                }
                var containerEntityDefn = new GameFramework.Entity("Container", [
                    new GameFramework.Collidable(0, // ticksToWaitBetweenCollisions
                    new GameFramework.Box(GameFramework.Coords.create(), entitySize), null, null),
                    GameFramework.Drawable.fromVisual(visual),
                    new GameFramework.ItemContainer(),
                    new GameFramework.ItemHolder([], null, null),
                    GameFramework.Locatable.create(),
                    new GameFramework.Usable((universe, w, p, entityUsing, entityOther) => {
                        //entityOther.collidable().ticksUntilCanCollide = 50; // hack
                        var itemContainerAsControl = entityOther.itemContainer().toControl(universe, universe.display.sizeInPixels, entityUsing, entityOther, universe.venueCurrent);
                        var venueNext = itemContainerAsControl.toVenue();
                        venueNext = GameFramework.VenueFader.fromVenueTo(venueNext);
                        universe.venueNext = venueNext;
                        return null;
                    })
                ]);
                return containerEntityDefn;
            }
            entityDefnBuildExit(entityDimension) {
                var exitColor = GameFramework.Color.byName("Brown");
                var entitySize = new GameFramework.Coords(1, 1, 1).multiplyScalar(entityDimension);
                var visual = new GameFramework.VisualGroup([
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(0.5, 0, 0),
                        new GameFramework.Coords(-0.5, 0, 0),
                        new GameFramework.Coords(-0.5, -1.5, 0),
                        new GameFramework.Coords(0.5, -1.5, 0)
                    ]).transform(GameFramework.Transform_Scale.fromScalar(entityDimension)), exitColor, null),
                    new GameFramework.VisualOffset(GameFramework.VisualCircle.fromRadiusAndColorFill(entityDimension / 8, GameFramework.Color.byName("Yellow")), GameFramework.Coords.fromXY(entityDimension / 4, 0 - entityDimension * .6))
                ]);
                if (this.parent.visualsHaveText) {
                    visual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor("Exit", exitColor), new GameFramework.Coords(0, 0 - entityDimension * 2.5, 0)));
                }
                var collidable = new GameFramework.Collidable(0, // ticksToWaitBetweenCollisions
                new GameFramework.Box(GameFramework.Coords.create(), entitySize), null, null);
                var exitEntityDefn = new GameFramework.Entity("Exit", [
                    collidable,
                    GameFramework.Drawable.fromVisual(visual),
                    GameFramework.Locatable.create(),
                    new GameFramework.Portal(null, null, GameFramework.Coords.create()),
                    new GameFramework.Usable((u, w, p, eUsing, eUsed) => {
                        eUsed.portal().use(u, w, p, eUsing, eUsed);
                        return null;
                    })
                ]);
                return exitEntityDefn;
            }
            entityDefnBuildHole(entityDimension) {
                var entityName = "Hole";
                entityDimension *= 1.5;
                var itemHoleColor = GameFramework.Color.byName("Brown");
                var itemHoleVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(-0.5, 0.0, 0),
                        new GameFramework.Coords(0.5, 0.0, 0),
                        new GameFramework.Coords(0.4, -0.2, 0),
                        new GameFramework.Coords(-0.4, -0.2, 0),
                    ]).transform(GameFramework.Transform_Scale.fromScalar(entityDimension)), itemHoleColor, null)
                ]);
                if (this.parent.visualsHaveText) {
                    itemHoleVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(entityName, itemHoleColor), new GameFramework.Coords(0, 0 - entityDimension, 0)));
                }
                var use = (u, w, p, eUsing, eUsed) => {
                    var itemContainerAsControl = eUsed.itemContainer().toControl(u, u.display.sizeInPixels, eUsing, eUsed, u.venueCurrent);
                    var venueNext = itemContainerAsControl.toVenue();
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, null);
                    u.venueNext = venueNext;
                    return null;
                };
                var entityDefn = new GameFramework.Entity(entityName, [
                    new GameFramework.ItemContainer(),
                    new GameFramework.ItemHolder([], null, null),
                    GameFramework.Locatable.create(),
                    GameFramework.Drawable.fromVisual(itemHoleVisual),
                    new GameFramework.Perceptible(false, () => 0, () => 0),
                    new GameFramework.Usable(use)
                ]);
                return entityDefn;
            }
            entityDefnBuildObstacleBar(entityDimension) {
                var obstacleColor = GameFramework.Color.byName("Red");
                var obstacleBarSize = new GameFramework.Coords(6, 2, 1).multiplyScalar(entityDimension);
                var obstacleRotationInTurns = .0625;
                var obstacleCollider = new GameFramework.BoxRotated(new GameFramework.Box(GameFramework.Coords.create(), obstacleBarSize), obstacleRotationInTurns);
                var obstacleCollidable = GameFramework.Collidable.fromCollider(obstacleCollider);
                var obstacleBounds = obstacleCollidable.collider.sphereSwept().toBox(GameFramework.Box.create());
                var obstacleBoundable = new GameFramework.Boundable(obstacleBounds);
                var obstacleLoc = new GameFramework.Disposition(GameFramework.Coords.create(), new GameFramework.Orientation(GameFramework.Coords.create().fromHeadingInTurns(obstacleRotationInTurns), new GameFramework.Coords(0, 0, 1)), null);
                var visualBody = new GameFramework.VisualGroup([
                    new GameFramework.VisualRectangle(obstacleCollider.box.size, obstacleColor, obstacleColor, null)
                ]);
                if (this.parent.visualsHaveText) {
                    visualBody.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor("Bar", obstacleColor), new GameFramework.Coords(0, 0 - obstacleCollider.box.size.y, 0)));
                }
                var visual = new GameFramework.VisualRotate(visualBody);
                var obstacleBarEntityDefn = new GameFramework.Entity("Bar", [
                    obstacleBoundable,
                    obstacleCollidable,
                    new GameFramework.Damager(new GameFramework.Damage(10, null, null)),
                    GameFramework.Drawable.fromVisual(visual),
                    new GameFramework.Locatable(obstacleLoc)
                ]);
                return obstacleBarEntityDefn;
            }
            entityDefnBuildObstacleMine(entityDimension) {
                var obstacleColor = GameFramework.Color.byName("Red");
                var obstacleMappedCellSource = [
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
                var obstacleMappedSizeInCells = new GameFramework.Coords(obstacleMappedCellSource[0].length, obstacleMappedCellSource.length, 1);
                var obstacleMappedCellSize = new GameFramework.Coords(2, 2, 1);
                var entityDefnName = "Mine";
                var obstacleMappedMap = new GameFramework.MapOfCells(entityDefnName, obstacleMappedSizeInCells, obstacleMappedCellSize, null, // cellCreate
                (map, cellPosInCells, cellToOverwrite) => // cellAtPosInCells
                 {
                    var cellCode = map.cellSource[cellPosInCells.y][cellPosInCells.x];
                    var cellVisualName = (cellCode == "x" ? "Blocking" : "Open");
                    var cellIsBlocking = (cellCode == "x");
                    cellToOverwrite.visualName = cellVisualName;
                    cellToOverwrite.isBlocking = cellIsBlocking;
                    return cellToOverwrite;
                }, obstacleMappedCellSource);
                var obstacleMappedVisualLookup = new Map([
                    ["Blocking", new GameFramework.VisualRectangle(obstacleMappedCellSize, obstacleColor, null, false)],
                    ["Open", new GameFramework.VisualNone()]
                ]);
                var obstacleMappedVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualMap(obstacleMappedMap, obstacleMappedVisualLookup, null, null)
                ]);
                if (this.parent.visualsHaveText) {
                    obstacleMappedVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(entityDefnName, obstacleColor), new GameFramework.Coords(0, 0 - entityDimension * 2, 0)));
                }
                var obstacleCollider = new GameFramework.MapLocated(obstacleMappedMap, GameFramework.Disposition.create());
                var obstacleCollidable = new GameFramework.Collidable(0, // ticksToWaitBetweenCollisions
                obstacleCollider, null, null);
                var obstacleBounds = new GameFramework.Box(obstacleCollider.loc.pos, obstacleMappedMap.size);
                var obstacleBoundable = new GameFramework.Boundable(obstacleBounds);
                var obstacleMappedEntityDefn = new GameFramework.Entity(entityDefnName, [
                    obstacleBoundable,
                    obstacleCollidable,
                    new GameFramework.Damager(new GameFramework.Damage(10, null, null)),
                    GameFramework.Drawable.fromVisual(obstacleMappedVisual),
                    GameFramework.Locatable.create()
                ]);
                return obstacleMappedEntityDefn;
            }
            entityDefnBuildObstacleRing(entityDimension) {
                var obstacleColor = GameFramework.Color.byName("Gray");
                var obstacleRadiusOuter = entityDimension * 3.5;
                var obstacleRadiusInner = obstacleRadiusOuter - entityDimension;
                var obstacleAngleSpannedInTurns = .85;
                var obstacleLoc = new GameFramework.Disposition(GameFramework.Coords.create(), null, null);
                var obstacleCollider = new GameFramework.Arc(new GameFramework.Shell(new GameFramework.Sphere(GameFramework.Coords.create(), obstacleRadiusOuter), // sphereOuter
                obstacleRadiusInner), new GameFramework.Wedge(GameFramework.Coords.create(), // vertex
                new GameFramework.Coords(1, 0, 0), // directionMin
                //obstacleLoc.orientation.forward, // directionMin
                obstacleAngleSpannedInTurns));
                var obstacleRingVisual = new GameFramework.VisualArc(obstacleRadiusOuter, obstacleRadiusInner, new GameFramework.Coords(1, 0, 0), // directionMin
                obstacleAngleSpannedInTurns, obstacleColor, null);
                var obstacleRingObstacle = new GameFramework.Obstacle();
                var obstacleCollidable = new GameFramework.Collidable(0, obstacleCollider, [GameFramework.Movable.name], obstacleRingObstacle.collide);
                var obstacleRingEntityDefn = new GameFramework.Entity("Ring", [
                    new GameFramework.Locatable(obstacleLoc),
                    obstacleCollidable,
                    //new Damager(new Damage(10, null, null)),
                    GameFramework.Drawable.fromVisual(obstacleRingVisual),
                ]);
                return obstacleRingEntityDefn;
            }
            entityDefnBuildPillow(entityDimension) {
                var pillowName = "Pillow";
                var pillowVisual = new GameFramework.VisualImageScaled(new GameFramework.VisualImageFromLibrary(pillowName), new GameFramework.Coords(1, .75, 0).multiplyScalar(entityDimension * 2) // sizeScaled
                );
                pillowVisual = new GameFramework.VisualGroup([pillowVisual]);
                if (this.parent.visualsHaveText) {
                    pillowVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(pillowName, GameFramework.Color.byName("Blue")), new GameFramework.Coords(0, 0 - entityDimension * 2, 0)));
                }
                var pillowUse = (universe, w, p, entityUsing, entityUsed) => {
                    var tirable = entityUsing.tirable();
                    tirable.fallAsleep(universe, w, p, entityUsing);
                    var venueNext = universe.venueCurrent;
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, venueNext);
                    universe.venueNext = venueNext;
                    return ""; // todo
                };
                var itemPillowEntityDefn = new GameFramework.Entity(pillowName, [
                    GameFramework.Locatable.create(),
                    new GameFramework.Drawable(pillowVisual, null),
                    new GameFramework.ItemHolder([], null, null),
                    new GameFramework.Usable(pillowUse)
                ]);
                return itemPillowEntityDefn;
            }
            entityDefnBuildPortal(entityDimension) {
                var baseColor = "Brown";
                var entitySize = new GameFramework.Coords(1, 1, 1).multiplyScalar(entityDimension);
                var visual = new GameFramework.VisualGroup([
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(0.5, 0.5, 0),
                        new GameFramework.Coords(-0.5, 0.5, 0),
                        new GameFramework.Coords(-0.5, -0.5, 0),
                        new GameFramework.Coords(0, -1, 0),
                        new GameFramework.Coords(0.5, -0.5, 0)
                    ]).transform(GameFramework.Transform_Scale.fromScalar(entityDimension)), GameFramework.Color.byName(baseColor), null),
                    new GameFramework.VisualOffset(new GameFramework.VisualDynamic((u, w, p, e) => {
                        var baseColor = GameFramework.Color.byName("Brown");
                        return GameFramework.VisualText.fromTextAndColor(e.portal().destinationPlaceName, baseColor);
                    }), new GameFramework.Coords(0, entityDimension, 0))
                ]);
                var portalUse = (u, w, p, eUsing, eUsed) => {
                    eUsed.portal().use(u, w, p, eUsing, eUsed);
                    return null;
                };
                var portalEntity = new GameFramework.Entity("Portal", [
                    GameFramework.Collidable.fromCollider(GameFramework.Box.fromSize(entitySize)),
                    GameFramework.Drawable.fromVisual(visual),
                    GameFramework.Locatable.create(),
                    new GameFramework.Portal(null, "Exit", GameFramework.Coords.create()),
                    new GameFramework.Usable(portalUse)
                ]);
                return portalEntity;
            }
            entityDefnBuildTrafficCone(entityDimension) {
                var entityName = "TrafficCone";
                entityDimension *= 1.5;
                var color = GameFramework.Color.byName("Orange");
                var visual = new GameFramework.VisualGroup([
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(-1, 0, 0),
                        new GameFramework.Coords(-1, -0.1, 0),
                        new GameFramework.Coords(-0.5, -0.1, 0),
                        new GameFramework.Coords(-0.1, -1.5, 0),
                        new GameFramework.Coords(0.1, -1.5, 0),
                        new GameFramework.Coords(0.5, -0.1, 0),
                        new GameFramework.Coords(1, -0.1, 0),
                        new GameFramework.Coords(1, 0, 0)
                    ]).transform(GameFramework.Transform_Scale.fromScalar(entityDimension * 0.75)), color, null),
                ]);
                if (this.parent.visualsHaveText) {
                    visual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(entityName, color), new GameFramework.Coords(0, 0 - entityDimension * 2, 0)));
                }
                var colliderRadius = entityDimension * .25;
                var collider = new GameFramework.Sphere(GameFramework.Coords.create(), colliderRadius);
                var collidable = new GameFramework.Collidable(0, // ticksToWaitBetweenCollisions
                collider, [GameFramework.Movable.name], // entityPropertyNamesToCollideWith,
                // collideEntities
                (u, w, p, e, e2) => {
                    u.collisionHelper.collideEntitiesBounce(e, e2);
                });
                var boundable = new GameFramework.Boundable(GameFramework.Box.fromSize(GameFramework.Coords.fromXY(1, 1).multiplyScalar(colliderRadius)));
                var entityDefn = new GameFramework.Entity(entityName, [
                    boundable,
                    collidable,
                    GameFramework.Drawable.fromVisual(visual),
                    GameFramework.Locatable.create()
                ]);
                return entityDefn;
            }
            entityDefnBuildTree(entityDimension) {
                var entityName = "Tree";
                entityDimension *= 1.5;
                var color = GameFramework.Color.byName("GreenDark");
                var colorBorder = GameFramework.Color.byName("Black");
                var visualTree = new GameFramework.VisualGroup([
                    GameFramework.VisualRectangle.fromSizeAndColorFill(new GameFramework.Coords(1, 2, 0).multiplyScalar(entityDimension * 0.5), GameFramework.Color.byName("Brown")),
                    new GameFramework.VisualOffset(new GameFramework.VisualEllipse(entityDimension, // semimajorAxis
                    entityDimension * .8, 0, // rotationInTurns
                    color, colorBorder), new GameFramework.Coords(0, -entityDimension, 0)),
                ]);
                if (this.parent.visualsHaveText) {
                    visualTree.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(entityName, color), new GameFramework.Coords(0, 0 - entityDimension * 2, 0)));
                }
                var visual = new GameFramework.VisualOffset(visualTree, new GameFramework.Coords(0, 0 - entityDimension, 0));
                var collider = new GameFramework.Box(GameFramework.Coords.create(), new GameFramework.Coords(1, .1, 1).multiplyScalar(entityDimension * .25));
                var collidable = new GameFramework.Collidable(0, // ticksToWaitBetweenCollisions
                collider, [GameFramework.Collidable.name], // entityPropertyNamesToCollideWith,
                // collideEntities
                (u, w, p, e, e2) => {
                    u.collisionHelper.collideEntitiesBounce(e, e2);
                });
                var entityDefn = new GameFramework.Entity(entityName, [
                    GameFramework.Locatable.create(),
                    collidable,
                    GameFramework.Drawable.fromVisual(visual),
                ]);
                return entityDefn;
            }
        }
        GameFramework.PlaceBuilderDemo_Emplacements = PlaceBuilderDemo_Emplacements;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
