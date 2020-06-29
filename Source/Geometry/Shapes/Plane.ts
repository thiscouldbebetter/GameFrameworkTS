
class Plane
{
	constructor(normal, distanceFromOrigin)
	{
		this.normal = normal;
		this.distanceFromOrigin = distanceFromOrigin;

		this._displacementFromPoint0To2 = new Coords();
	}

	distanceToPointAlongNormal(point)
	{
		return point.dotProduct
		(
			this.normal
		) - this.distanceFromOrigin;
	};

	equals(other)
	{
		return (this.normal.equals(other.normal) && this.distanceFromOrigin == other.distanceFromOrigin);
	};

	fromPoints(point0, point1, point2)
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
	};

	pointClosestToOrigin(point)
	{
		return point.overwriteWith(this.normal).multiplyScalar(this.distanceFromOrigin);
	};
}
