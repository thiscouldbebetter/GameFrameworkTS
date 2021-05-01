
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
	}

	containsOther(other: Sphere)
	{
		var displacementOfOther =
			this._displacement.overwriteWith(other.center).subtract(this.center);
		var distanceOfOther = displacementOfOther.magnitude();
		var returnValue = (distanceOfOther + other.radius <= this.radius);
		return returnValue;
	}

	pointRandom()
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

	clone()
	{
		return new Sphere(this.center.clone(), this.radius);
	}

	overwriteWith(other: Sphere)
	{
		this.center.overwriteWith(other.center);
		this.radius = other.radius;
		return this;
	}

	// ShapeBase.

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

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords)
	{
		return surfacePointOut.overwriteWith(posToCheck); // todo
	}

	toBox(boxOut: Box): Box
	{
		var diameter = this.radius * 2;
		boxOut.size.overwriteWithDimensions(diameter, diameter, diameter);
		return boxOut;
	}

	// Transformable.

	coordsGroupToTranslate(): Coords[]
	{
		return this._centerAsArray;
	}

	transform(transformToApply: Transform): Transformable
	{
		throw("Not implemented!");
	}
}

}
