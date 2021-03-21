
namespace ThisCouldBeBetter.GameFramework
{

export class BoxRotated implements ShapeBase
{
	box: Box;
	angleInTurns: number;

	constructor(box: Box, angleInTurns: number)
	{
		this.box = box;
		this.angleInTurns = angleInTurns;
	}

	sphereSwept()
	{
		return new Sphere(this.box.center, this.box.sizeHalf().magnitude());
	}

	// ShapeBase.

	locate(loc: Disposition): ShapeBase
	{
		return ShapeHelper.Instance().applyLocationToShapeDefault(loc, this);
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords)
	{
		// todo - Adapt or call Box.normalAtPos() instead.

		var plane = new Plane(Coords.create(), 0);
		var polar = new Polar(0, 1, 0);
		var box = this.box;
		var center = box.center;
		var sizeHalf = box.sizeHalf();
		var displacementToSurface = Coords.create();
		var distanceMinSoFar = Number.POSITIVE_INFINITY;

		for (var d = 0; d < 2; d++)
		{
			polar.azimuthInTurns = this.angleInTurns + (d * .25);
			var dimensionHalf = sizeHalf.dimensionGet(d);

			for (var m = 0; m < 2; m++)
			{
				var directionToSurface = polar.toCoords(plane.normal);
				displacementToSurface.overwriteWith
				(
					directionToSurface
				).multiplyScalar
				(
					dimensionHalf
				);
				var pointOnSurface = displacementToSurface.add(center);
				plane.distanceFromOrigin = pointOnSurface.dotProduct(plane.normal);

				var distanceOfPosToCheckFromPlane = Math.abs
				(
					plane.distanceToPointAlongNormal(posToCheck)
				);
				if (distanceOfPosToCheckFromPlane < distanceMinSoFar)
				{
					distanceMinSoFar = distanceOfPosToCheckFromPlane;
					normalOut.overwriteWith(plane.normal);
				}

				polar.azimuthInTurns += .5;
				polar.azimuthInTurns = NumberHelper.wrapToRangeZeroOne(polar.azimuthInTurns);
			}
		}

		return normalOut;
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords)
	{
		return surfacePointOut.overwriteWith(posToCheck); // todo
	}

	// cloneable

	clone()
	{
		return new BoxRotated(this.box.clone(), this.angleInTurns);
	}

	overwriteWith(other: BoxRotated)
	{
		this.box.overwriteWith(other.box);
		this.angleInTurns = other.angleInTurns;
		return this;
	}

	// transformable

	coordsGroupToTranslate()
	{
		return [ this.box.center ];
	}
}

}
