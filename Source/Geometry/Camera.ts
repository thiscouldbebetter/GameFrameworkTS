
namespace ThisCouldBeBetter.GameFramework
{

export class Camera implements EntityProperty<Camera>
{
	viewSize: Coords;
	focalLength: number;
	loc: Disposition;
	_entitiesInViewSort: (e: Entity[]) => Entity[];

	viewSizeHalf: Coords;
	viewCollider: Box;
	entitiesInView: Entity[];

	_clipPlanes: Plane[];
	_posSaved: Coords;

	constructor
	(
		viewSize: Coords,
		focalLength: number,
		loc: Disposition,
		entitiesInViewSort: (e: Entity[]) => Entity[]
	)
	{
		this.viewSize = viewSize;
		this.focalLength = focalLength;
		this.loc = loc;
		this._entitiesInViewSort = entitiesInViewSort;

		this.viewSizeHalf = this.viewSize.clone().clearZ().half();

		var viewColliderSize = this.viewSize.clone();
		viewColliderSize.z = Number.POSITIVE_INFINITY;
		this.viewCollider = new Box
		(
			this.loc.pos, viewColliderSize
		);
		this.entitiesInView = new Array<Entity>();

		this._posSaved = Coords.create();
	}

	static default(): Camera
	{
		return Camera.fromEntitiesInViewSort
		(
			null
		);
	}

	static fromEntitiesInViewSort
	(
		entitiesInViewSort: (e: Entity[]) => Entity[]
	): Camera
	{
		return new Camera
		(
			new Coords(400, 300, 1000), // viewSize
			150, // focalLength
			Disposition.fromPosAndOrientation
			(
				new Coords(0, 0, -150),
				Orientation.Instances().ForwardZDownY.clone()
			),
			entitiesInViewSort
		);
	}

	/*
	clipPlanes(): Plane[]
	{
		if (this._clipPlanes == null)
		{
			this._clipPlanes =
			[
				new Plane(Coords.create(), 0),
				new Plane(Coords.create(), 0),
				new Plane(Coords.create(), 0),
				new Plane(Coords.create(), 0),
			];
		}

		var cameraLoc = this.loc;
		var cameraOrientation = cameraLoc.orientation;

		var cameraPos = cameraLoc.pos;

		var centerOfViewPlane = cameraPos.clone().add
		(
			cameraOrientation.forward.clone().multiplyScalar
			(
				this.focalLength
			)
		);

		var cornerOffsetRight =	cameraOrientation.right.clone().multiplyScalar
		(
			this.viewSizeHalf.x
		);

		var cornerOffsetDown = cameraOrientation.down.clone().multiplyScalar
		(
			this.viewSizeHalf.y
		);

		var cameraViewCorners =
		[
			centerOfViewPlane.clone().add
			(
				cornerOffsetRight
			).add
			(
				cornerOffsetDown
			),

			centerOfViewPlane.clone().subtract
			(
				cornerOffsetRight
			).add
			(
				cornerOffsetDown
			),

			centerOfViewPlane.clone().subtract
			(
				cornerOffsetRight
			).subtract
			(
				cornerOffsetDown
			),

			centerOfViewPlane.clone().add
			(
				cornerOffsetRight
			).subtract
			(
				cornerOffsetDown
			),

		];

		var numberOfCorners = cameraViewCorners.length;

		for (var i = 0; i < numberOfCorners; i++)
		{
			var iNext = i + 1;
			if (iNext >= numberOfCorners)
			{
				iNext = 0;
			}

			var clipPlane = this._clipPlanes[i];

			var cameraViewCorner = cameraViewCorners[i];
			var cameraViewCornerNext = cameraViewCorners[iNext];

			clipPlane.fromPoints
			(
				cameraPos,
				cameraViewCorner,
				cameraViewCornerNext
			);
		}

		return this._clipPlanes;
	}
	*/

	coordsTransformViewToWorld(viewCoords: Coords, ignoreZ: boolean): Coords
	{
		var cameraLoc = this.loc;

		if (ignoreZ)
		{
			viewCoords.z = this.focalLength;
		}

		var worldCoords = viewCoords.subtract(this.viewSizeHalf);

		cameraLoc.orientation.unprojectCoordsRDF
		(
			worldCoords
		);

		worldCoords.add
		(
			cameraLoc.pos
		);

		return worldCoords;
	}

	coordsTransformWorldToView(worldCoords: Coords): Coords
	{
		var cameraPos = this.loc.pos;
		var cameraOrientation = this.loc.orientation;

		var viewCoords = worldCoords.subtract(cameraPos);

		cameraOrientation.projectCoordsRDF(viewCoords);

		if (this.focalLength != null)
		{
			var viewCoordsZ = viewCoords.z;
			if (viewCoordsZ != 0)
			{
				viewCoords.multiplyScalar(this.focalLength).divideScalar(viewCoordsZ);
				viewCoords.z = viewCoordsZ;
			}
		}

		viewCoords.add(this.viewSizeHalf);

		return viewCoords;
	}

	drawEntitiesInView
	(
		uwpe: UniverseWorldPlaceEntities,
		cameraEntity: Entity, display: Display
	): void
	{
		var universe = uwpe.universe;
		var place = uwpe.place;

		this.loc.pos.round(); // hack - To prevent lines between map tiles.

		this.entitiesInView = this.drawEntitiesInView_1_FindEntitiesInView
		(
			place, cameraEntity, universe.collisionHelper, this.entitiesInView
		);

		this.drawEntitiesInView_2_Draw
		(
			uwpe, display, this.entitiesInView
		);
	}

