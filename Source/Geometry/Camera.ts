
namespace ThisCouldBeBetter.GameFramework
{

export class Camera implements EntityProperty<Camera>
{
	viewSize: Coords;
	focalLength: number;
	loc: Disposition;
	_entitiesInViewSort: (e: Entity[]) => Entity[];

	viewSizeHalf: Coords;
	viewCollider: BoxAxisAligned;
	entitiesInView: Entity[];

	_clipPlanes: Plane[];
	_displayToRestore: Display;
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
		this.viewCollider =
			BoxAxisAligned.fromSize(viewColliderSize);
		this.entitiesInView = new Array<Entity>();

		this._displayToRestore = null;
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

	static fromViewSizeAndDisposition
	(
		viewSize: Coords,
		disp: Disposition
	): Camera
	{
		return new Camera
		(
			viewSize,
			null, // focalLength
			disp,
			null // entitiesInViewSort
		);
	}

	static entityFromPlace(place: Place): Entity
	{
		return place.entitiesByPropertyName(Camera.name)[0];
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
				Plane.create(),
				Plane.create(),
				Plane.create(),
				Plane.create(),
			];
		}

		var cameraLoc = this.loc;
		var cameraOrientation = cameraLoc.orientation;

		var cameraPos = cameraLoc.pos;

		var centerOfViewPlane =
			cameraPos
			.clone()
			.add
			(
				cameraOrientation.forward
					.clone()
					.multiplyScalar(this.focalLength)
			);

		var cornerOffsetRight =
			cameraOrientation.right
				.clone()
				.multiplyScalar(this.viewSizeHalf.x);

		var cornerOffsetDown =
			cameraOrientation.down
				.clone()
				.multiplyScalar(this.viewSizeHalf.y);

		var cameraViewCorners =
		[
			centerOfViewPlane
				.clone()
				.add(cornerOffsetRight)
				.add(cornerOffsetDown),

			centerOfViewPlane
				.clone()
				.subtract(cornerOffsetRight)
				.add(cornerOffsetDown),

			centerOfViewPlane
				.clone()
				.subtract(cornerOffsetRight)
				.subtract(cornerOffsetDown),

			centerOfViewPlane
				.clone()
				.add(cornerOffsetRight)
				.subtract(cornerOffsetDown),

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

	constraintContainInBoxForPlaceSizeAndWrapped
	(
		placeSize: Coords,
		placeIsWrappedHorizontally: boolean
	): Constraint_ContainInBox
	{
		var viewSizeHalf = this.viewSizeHalf;

		var min =
			placeIsWrappedHorizontally
			? Coords.fromXY(0, viewSizeHalf.y) // todo
			: viewSizeHalf.clone();
		var max =
			placeIsWrappedHorizontally
			? Coords.fromXY(placeSize.x, viewSizeHalf.y)
			: placeSize.clone().subtract(viewSizeHalf);

		var box = BoxAxisAligned.fromMinAndMax(min, max);

		var constraintContainInBox =
			Constraint_ContainInBox.fromBox(box);

		return constraintContainInBox;
	}

	constraintContainInBoxForPlaceSizeNotWrapped
	(
		placeSize: Coords
	): Constraint_ContainInBox
	{
		return this.constraintContainInBoxForPlaceSizeAndWrapped(placeSize, false);
	}

	constraintContainInBoxForPlaceSizeWrapped
	(
		placeSize: Coords
	): Constraint_ContainInBox
	{
		return this.constraintContainInBoxForPlaceSizeAndWrapped(placeSize, true);
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
				viewCoords
					.multiplyScalar(this.focalLength)
					.divideScalar(viewCoordsZ);
				viewCoords.z = viewCoordsZ;
			}
		}

		viewCoords.add(this.viewSizeHalf);

		return viewCoords;
	}

	drawEntitiesInView
	(
		uwpe: UniverseWorldPlaceEntities,
		cameraEntity: Entity,
		display: Display
	): void
	{
		var universe = uwpe.universe;

		this.loc.pos.round(); // hack - To prevent lines between map tiles.

		this.entitiesInView = this.drawEntitiesInView_1_FindEntitiesInView
		(
			uwpe, cameraEntity, universe.collisionHelper, this.entitiesInView
		);

		this._displayToRestore = universe.display;

		universe.display = display;

		this.drawEntitiesInView_2_Draw
		(
			uwpe, this.entitiesInView
		);

		universe.display = this._displayToRestore;
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
		cameraCollidable.entitiesAlreadyCollidedWithClear();
		var collisions =
			collisionTracker.entityCollidableAddAndFindCollisions
			(
				uwpe,
				cameraEntity,
				collisionHelper,
				[] // collisions
			);
		var entitiesCollidedWith =
			collisions.map(x => x.entitiesColliding[1]);
		var entitiesInView =
			entitiesCollidedWith
				.filter(x => Drawable.of(x) != null);
		entitiesInView =
			entitiesInView
				.filter( (x, i) => entitiesInView.indexOf(x) == i); // Distinct.

		// Now draw the Drawables that aren't also Collidables.

		var drawablesAll = Drawable.entitiesFromPlace(place);
		var drawablesUncollidable =
			drawablesAll.filter(x => Collidable.of(x) == null);
		entitiesInView.push(...drawablesUncollidable);

		return entitiesInView;
	}

	drawEntitiesInView_2_Draw
	(
		uwpe: UniverseWorldPlaceEntities,
		entitiesInView: Entity[]
	): void
	{
		this.entitiesInViewSort(entitiesInView);

		for (var i = 0; i < entitiesInView.length; i++)
		{
			var entity = entitiesInView[i];
			uwpe.entitySet(entity);

			var drawable = Drawable.of(entity);

			var entityPos = Locatable.of(entity).loc.pos;

			this._posSaved.overwriteWith(entityPos);

			this.coordsTransformWorldToView(entityPos);

			drawable.draw(uwpe);

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

	toEntityFollowingEntityWithName
	(
		targetEntityName: string
	): Entity
	{
		var boundable =
			Boundable.fromBounds(this.viewCollider);

		var collidable =
			Collidable
				.fromCollider(this.viewCollider)
				.canCollideAgainWithoutSeparatingSet(true);

		var constrainable =
			this.toEntityFollowingEntityWithName_Constrainable(targetEntityName);

		var locatable = Locatable.fromDisp(this.loc);

		var movable = Movable.default();

		var entity = Entity.fromNameAndProperties
		(
			Camera.name,
			[
				boundable,
				this,
				collidable,
				constrainable,
				locatable,
				movable
			]
		);

		return entity;
	}

	toEntityFollowingEntityWithName_Constrainable
	(
		targetEntityName: string
	): Constrainable
	{
		var displacementToTargetEntity =
			this.loc.orientation.forward.clone().invert();

		var constraintMultiple = Constraint_Multiple.fromChildren
		([
			Constraint_AttachToEntityWithName.
				fromTargetEntityName(targetEntityName),

			Constraint_Transform.fromTransform
			(
				Transform_Translate.fromDisplacement
				(
					displacementToTargetEntity
				)
			),

			Constraint_OrientTowardEntityWithName
				.fromTargetEntityName(targetEntityName),
		]);

		var constrainable =
			Constrainable.fromConstraint(constraintMultiple);

		return constrainable;
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
