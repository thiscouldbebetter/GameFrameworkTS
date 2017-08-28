
function Plane(normal, distanceFromOrigin)
{
	this.normal = normal;
	this.distanceFromOrigin = distanceFromOrigin;
}
{
	Plane.fromPoints = function(pointsOnPlane)
	{
		var point0 = pointsOnPlane[0];
		var point1 = pointsOnPlane[1];
		var point2 = pointsOnPlane[2];
		
		var displacementFromPoint0To1 = point1.clone().subtract(point0);
		var displacementFromPoint0To2 = point2.clone().subtract(point0);
		
		var normal = displacementFromPoint0To1.crossProduct
		(
			displacementFromPoint0To2
		).normalize();
		
		var distanceFromOrigin = point0.dotProduct(normal);
		
		var returnValue = new Plane(normal, distanceFromOrigin);
		
		return returnValue;
	}
}