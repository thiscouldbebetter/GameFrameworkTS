
class Camera
{
	constructor(viewSize, focalLength, loc)
	{
		this.viewSize = viewSize;
		this.focalLength = focalLength;
		this.loc = loc;

		this.viewSizeHalf = this.viewSize.clone().clearZ().half();

		var viewColliderSize = this.viewSize.clone();
		viewColliderSize.z = Number.POSITIVE_INFINITY;
		this.viewCollider = new Box
		(
			this.loc.pos,
			viewColliderSize
		);
	}

	clipPlanes()
	{
		if (this._clipPlanes == null)
		{
			this._clipPlanes =
			[
				new Plane(new Coords(0, 0, 0), 0),
				new Plane(new Coords(0, 0, 0), 0),
				new Plane(new Coords(0, 0, 0), 0),
				new Plane(new Coords(0, 0, 0), 0),
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
	};

	coordsTransformViewToWorld(viewCoords, ignoreZ)
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
	};

	coordsTransformWorldToView(worldCoords)
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
	};
}