	drawEntitiesInView_1_FindEntitiesInView
	(
		place: Place, cameraEntity: Entity,
		collisionHelper: CollisionHelper, entitiesInView: Entity[]
	): Entity[]
	{
		var collisionTracker = (place as PlaceBase).collisionTracker();
		if (collisionTracker == null)
		{
			entitiesInView = this.drawEntitiesInView_1_FindEntitiesInView_WithoutTracker
			(
				place, collisionHelper, entitiesInView
			);
		}
		else
		{
			entitiesInView = this.drawEntitiesInView_1_FindEntitiesInView_WithTracker
			(
				place, cameraEntity, collisionHelper, entitiesInView, collisionTracker
			);
		}

		return entitiesInView;
	}

	drawEntitiesInView_1_FindEntitiesInView_WithTracker
	(
		place: Place, cameraEntity: Entity, collisionHelper: CollisionHelper,
		entitiesInView: Entity[], collisionTracker: CollisionTracker
	): Entity[]
	{
		var cameraCollidable = cameraEntity.collidable();
		//cameraCollidable.isDisabled = false;
		cameraCollidable.entitiesAlreadyCollidedWith.length = 0;
		var collisions = collisionTracker.entityCollidableAddAndFindCollisions
		(
			cameraEntity, collisionHelper, new Array<Collision>()
		);
		var entitiesCollidedWith = collisions.map(x => x.entitiesColliding[1]);
		var entitiesInView = entitiesCollidedWith.filter(x => x.drawable() != null);
		//cameraCollidable.isDisabled = true;

		var drawablesAll = place.drawables();
		var drawablesUnboundable = drawablesAll.filter(x => x.boundable() == null);
		entitiesInView.push(...drawablesUnboundable);

		return entitiesInView;
	}

	drawEntitiesInView_1_FindEntitiesInView_WithoutTracker
	(
		place: Place, collisionHelper: CollisionHelper, entitiesInView: Entity[]
	): Entity[]
	{
		entitiesInView.length = 0;

		var placeEntitiesDrawable = place.drawables();

		for (var i = 0; i < placeEntitiesDrawable.length; i++)
		{
			var entity = placeEntitiesDrawable[i];
			var drawable = entity.drawable();
			if (drawable.isVisible)
			{
				var entityPos = entity.locatable().loc.pos;
				this._posSaved.overwriteWith(entityPos);

				this.coordsTransformWorldToView(entityPos);

				var isEntityInView = false;
				var boundable = entity.boundable();
				if (boundable == null) // todo
				{
					isEntityInView = true;
				}
				else
				{
					var entityCollider = boundable.bounds;
					isEntityInView = collisionHelper.doCollidersCollide
					(
						entityCollider, this.viewCollider
					);
				}

				if (isEntityInView)
				{
					entitiesInView.push(entity);
				}

				entityPos.overwriteWith(this._posSaved);
			}
		}

		return entitiesInView;
	}

	drawEntitiesInView_2_Draw
	(
		uwpe: UniverseWorldPlaceEntities, display: Display,
		entitiesInView: Entity[]
	): void
	{
		this.entitiesInViewSort(entitiesInView);

		for (var i = 0; i < entitiesInView.length; i++)
		{
			var entity = entitiesInView[i];
			uwpe.entity = entity;

			var visual = entity.drawable().visual;

			var entityPos = entity.locatable().loc.pos;

			this._posSaved.overwriteWith(entityPos);

			this.coordsTransformWorldToView(entityPos);

			visual.draw(uwpe, display);

			entityPos.overwriteWith(this._posSaved);
		}
	}

	entitiesInViewSort(entitiesToSort: Entity[]): Entity[]
	{
		var entitiesSorted = null;

		if (this._entitiesInViewSort == null)
		{
			entitiesSorted = entitiesToSort;
		}
		else
		{
			entitiesSorted = this._entitiesInViewSort(entitiesToSort);
		}

		return entitiesSorted;
	}

	static entitiesSortByRenderingOrderThenZThenY
	(
		entitiesToSort: Entity[]
	): Entity[]
	{
		entitiesToSort.sort
		(
			(a, b) =>
			{
				var aRenderingOrder = a.drawable().renderingOrder;
				var bRenderingOrder = b.drawable().renderingOrder;

				if (aRenderingOrder != bRenderingOrder)
				{
					returnValue = bRenderingOrder - aRenderingOrder;
				}
				else
				{
					var aPos = a.locatable().loc.pos;
					var bPos = b.locatable().loc.pos;
					var returnValue;
					if (aPos.z != bPos.z)
					{
						returnValue = bPos.z - aPos.z;
					}
					else
					{
						returnValue = aPos.y - bPos.y;
					}
				}

				return returnValue;
			}
		);

		return entitiesToSort;
	}

	toEntity(): Entity
	{
		return new Entity
		(
			Camera.name,
			[
				this,
				new Constrainable([]),
				new Locatable(this.loc),
			]
		);
	}

	// Clonable.
	clone(): Camera { throw new Error("Not yet implemented."); }
	overwriteWith(other: Camera): Camera { throw new Error("Not yet implemented."); }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.  Rendering is done in Place.draw().
	}

	// Equatable

	equals(other: Camera): boolean { return false; } // todo

}

}
