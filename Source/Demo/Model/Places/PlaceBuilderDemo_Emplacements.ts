
class PlaceBuilderDemo_Emplacements
{
	parent: PlaceBuilderDemo;

	constructor(parent: PlaceBuilderDemo)
	{
		this.parent = parent;
	}

	entityDefnBuildAnvil(entityDimension: number): Entity
	{
		var anvilName = "Anvil";
		var anvilVisual: Visual = new VisualImageScaled
		(
			new VisualImageFromLibrary(anvilName),
			Coords.fromXY(1, 1).multiplyScalar(entityDimension * 2) // sizeScaled
		);
		anvilVisual = new VisualGroup( [ anvilVisual ] );
		if (this.parent.visualsHaveText)
		{
			(anvilVisual as VisualGroup).children.push
			(
				new VisualOffset
				(
					VisualText.fromTextAndColor(anvilName, Color.byName("Blue")),
					Coords.fromXY(0, 0 - entityDimension * 2)
				)
			);
		}
		var anvilUse = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var universe = uwpe.universe;
			var entityUsing = uwpe.entity;
			var entityUsed = uwpe.entity2;

			var itemCrafter = entityUsed.itemCrafter();
			var itemCrafterAsControls = itemCrafter.toControl
			(
				universe,
				universe.display.sizeInPixels,
				entityUsed, // entityItemCrafter
				entityUsing, // entityItemHolder
				universe.venueCurrent,
				true // includeTitleAndDoneButton
			);
			var venueNext: Venue = itemCrafterAsControls.toVenue();
			universe.venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
			return "";
		};
		var anvilItemCrafter = new ItemCrafter
		([
			new CraftingRecipe
			(
				"Enhanced Armor",
				0, // ticksToComplete,
				[
					new Item("Armor", 1),
					new Item("Iron", 1),
					new Item("Toolset", 1)
				],
				[
					new Item("Enhanced Armor", 1),
					new Item("Toolset", 1)
				]
			)
		]);

		var itemAnvilEntityDefn = new Entity
		(
			anvilName,
			[
				new Locatable(new Disposition(Coords.create(), null, null) ),
				Drawable.fromVisual(anvilVisual),
				anvilItemCrafter,
				new ItemHolder([], null, null),
				new Usable(anvilUse)
			]
		);

