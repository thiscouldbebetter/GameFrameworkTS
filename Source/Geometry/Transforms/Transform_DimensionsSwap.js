
function Transform_DimensionsSwap(dimensionIndices)
{
	this.dimensionIndices = dimensionIndices;
}

{
	Transform_DimensionsSwap.prototype.applyToCoords = function(coordsToTransform)
	{
		var dimensionIndex0 = this.dimensionIndices[0];
		var dimensionIndex1 = this.dimensionIndices[1];

		var dimension0 = coordsToTransform.dimension(dimensionIndex0);
		var dimension1 = coordsToTransform.dimension(dimensionIndex1);
		
		coordsToTransform.dimension(dimensionIndex0, dimension1);
		coordsToTransform.dimension(dimensionIndex1, dimension0);
		return coordsToTransform;
	}	
}
