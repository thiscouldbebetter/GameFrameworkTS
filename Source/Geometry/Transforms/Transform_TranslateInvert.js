
function Transform_TranslateInvert(displacement)
{
	this.displacement = displacement;
}

{
	Transform_TranslateInvert.prototype.transformCoords = function(coordsToTransform)
	{
		return coordsToTransform.subtract(this.displacement);
	}
}
