
class Plane
{
	normal: Coords;
	distanceFromOrigin: number;

	_displacementFromPoint0To2: Coords;

	constructor(normal: Coords, distanceFromOrigin: number)
	{
		this.normal = normal;
		this.distanceFromOrigin = distanceFromOrigin;

		this._displacementFromPoint0To2 = new Coords(0, 0, 0);
	}

	distanceToPointAlongNormal(point: Coords)
	{
		return point.dotProduct
		(
			this.normal
		) - this.distanceFromOrigin;
	}

	equals(other: Plane)
	{
		return (this.normal.equals(other.normal) && this.distanceFromOrigin == other.distanceFromOrigin);
	}

	fromPoints(point0: Coords, point1: Coords, point2: Coords)
	{
		this.normal.overwriteWith
		(
			point1
		).subtract
		(
			point0
		).crossProduct
		(
			this._displacementFromPoint0To2.overwriteWith
			(
				point2
			).subtract
			(
				point0
			)
		).normalize();

		this.distanceFromOrigin = point0.dotProduct(this.normal);

		return this;
	}

	pointClosestToOrigin(point: Coords)
	{
		return point.overwriteWith(this.normal).multiplyScalar(this.distanceFromOrigin);
	}
}
