
function Hemispace(plane)
{
	this.plane = plane;
}
{
	Hemispace.prototype.containsPoint = function(pointToCheck)
	{
		var distanceOfPointAbovePlane = 
			pointToCheck.dotProduct(this.plane.normal) 
			- this.plane.distanceFromOrigin;
		var returnValue = (distanceOfPointAbovePlane > 0);
		return returnValue;
	};
}
