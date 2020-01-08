
function Transform_Orient(orientation)
{
	this.orientation = orientation;
}

{
	Transform_Orient.prototype.transform = function(transformable)
	{
		return transformable.transform(this);
	};

	Transform_Orient.prototype.transformCoords = function(coordsToTransform)
	{
		// todo
		// Compare to Transform_OrientRDF.transformCoords().
		// Should this be doing the same thing?

		coordsToTransform.overwriteWithDimensions
		(
			this.orientation.forward.dotProduct(coordsToTransform),
			this.orientation.right.dotProduct(coordsToTransform),
			this.orientation.down.dotProduct(coordsToTransform)
		);
		return coordsToTransform;
	};
}
