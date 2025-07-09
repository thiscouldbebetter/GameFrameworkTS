
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

	static create(): Plane
	{
		return new Plane(Coords.create(), 0);
	}

	static fromNormalAndDistanceFromOrigin
	(
		normal: Coords, distanceFromOrigin: number
	): Plane
	{
		return new Plane(normal, distanceFromOrigin);
	}

	distanceToPointAlongNormal(point: Coords)
	{
		return point.dotProduct
		(
			this.normal
		) - this.distanceFromOrigin;
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

	pointRandom(randomizer: Randomizer): Coords
	{
		return null; // todo
	}

	// Equatable

	equals(other: Plane): boolean
	{
		var returnValue =
		(
			this.normal.equals(other.normal)
			&& this.distanceFromOrigin == other.distanceFromOrigin
		);

		return returnValue;
	}

	// ShapeBase.

	collider(): ShapeBase { return null; }

	containsPoint(pointToCheck: Coords): boolean
	{
		throw new Error("Not yet implemented!");
	}

	locate(loc: Disposition): ShapeBase { throw new Error("Not implemented!"); }

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords { throw new Error("Not implemented!"); }

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords { throw new Error("Not implemented!"); }

	toBox(boxOut: Box): Box { throw new Error("Not implemented!"); }

	// Transformable.

	transform(transformToApply: TransformBase): Plane
	{
		throw new Error("Not implemented!");
	}
}

}
