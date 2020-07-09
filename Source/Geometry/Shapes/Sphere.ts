
class Sphere
{
	center: Coords;
	radius: number;

	_displacement: Coords;

	constructor(center: Coords, radius: number)
	{
		this.center = center;
		this.radius = radius;

		// Helper variables.
		this._displacement = new Coords(0, 0, 0);
	}

	containsOther(other: Sphere)
	{
		var displacementOfOther =
			this._displacement.overwriteWith(other.center).subtract(this.center);
		var distanceOfOther = displacementOfOther.magnitude();
		var returnValue = (distanceOfOther + other.radius <= this.radius);
		return returnValue;
	};

	pointRandom()
	{
		return new Polar(0, this.radius, 0).random(null).toCoords(new Coords(0, 0, 0)).add(this.center);
	};

	// cloneable

	clone()
	{
		return new Sphere(this.center.clone(), this.radius);
	};

	overwriteWith(other: Sphere)
	{
		this.center.overwriteWith(other.center);
		this.radius = other.radius;
		return this;
	};

	// transformable

	coordsGroupToTranslate()
	{
		return [ this.center ];
	};
}
