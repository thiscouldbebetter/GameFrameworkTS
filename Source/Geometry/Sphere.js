
function Sphere(center, radius)
{
	this.center = center;
	this.radius = radius;
}
{
	Sphere.prototype.containsOther = function(other)
	{
		var displacementOfOther = other.center.clone().subtract(this.center);
		var distanceOfOther = displacementOfOther.magnitude();
		var returnValue = (distanceOfOther + other.radius <= this.radius);
		return returnValue;
	}
}
