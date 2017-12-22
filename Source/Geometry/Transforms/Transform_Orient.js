
function Transform_Orient(orientation)
{
	this.orientation = orientation;
}

{
	Transform_Orient.prototype.transformCoords = function(coordsToTransform)
	{
		coordsToTransform.overwriteWithDimensions
		(
			this.orientation.forward.dotProduct(coordsToTransform),
			this.orientation.right.dotProduct(coordsToTransform),
			this.orientation.down.dotProduct(coordsToTransform)
		);
		return coordsToTransform;
	}
}
