
function Transform_OrientForCamera(orientation)
{
	this.orientation = orientation;
}

{
	Transform_OrientForCamera.prototype.applyToCoords = function(coordsToTransform)
	{
		coordsToTransform.overwriteWithDimensions
		(
			this.orientation.right.dotProduct(coordsToTransform),
			this.orientation.down.dotProduct(coordsToTransform),
			this.orientation.forward.dotProduct(coordsToTransform)
		);
		return coordsToTransform;
	}
}
