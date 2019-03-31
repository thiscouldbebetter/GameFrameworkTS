
function Plane(normal, distanceFromOrigin)
{
	this.normal = normal;
	this.distanceFromOrigin = distanceFromOrigin;

	this.displacementFromPoint0To2 = new Coords();
}
{
	Plane.prototype.distanceToPointAlongNormal = function(point)
	{
		return point.dotProduct
		(
			this.normal
		) - this.distanceFromOrigin;
	};	
	
	Plane.prototype.equals = function(other)
	{
		return (this.normal.equals(other.normal) && this.distanceFromOrigin == other.distanceFromOrigin);
	};

	Plane.prototype.fromPoints = function(point0, point1, point2)
	{
		this.normal.overwriteWith
		(
			point1
		).subtract
		(
			point0
		).crossProduct
		(
			this.displacementFromPoint0To2.overwriteWith
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
	
	Plane.prototype.pointClosestToOrigin = function(point)
	{
		return point.overwriteWith(this.normal).multiplyScalar(this.distanceFromOrigin);
	}
}
