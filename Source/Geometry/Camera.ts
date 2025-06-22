
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

	static entityFromPlace(place: Place): Entity
	{
		return place.entitiesByPropertyName(Camera.name)[0];
	}

	static fromEntitiesInViewSort
	(
		entitiesInViewSort: (e: Entity[]) => Entity[]
	): Camera
	{
		return new Camera
		(
			Coords.fromXYZ(400, 300, 1000), // viewSize
			150, // focalLength
			Disposition.fromPosAndOri
			(
				Coords.fromXYZ(0, 0, -150),
				Orientation.Instances().ForwardZDownY.clone()
			),
			entitiesInViewSort
		);
	}

	static of(entity: Entity): Camera
	{
		return entity.propertyByName(Camera.name) as Camera;
	}

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

		this.loc.pos.round(); // hack - To prevent lines between map tiles.

		this.entitiesInView = this.drawEntitiesInView_1_FindEntitiesInView
		(
			uwpe, cameraEntity, universe.collisionHelper, this.entitiesInView
		);

		this.drawEntitiesInView_2_Draw
		(
			uwpe, display, this.entitiesInView
		);
	}

	drawEntitiesInView_1_FindEntitiesInView
	(
		uwpe: UniverseWorldPlaceEntities,
		cameraEntity: Entity,
		collisionHelper: CollisionHelper,
		entitiesInView: Entity[]
	): Entity[]
	{
		var place = uwpe.place;

		var collisionTracker = CollisionTrackerBase.fromPlace(uwpe);
		collisionTracker.entityReset(cameraEntity);

		var cameraCollidable = Collidable.of(cameraEntity);
		//cameraCollidable.isDisabled = false;
		cameraCollidable.entitiesAlreadyCollidedWithClear();
		var collisions = collisionTracker.entityCollidableAddAndFindCollisions
		(
			uwpe, cameraEntity, collisionHelper, new Array<Collision>()
		);
		var entitiesCollidedWith = collisions.map(x => x.entitiesColliding[1]);
		var entitiesInView = entitiesCollidedWith.filter(x => Drawable.of(x) != null);
		entitiesInView =
			entitiesInView.filter( (x, i) => entitiesInView.indexOf(x) == i); // Distinct.
		//cameraCollidable.isDisabled = true;

		// Now draw the unboundables.

		var drawablesAll = Drawable.entitiesFromPlace(place);
		var drawablesUnboundable = drawablesAll.filter(x => Boundable.of(x) == null);
		entitiesInView.push(...drawablesUnboundable);

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
			uwpe.entitySet(entity);

			var visual = Drawable.of(entity).visual;

			var entityPos = Locatable.of(entity).loc.pos;

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
				var aRenderingOrder = Drawable.of(a).renderingOrder;
				var bRenderingOrder = Drawable.of(b).renderingOrder;

				if (aRenderingOrder != bRenderingOrder)
				{
					returnValue = bRenderingOrder - aRenderingOrder;
				}
				else
				{
					var aPos = Locatable.of(a).loc.pos;
					var bPos = Locatable.of(b).loc.pos;
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
		/*

		// todo -
		// This isn't used to find entities in camera view,
		// but if it was it would need to include a Collidable property.

		return new Entity
		(
			Camera.name,
			[
				this,
				new Constrainable([]),
				new Locatable(this.loc),
			]
		);
		*/
		var cameraBoundable = new Boundable(this.viewCollider);
		var cameraCollidable =
			Collidable
				.fromCollider(this.viewCollider)
				.canCollideAgainWithoutSeparatingSet(true);

		var cameraConstrainable = new Constrainable
		([
			new Constraint_AttachToEntityWithName("Player"),
			//new Constraint_ContainInBox(cameraPosBox)
		]);

		var cameraEntity = new Entity
		(
			Camera.name,
			[
				this,
				cameraBoundable,
				cameraCollidable,
				cameraConstrainable,
				new Locatable(this.loc),
				Movable.default()
			]
		);

		return cameraEntity;
	}

	// Clonable.
	clone(): Camera { return this; }
	overwriteWith(other: Camera): Camera { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	propertyName(): string { return Camera.name; }

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.  Rendering is done in Place.draw().
	}

	// Equatable

	equals(other: Camera): boolean { return false; } // todo

}

}
