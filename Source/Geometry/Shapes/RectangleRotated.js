
function RectangleRotated(bounds, angleInTurns)
{
	this.bounds = bounds;
	this.angleInTurns = angleInTurns;
}
{
	RectangleRotated.prototype.surfaceNormalNearPos = function(posToCheck)
	{
		var returnValue = new Coords();

		var plane = new Plane(new Coords(), 0);
		var polar = new Polar(0, 1);
		var bounds = this.bounds;
		var center = bounds.center;
		var sizeHalf = bounds.sizeHalf;
		var displacementToSurface = new Coords();
		var distanceMinSoFar = Number.POSITIVE_INFINITY;

		for (var d = 0; d < 2; d++)
		{
			polar.azimuthInTurns = this.angleInTurns + (d * .25);
			var dimensionHalf = sizeHalf.dimension(d);

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
					returnValue.overwriteWith(plane.normal);
				}

				polar.azimuthInTurns += .5;
				polar.azimuthInTurns.wrapToRangeZeroOne();
			}
		}

		return returnValue;
	};

	// cloneable

	RectangleRotated.prototype.clone = function()
	{
		return new RectangleRotated(this.bounds.clone(), this.angleInTurns);
	}

	RectangleRotated.prototype.overwriteWith = function(other)
	{
		this.bounds.overwriteWith(other.bounds);
		this.angleInTurns = other.angleInTurns;
		return this;
	}

	// transformable

	RectangleRotated.prototype.coordsGroupToTranslate = function()
	{
		return [ this.bounds.center ];
	}
}
