
class Sphere
{
	constructor(center, radius)
	{
		this.center = center;
		this.radius = radius;

		// Helper variables.
		this._displacement = new Coords();
	}

	containsOther(other)
	{
		var displacementOfOther =
			this._displacement.overwriteWith(other.center).subtract(this.center);
		var distanceOfOther = displacementOfOther.magnitude();
		var returnValue = (distanceOfOther + other.radius <= this.radius);
		return returnValue;
	};

	pointRandom()
	{
		return new Polar(0, this.radius).random().toCoords(new Coords()).add(this.center);
	};

	// cloneable

	clone()
	{
		return new Sphere(this.center.clone(), this.radius);
	};

	overwriteWith(other)
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
