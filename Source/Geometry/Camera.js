
function Camera(viewSize, focalLength, loc)
{
	this.viewSize = viewSize;
	this.focalLength = focalLength;
	this.loc = loc;

	this.viewSizeHalf = this.viewSize.clone().half();
}

{
	Camera.prototype.coordsTransformWorldToView = function(worldCoords)
	{
		var cameraPos = this.loc.pos;
		var cameraOrientation = this.loc.orientation;

		var viewCoords = worldCoords.subtract(cameraPos).overwriteWithDimensions
		(
			worldCoords.dotProduct(cameraOrientation.right),
			worldCoords.dotProduct(cameraOrientation.down),
			worldCoords.dotProduct(cameraOrientation.forward)
		)

		if (this.focalLength != null)
		{
			var viewCoordsZ = viewCoords.z;
			viewCoords.multiplyScalar(this.focalLength).divideScalar(viewCoordsZ);
			viewCoords.z = viewCoordsZ;
		}

		viewCoords.add(this.viewSizeHalf);

		return viewCoords;
	}
}