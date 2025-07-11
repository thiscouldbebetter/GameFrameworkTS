
namespace ThisCouldBeBetter.GameFramework
{

export class Sphere implements ShapeBase
{
	center: Coords;
	radius: number;

	private _centerAsArray: Coords[];
	private _displacement: Coords;
	private _pointRandom: Coords;

	constructor(center: Coords, radius: number)
	{
		this.center = center;
		this.radius = radius;

		// Helper variables.
		this._centerAsArray = [ this.center ];
		this._displacement = Coords.create();
		this._pointRandom = Coords.create();
	}

	static default(): Sphere
	{
		return new Sphere(Coords.create(), 1);
	}

	static fromCenterAndRadius(center: Coords, radius: number): Sphere
	{
		return new Sphere(center, radius);
	}

	static fromRadius(radius: number): Sphere
	{
		return new Sphere(Coords.create(), radius);
	}

	static fromRadiusAndCenter(radius: number, center: Coords): Sphere
	{
		return new Sphere(center, radius);
	}

	containsOther(other: Sphere): boolean
	{
		var displacementOfOther =
			this._displacement.overwriteWith(other.center).subtract(this.center);
		var distanceOfOther = displacementOfOther.magnitude();
		var returnValue = (distanceOfOther + other.radius <= this.radius);
		return returnValue;
	}

	containsPoint(pointToCheck: Coords): boolean
	{
		var displacement = 
			this._displacement
				.overwriteWith(pointToCheck)
				.subtract(this.center);
		var distanceFromCenter = displacement.magnitude();
		var containsPoint = (distanceFromCenter < this.radius);
		return containsPoint;
	}

	pointRandom(randomizer: Randomizer): Coords
	{
		// todo
		// This implementation favors points near the center.

		var polar = Polar.fromRadius(this.radius);

		var returnValue =
			polar
				.random(null)
				.toCoords(this._pointRandom)
				.add(this.center);

		return returnValue;
	}

	// cloneable

	clone(): Sphere
	{
		return new Sphere(this.center.clone(), this.radius);
	}

	overwriteWith(other: Sphere): Sphere
	{
		this.center.overwriteWith(other.center);
		this.radius = other.radius;
		return this;
	}

	// Equatable.

	equals(other: Sphere): boolean
	{
		return (this.center.equals(other.center) && this.radius == other.radius);
	}

	// ShapeBase.

	collider(): ShapeBase { return null; }

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

	toBox(boxOut: Box): Box
	{
		if (boxOut == null)
		{
			boxOut = Box.create();
		}
		var diameter = this.radius * 2;
		boxOut.size.overwriteWithDimensions(diameter, diameter, diameter);
		return boxOut;
	}

	// Transformable.

	coordsGroupToTranslate(): Coords[]
	{
		return this._centerAsArray;
	}

	transform(transformToApply: TransformBase): Sphere
	{
		transformToApply.transformCoords(this.center);
		return this;
	}
}

}
