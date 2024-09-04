
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

	containsPoint(pointToCheck: Coords)
	{
		return (this._displacement.overwriteWith(pointToCheck).subtract(this.center).magnitude() < this.radius);
	}

	pointRandom(randomizer: Randomizer): Coords
	{
		return new Polar
		(
			0, this.radius, 0
		).random
		(
			null
		).toCoords
		(
			this._pointRandom
		).add
		(
			this.center
		);
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

	locate(loc: Disposition): ShapeBase
	{
		this.center.overwriteWith(loc.pos);
		return this;
	}

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
		throw new Error("Not implemented!");
	}
}

}
