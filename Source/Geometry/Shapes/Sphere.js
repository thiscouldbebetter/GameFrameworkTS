
function Sphere(center, radius)
{
	this.center = center;
	this.radius = radius;

	// Helper variables.
	this._displacement = new Coords();
}
{
	Sphere.prototype.containsOther = function(other)
	{
		var displacementOfOther =
			this._displacement.overwriteWith(other.center).subtract(this.center);
		var distanceOfOther = displacementOfOther.magnitude();
		var returnValue = (distanceOfOther + other.radius <= this.radius);
		return returnValue;
	};

	Sphere.prototype.pointRandom = function()
	{
		return new Polar(0, this.radius).random().toCoords(new Coords()).add(this.center);
	};

	// cloneable

	Sphere.prototype.clone = function()
	{
		return new Sphere(this.center.clone(), this.radius);
	};

	Sphere.prototype.overwriteWith = function(other)
	{
		this.center.overwriteWith(other.center);
		this.radius = other.radius;
		return this;
	};

	// transformable

	Sphere.prototype.coordsGroupToTranslate = function()
	{
		return [ this.center ];
	};
}