		return itemAnvilEntityDefn;
	}

	entityDefnBuildBoulder(entityDimension: number): Entity
	{
		entityDimension /= 2;
		var itemDefnName = "Boulder";

		var colorBoulder = Color.byName("Gray");
		var itemBoulderVisual = new VisualGroup
		([
			new VisualArc
			(
				entityDimension * 2, // radiusOuter
				0, // radiusInner
				Coords.fromXY(-1, 0), // directionMin
				.5, // angleSpannedInTurns
				colorBoulder,
				null
			)
		]);
		if (this.parent.visualsHaveText)
		{
			itemBoulderVisual.children.push
			(
				new VisualOffset
				(
					VisualText.fromTextAndColor(itemDefnName, colorBoulder),
					Coords.fromXY(0, 0 - entityDimension * 3)
				)
			);
		}

		var collider = new Box
		(
			Coords.create(),
			new Coords(1, .1, 1).multiplyScalar(entityDimension)
		);
		var collidable = new Collidable
		(
			0, // ticksToWaitBetweenCollisions
			collider,
			[ Collidable.name ], // entityPropertyNamesToCollideWith,
			// collideEntities
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var u = uwpe.universe;
				var e = uwpe.entity;
				var e2 = uwpe.entity2;
				u.collisionHelper.collideEntitiesBounce(e, e2);
			}
		);

		var killable = new Killable
		(
			1, // integrityMax
			null, // damageApply
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var entityDying = uwpe.entity;
				var entityDropped = entityDying.locatable().entitySpawnWithDefnName
				(
					uwpe, "Iron Ore"
				);
				entityDropped.item().quantity = DiceRoll.roll("1d3", null);
			}
		);

		var itemBoulderEntityDefn = new Entity
		(
			itemDefnName,
			[
				Locatable.create(),
				collidable,
				Drawable.fromVisual(itemBoulderVisual),
				killable
			]
		);

		return itemBoulderEntityDefn;
	}

	entityDefnBuildCampfire(entityDimension: number): Entity
	{
		var entityDimensionHalf = entityDimension / 2;

		var campfireName = "Campfire";
		var campfireColor = Color.byName("Orange");

		var flameVisual = VisualBuilder.Instance().flame(entityDimension);
		var smokePuffVisual = VisualCircle.fromRadiusAndColorFill
		(
			entityDimensionHalf, Color.byName("GrayLight")
		);
		var smokeVisual = new VisualParticles
		(
			"Smoke",
			null, // ticksToGenerate
			1 / 3, // particlesPerTick
			() => 50, // particleTicksToLiveGet
			// particleVelocityGet
			() => Coords.fromXY(.33, -1.5).add(Coords.fromXY(Math.random() - 0.5, 0) ),
			new Transform_Dynamic
			(
				(transformable: Transformable) =>
				{
					var transformableAsVisualCircle = transformable as VisualCircle;
					transformableAsVisualCircle.radius *= 1.02;
					var color = transformableAsVisualCircle.colorFill.clone();
					color.alpha(color.alpha(null) * .95);
					transformableAsVisualCircle.colorFill = color;
					return transformable;
				}
			),
			smokePuffVisual
		);

		var itemLogVisual = this.parent.itemDefnsByName.get("Log").visual;
		var itemLogVisualMinusText = itemLogVisual.clone() as VisualGroup;

		if (this.parent.visualsHaveText)
		{
			itemLogVisualMinusText.children.length--;
		}

		var campfireVisual = new VisualGroup
		([
			smokeVisual,
			itemLogVisualMinusText,
			flameVisual,
		]);

		if (this.parent.visualsHaveText)
		{
			campfireVisual.children.push
			(
				new VisualOffset
				(
					VisualText.fromTextAndColor(campfireName, campfireColor),
					Coords.fromXY(0, 0 - entityDimension * 2)
				)
			);
		}

		var campfireCollider = new Sphere(Coords.create(), entityDimensionHalf);
		var campfireCollide = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var entityOther = uwpe.entity2;
			var entityOtherEffectable = entityOther.effectable();
			if (entityOtherEffectable != null)
			{
				entityOtherEffectable.effectAdd(Effect.Instances().Burning.clone());
				//entityCampfire.collidable().ticksUntilCanCollide = 50;
			}
		};
		var campfireCollidable = new Collidable
		(
			0, // ticksToWaitBetweenCollisions
			campfireCollider,
			[ Collidable.name ],
			campfireCollide
		);

		var campfireEntityDefn = new Entity
		(
			campfireName,
			[
				Animatable2.create(),
				campfireCollidable,
				Drawable.fromVisual(campfireVisual),
				Locatable.create()
			]
		);

		return campfireEntityDefn;
	}

	entityDefnBuildContainer(entityDimension: number): Entity
	{
		var containerColor = Color.byName("Orange");
		var entitySize = Coords.fromXY(1.5, 1).multiplyScalar(entityDimension);
		var visual = new VisualGroup
		([
			VisualRectangle.fromSizeAndColorFill
			(
				entitySize, containerColor
			),
			VisualRectangle.fromSizeAndColorFill
			(
				Coords.fromXY(1.5 * entityDimension, 1), Color.byName("Gray")
			),
			VisualRectangle.fromSizeAndColorFill
			(
				Coords.fromXY(.5, .5).multiplyScalar(entityDimension),
				Color.byName("Gray")
			)
		]);

		if (this.parent.visualsHaveText)
		{
			visual.children.push
			(
				new VisualOffset
				(
					VisualText.fromTextAndColor("Container", containerColor),
					Coords.fromXY(0, 0 - entityDimension)
				)
			);
		}

		var containerEntityDefn = new Entity
		(
			"Container",
			[
				new Collidable(
					0, // ticksToWaitBetweenCollisions
					new Box(Coords.create(), entitySize), null, null
				),
				Drawable.fromVisual(visual),
				new ItemContainer(),
				new ItemHolder([], null, null),
				Locatable.create(),
				new Usable
				(
					(uwpe: UniverseWorldPlaceEntities) =>
					{
						var universe = uwpe.universe;
						var entityUsing = uwpe.entity;
						var entityOther = uwpe.entity2;
						//entityOther.collidable().ticksUntilCanCollide = 50; // hack
						var itemContainer = entityOther.itemContainer();
						var itemContainerAsControl = itemContainer.toControl
						(
							universe, universe.display.sizeInPixels,
							entityUsing, entityOther,
							universe.venueCurrent
						);
						var venueNext: Venue = itemContainerAsControl.toVenue();
						venueNext = VenueFader.fromVenueTo(venueNext);
						universe.venueNext = venueNext;
						return null;
					}
				)
			]
		);

		return containerEntityDefn;
	}

	entityDefnBuildExit(entityDimension: number): Entity
	{
		var exitColor = Color.byName("Brown");
		var entitySize = Coords.ones().multiplyScalar(entityDimension);

		var visual = new VisualGroup
		([
			VisualPolygon.fromPathAndColorFill
			(
				new Path
				([
					Coords.fromXY(0.5, 0),
					Coords.fromXY(-0.5, 0),
					Coords.fromXY(-0.5, -1.5),
					Coords.fromXY(0.5, -1.5)
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				exitColor
			),
			new VisualOffset
			(
				VisualCircle.fromRadiusAndColorFill
				(
					entityDimension / 8, Color.byName("Yellow")
				),
				Coords.fromXY(entityDimension / 4, 0 - entityDimension * .6)
			)
		]);

		if (this.parent.visualsHaveText)
		{
			visual.children.push
			(
				new VisualOffset
				(
					VisualText.fromTextAndColor("Exit", exitColor),
					Coords.fromXY(0, 0 - entityDimension * 2.5)
				)
			);
		}

		var collidable = new Collidable
		(
			0, // ticksToWaitBetweenCollisions
			new Box(Coords.create(), entitySize),
			null, null
		);

		var exitEntityDefn = new Entity
		(
			"Exit",
			[
				collidable,
				Drawable.fromVisual(visual),
				Locatable.create(),
				new Portal(null, null, Coords.create()), // Destination must be set ouside this method.
				new Usable
				(
					(uwpe: UniverseWorldPlaceEntities) =>
					{
						var eUsed = uwpe.entity2;
						eUsed.portal().use(uwpe);
						return null;
					}
				)
			]
		);

		return exitEntityDefn;
	}

	entityDefnBuildHole(entityDimension: number): Entity
	{
		var entityName = "Hole";
		entityDimension *= 1.5;
		var itemHoleColor = Color.byName("Brown");
		var itemHoleVisual = new VisualGroup
		([
			VisualPolygon.fromPathAndColorFill
			(
				new Path
				([
					Coords.fromXY(-0.5, 0.0),
					Coords.fromXY(0.5, 0.0),
					Coords.fromXY(0.4, -0.2),
					Coords.fromXY(-0.4, -0.2),
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				itemHoleColor
			)
		]);

		if (this.parent.visualsHaveText)
		{
			itemHoleVisual.children.push
			(
				new VisualOffset
				(
					VisualText.fromTextAndColor(entityName, itemHoleColor),
					Coords.fromXY(0, 0 - entityDimension)
				)
			);
		}

		var use = (uwpe: UniverseWorldPlaceEntities): any =>
		{
			var u = uwpe.universe;
			var eUsing = uwpe.entity;
			var eUsed = uwpe.entity2;
			var itemContainerAsControl = eUsed.itemContainer().toControl
			(
				u, u.display.sizeInPixels, eUsing, eUsed, u.venueCurrent
			);
			var venueNext: Venue = itemContainerAsControl.toVenue();
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, null);
			u.venueNext = venueNext;
			return null;
		}

		var entityDefn = new Entity
		(
			entityName,
			[
				new ItemContainer(),
				new ItemHolder([], null, null),
				Locatable.create(),
				Drawable.fromVisual(itemHoleVisual),
				new Perceptible(false, () => 0, () => 0),
				new Usable(use)
			]
		);

		return entityDefn;
	}

	entityDefnBuildObstacleBar(entityDimension: number): Entity
	{
		var obstacleColor = Color.byName("Red");

		var obstacleBarSize = new Coords(6, 2, 1).multiplyScalar(entityDimension);
		var obstacleRotationInTurns = .0625;
		var obstacleCollider = new BoxRotated
		(
			new Box(Coords.create(), obstacleBarSize), obstacleRotationInTurns
		);
		var obstacleCollidable = Collidable.fromCollider(obstacleCollider);
		var obstacleBounds =
			(obstacleCollidable.collider as BoxRotated).sphereSwept().toBox(Box.create());
		var obstacleBoundable = new Boundable(obstacleBounds);

		var obstacleLoc = new Disposition
		(
			Coords.create(),
			new Orientation
			(
				Coords.create().fromHeadingInTurns(obstacleRotationInTurns),
				new Coords(0, 0, 1)
			),
			null
		);

		var visualBody = new VisualGroup
		([
			new VisualRectangle
			(
				obstacleCollider.box.size, obstacleColor, obstacleColor, null
			)
		]);

		if (this.parent.visualsHaveText)
		{
			visualBody.children.push
			(
				new VisualOffset
				(
					VisualText.fromTextAndColor("Bar", obstacleColor),
					Coords.fromXY(0, 0 - obstacleCollider.box.size.y)
				)
			);
		}

		var visual = new VisualRotate(visualBody);

		var obstacleBarEntityDefn = new Entity
		(
			"Bar",
			[
				obstacleBoundable,
				obstacleCollidable,
				new Damager(Damage.fromAmount(10)),
				Drawable.fromVisual(visual),
				new Locatable(obstacleLoc)
			]
		);

		return obstacleBarEntityDefn;
	}

	entityDefnBuildObstacleMine(entityDimension: number): Entity
	{
		var obstacleColor = Color.byName("Red");
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

		var entityDefnName = "Mine";
		var obstacleMappedMap = new MapOfCells<any>
		(
			entityDefnName,
			obstacleMappedSizeInCells,
			obstacleMappedCellSize,
			null, // cellCreate
			(map: MapOfCells<any>, cellPosInCells: any, cellToOverwrite: any) => // cellAtPosInCells
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

		var obstacleMappedVisualLookup = new Map<string, Visual>
		([
			[ "Blocking", new VisualRectangle(obstacleMappedCellSize, obstacleColor, null, false) ], // isCentered
			[ "Open", new VisualNone() ]
		]);
		var obstacleMappedVisual = new VisualGroup
		([
			new VisualMap(obstacleMappedMap, obstacleMappedVisualLookup, null, null)
		]);

		if (this.parent.visualsHaveText)
		{
			obstacleMappedVisual.children.push
			(
				new VisualOffset
				(
					VisualText.fromTextAndColor(entityDefnName, obstacleColor),
					Coords.fromXY(0, 0 - entityDimension * 2)
				)
			);
		}

		var obstacleCollider = new MapLocated
		(
			obstacleMappedMap, Disposition.create()
		);

		var obstacleCollidable = new Collidable
		(
			0, // ticksToWaitBetweenCollisions
			obstacleCollider, null, null
		);
		var obstacleBounds = new Box
		(
			obstacleCollider.loc.pos, obstacleMappedMap.size
		);
		var obstacleBoundable = new Boundable(obstacleBounds);

		var obstacleMappedEntityDefn = new Entity
		(
			entityDefnName,
			[
				obstacleBoundable,
				obstacleCollidable,
				new Damager(Damage.fromAmount(10)),
				Drawable.fromVisual(obstacleMappedVisual),
				Locatable.create()
			]
		);

		return obstacleMappedEntityDefn;
	}

	entityDefnBuildObstacleRing(entityDimension: number): Entity
	{
		var obstacleColor = Color.byName("Gray");
		var obstacleRadiusOuter = entityDimension * 3.5;
		var obstacleRadiusInner = obstacleRadiusOuter - entityDimension;
		var obstacleAngleSpannedInTurns = .85;
		var obstacleLoc = new Disposition(Coords.create(), null, null);
		var obstacleCollider = new Arc
		(
			new Shell
			(
				new Sphere(Coords.create(), obstacleRadiusOuter), // sphereOuter
				obstacleRadiusInner
			),
			new Wedge
			(
				Coords.create(), // vertex
				Coords.fromXY(1, 0), // directionMin
				//obstacleLoc.orientation.forward, // directionMin
				obstacleAngleSpannedInTurns
			)
		);

		var obstacleRingVisual = new VisualArc
		(
			obstacleRadiusOuter,
			obstacleRadiusInner,
			Coords.fromXY(1, 0), // directionMin
			obstacleAngleSpannedInTurns,
			obstacleColor,
			null
		);

		var obstacleRingObstacle = new Obstacle();
		var obstacleCollidable = new Collidable
		(
			0, obstacleCollider, [Movable.name], obstacleRingObstacle.collide
		);

		var obstacleRingEntityDefn = new Entity
		(
			"Ring",
			[
				new Locatable(obstacleLoc),
				obstacleCollidable,
				//new Damager(Damage.fromAmount(10)),
				Drawable.fromVisual(obstacleRingVisual),
			]
		);

		return obstacleRingEntityDefn;
	}

	entityDefnBuildPillow(entityDimension: number): Entity
	{
		var pillowName = "Pillow";
		var pillowVisual: Visual = new VisualImageScaled
		(
			new VisualImageFromLibrary(pillowName),
			Coords.fromXY(1, .75).multiplyScalar(entityDimension * 2) // sizeScaled
		);
		pillowVisual = new VisualGroup( [ pillowVisual ] );
		if (this.parent.visualsHaveText)
		{
			(pillowVisual as VisualGroup).children.push
			(
				new VisualOffset
				(
					VisualText.fromTextAndColor(pillowName, Color.byName("Blue")),
					Coords.fromXY(0, 0 - entityDimension * 2)
				)
			);
		}
		var pillowUse = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var universe = uwpe.universe;
			var entityUsing = uwpe.entity;

			var tirable = entityUsing.tirable();
			tirable.fallAsleep(uwpe);
			var venueNext = universe.venueCurrent;
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, venueNext);
			universe.venueNext = venueNext;
			return ""; // todo
		};

		var itemPillowEntityDefn = new Entity
		(
			pillowName,
			[
				Locatable.create(),
				new Drawable(pillowVisual, null),
				new ItemHolder([], null, null),
				new Usable(pillowUse)
			]
		);

		return itemPillowEntityDefn;
	}

	entityDefnBuildPortal(entityDimension: number): Entity
	{
		var baseColor = "Brown";

		var entitySize = Coords.ones().multiplyScalar(entityDimension);

		var visual = new VisualGroup
		([
			VisualPolygon.fromPathAndColorFill
			(
				new Path
				([
					Coords.fromXY(0.5, 0.5),
					Coords.fromXY(-0.5, 0.5),
					Coords.fromXY(-0.5, -0.5),
					Coords.fromXY(0, -1),
					Coords.fromXY(0.5, -0.5)
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension)
				),
				Color.byName(baseColor)
			),
			new VisualOffset
			(
				new VisualDynamic
				(
					(uwpe: UniverseWorldPlaceEntities) =>
					{
						var e = uwpe.entity;
						var baseColor = Color.byName("Brown");
						return VisualText.fromTextAndColor
						(
							e.portal().destinationPlaceName,
							baseColor
						)
					}
				),
				Coords.fromXY(0, entityDimension)
			)
		]);

		var portalUse = (uwpe: UniverseWorldPlaceEntities): any =>
		{
			var eUsed = uwpe.entity2;
			eUsed.portal().use(uwpe);
			return null;
		};

		var portalEntity = new Entity
		(
			"Portal",
			[
				Collidable.fromCollider(Box.fromSize(entitySize)),
				Drawable.fromVisual(visual),
				Locatable.create(),
				new Portal(null, "Exit", Coords.create()),
				new Usable(portalUse)
			]
		);

		return portalEntity;
	}

	entityDefnBuildTrafficCone(entityDimension: number): Entity
	{
		var entityName = "TrafficCone";
		entityDimension *= 1.5;
		var color = Color.byName("Orange");
		var visual = new VisualGroup
		([
			VisualPolygon.fromPathAndColorFill
			(
				new Path
				([
					Coords.fromXY(-1, 0),
					Coords.fromXY(-1, -0.1),
					Coords.fromXY(-0.5, -0.1),
					Coords.fromXY(-0.1, -1.5),
					Coords.fromXY(0.1, -1.5),
					Coords.fromXY(0.5, -0.1),
					Coords.fromXY(1, -0.1),
					Coords.fromXY(1, 0)
				]).transform
				(
					Transform_Scale.fromScalar(entityDimension * 0.75)
				),
				color
			),
		]);
		if (this.parent.visualsHaveText)
		{
			visual.children.push
			(
				new VisualOffset
				(
					VisualText.fromTextAndColor(entityName, color),
					Coords.fromXY(0, 0 - entityDimension * 2)
				)
			);
		}

		var colliderRadius = entityDimension * .25;
		var collider = new Sphere(Coords.create(), colliderRadius);
		var collidable = new Collidable
		(
			0, // ticksToWaitBetweenCollisions
			collider,
			[ Movable.name ], // entityPropertyNamesToCollideWith,
			// collideEntities
			(uwpe: UniverseWorldPlaceEntities, c: Collision) =>
			{
				var universe = uwpe.universe;
				var e = uwpe.entity;
				var e2 = uwpe.entity2;
				universe.collisionHelper.collideEntitiesBounce(e, e2);
			}
		);

		var boundable = new Boundable
		(
			Box.fromSize
			(
				Coords.fromXY(1, 1).multiplyScalar(colliderRadius)
			)
		);

		var entityDefn = new Entity
		(
			entityName,
			[
				boundable,
				collidable,
				Drawable.fromVisual(visual),
				Locatable.create()
			]
		);

		return entityDefn;
	}

	entityDefnBuildTree(entityDimension: number): Entity
	{
		var entityName = "Tree";
		entityDimension *= 1.5;
		var color = Color.byName("GreenDark");
		var colorBorder = Color.byName("Black");
		var visualTree = new VisualGroup
		([
			VisualRectangle.fromSizeAndColorFill
			(
				Coords.fromXY(1, 2).multiplyScalar(entityDimension * 0.5),
				Color.byName("Brown")
			),
			new VisualOffset
			(
				new VisualEllipse
				(
					entityDimension, // semimajorAxis
					entityDimension * .8,
					0, // rotationInTurns
					color,
					colorBorder,
					false // shouldUseEntityOrientation
				),
				Coords.fromXY(0, -entityDimension)
			),
		]);
		if (this.parent.visualsHaveText)
		{
			visualTree.children.push
			(
				new VisualOffset
				(
					VisualText.fromTextAndColor(entityName, color),
					Coords.fromXY(0, 0 - entityDimension * 2)
				)
			);
		}
		var visual = new VisualOffset
		(
			visualTree, Coords.fromXY(0, 0 - entityDimension)
		);
		var collider = new Box
		(
			Coords.create(),
			new Coords(1, .1, 1).multiplyScalar(entityDimension * .25)
		);
		var collidable = new Collidable
		(
			0, // ticksToWaitBetweenCollisions
			collider,
			[ Collidable.name ], // entityPropertyNamesToCollideWith,
			// collideEntities
			(uwpe: UniverseWorldPlaceEntities, c: Collision) =>
			{
				var u = uwpe.universe;
				var e = uwpe.entity;
				var e2 = uwpe.entity2;
				u.collisionHelper.collideEntitiesBounce(e, e2);
			}
		);

		var entityDefn = new Entity
		(
			entityName,
			[
				Locatable.create(),
				collidable,
				Drawable.fromVisual(visual),
			]
		);

		return entityDefn;
	}
}
