class PlaceBuilderDemo_Emplacements
{
	parent: PlaceBuilderDemo;

	constructor(parent: PlaceBuilderDemo)
	{
		this.parent = parent;
	}

	entityDefnBuildBoulder(entityDimension: number): Entity
	{
		entityDimension /= 2;
		var itemDefnName = "Boulder";

		var colorBoulder = "Gray";
		var itemBoulderVisual = new VisualGroup
		([
			new VisualArc
			(
				entityDimension * 2, // radiusOuter
				0, // radiusInner
				new Coords(-1, 0, 0), // directionMin
				.5, // angleSpannedInTurns
				colorBoulder,
				null
			),
			new VisualOffset
			(
				new VisualText(new DataBinding(itemDefnName, null, null), colorBoulder, null),
				new Coords(0, 0 - entityDimension * 3, 0)
			)
		]);

		var collider = new Box
		(
			new Coords(0, 0, 0),
			new Coords(1, .1, 1).multiplyScalar(entityDimension)
		);
		var collidable = new Collidable
		(
			collider,
			[ Collidable.name ], // entityPropertyNamesToCollideWith,
			// collideEntities
			(u: Universe, w: World, p: Place, e: Entity, e2: Entity) => { u.collisionHelper.collideCollidablesReverseVelocities(e, e2); }
		);

		var itemBoulderEntityDefn = new Entity
		(
			itemDefnName,
			[
				new Locatable( new Disposition(new Coords(0, 0, 0), null, null) ),
				collidable,
				new Drawable(itemBoulderVisual, null),
				new DrawableCamera()
			]
		);

		return itemBoulderEntityDefn;
	}

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

		var obstacleMappedVisualLookup = new Map<string, Visual>
		([
			[ "Blocking", new VisualRectangle(obstacleMappedCellSize, obstacleColor, null, false) ], // isCentered
			[ "Open", new VisualNone() ]
		]);
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
		);

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
}
