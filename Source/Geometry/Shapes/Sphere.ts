
namespace ThisCouldBeBetter.GameFramework
{

export class Sphere extends ShapeBase
{
	center: Coords;
	pointOnSurface: Coords;

	private _radius: number;

	private _displacement: Coords;
	private _pointRandom: Coords;

	constructor(center: Coords, pointOnSurface: Coords)
	{
		super();

		this.center = center;
		this.pointOnSurface = pointOnSurface;

		// Helper variables.
		this._displacement = Coords.create();
		this._pointRandom = Coords.create();
	}

	static default(): Sphere
	{
		return new Sphere(Coords.create(), Coords.fromXYZ(1, 0, 0) );
	}

	static fromCenterAndPointOnSurface
	(
		center: Coords, pointOnSurface: Coords
	): Sphere
	{
		return new Sphere(center, pointOnSurface);
	}

	static fromCenterAndRadius(center: Coords, radius: number): Sphere
	{
		return new Sphere(center, Coords.fromXYZ(radius, 0, 0).add(center) );
	}

	static fromRadius(radius: number): Sphere
	{
		return new Sphere(Coords.zeroes(), Coords.fromXYZ(radius, 0, 0) );
	}

	static fromRadiusAndCenter(radius: number, center: Coords): Sphere
	{
		return Sphere.fromCenterAndRadius(center, radius);
	}

	cachedValuesClear(): Sphere
	{
		this._radius = null;
		return this;
	}

	containsOther(other: Sphere): boolean
	{
		var displacementOfOther =
			this._displacement
				.overwriteWith(other.center)
				.subtract(this.center);
		var distanceOfOther = displacementOfOther.magnitude();
		var returnValue =
			(distanceOfOther + other.radius() <= this.radius() );
		return returnValue;
	}

	containsPoint(pointToCheck: Coords): boolean
	{
		var displacement = 
			this._displacement
				.overwriteWith(pointToCheck)
				.subtract(this.center);
		var distanceFromCenter = displacement.magnitude();
		var radius = this.radius();
		var containsPoint = (distanceFromCenter < radius);
		return containsPoint;
	}

	pointRandom(randomizer: Randomizer): Coords
	{
		// todo
		// This implementation favors points near the center.

		var polar = Polar.fromRadius(this.radius() );

		var returnValue =
			polar
				.random(null)
				.toCoords(this._pointRandom)
				.add(this.center);

		return returnValue;
	}

	radius(): number
	{
		if (this._radius == null)
		{
			this._radius =
				this._displacement
					.overwriteWith(this.pointOnSurface)
					.subtract(this.center)
					.magnitude();
		}

		return this._radius;
	}

	// Clonable.

	clone(): Sphere
	{
		return new Sphere(this.center.clone(), this.pointOnSurface.clone() );
	}

	overwriteWith(other: Sphere): Sphere
	{
		this.center.overwriteWith(other.center);
		this.pointOnSurface.overwriteWith(other.pointOnSurface);
		return this;
	}

	// Equatable.

	equals(other: Sphere): boolean
	{
		return (this.center.equals(other.center) && this.radius == other.radius);
	}

	// ShapeBase.

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		return normalOut.overwriteWith
		(
			posToCheck
		).subtract
		(
			this.center
		).normalize();
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		return surfacePointOut.overwriteWith(posToCheck); // todo
	}

	toBoxAxisAligned(boxOut: BoxAxisAligned): BoxAxisAligned
	{
		if (boxOut == null)
		{
			boxOut = BoxAxisAligned.create();
		}
		var diameter = this.radius() * 2;
		boxOut.size.overwriteWithDimensions(diameter, diameter, diameter);
		return boxOut;
	}

	// Transformable.

	transform(transformToApply: TransformBase): Sphere
	{
		transformToApply.transformCoords(this.center);
		transformToApply.transformCoords(this.pointOnSurface);
		this.cachedValuesClear();
		return this;
	}
}

}
