
namespace ThisCouldBeBetter.GameFramework
{

export class Plane implements ShapeBase
{
	normal: Coords;
	distanceFromOrigin: number;

	_displacementFromPoint0To2: Coords;

	constructor(normal: Coords, distanceFromOrigin: number)
	{
		this.normal = normal;
		this.distanceFromOrigin = distanceFromOrigin;

		this._displacementFromPoint0To2 = Coords.create();
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

	pointOnPlaneNearestPos(posToCheck: Coords): Coords
	{
		var distanceToPoint = this.distanceToPointAlongNormal(posToCheck);
		return this.normal.clone().multiplyScalar(distanceToPoint).invert().add(posToCheck);
	}

	// Clonable.

	clone(): Plane
	{
		return new Plane(this.normal.clone(), this.distanceFromOrigin);
	}

	overwriteWith(other: Plane): Plane
	{
		this.normal.overwriteWith(other.normal);
		this.distanceFromOrigin = other.distanceFromOrigin;
		return this;
	}

	// ShapeBase.

	locate(loc: Disposition): ShapeBase { throw new Error("Not implemented!"); }

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords { throw new Error("Not implemented!"); }

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords { throw new Error("Not implemented!"); }

	toBox(boxOut: Box): Box { throw new Error("Not implemented!"); }

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		throw new Error("Not implemented!");
	}
}

}
