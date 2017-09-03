
function TransformOrient(orientation)
{
	this.orientation = orientation;
}

{
	TransformOrient.prototype.transformCoords = function(coordsToTransform)
	{
		coordsToTransform.overwriteWithDimensions
		(
			coordsToTransform.dotProduct(this.orientation.right),
			coordsToTransform.dotProduct(this.orientation.down),
			coordsToTransform.dotProduct(this.orientation.forward)
		);
	}
}
