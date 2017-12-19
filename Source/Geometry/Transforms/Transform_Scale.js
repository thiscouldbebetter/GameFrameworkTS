
function Transform_Scale(scaleFactors)
{
	this.scaleFactors = scaleFactors;
}

{
	Transform_Scale.prototype.applyToCoords = function(coordsToTransform)
	{
		return coordsToTransform.multiply(this.scaleFactors);
	}
}
