

function Transform_Translate(displacement)
{
	this.displacement = displacement;
}

{
	Transform_Translate.prototype.applyToCoords = function(coordsToTransform)
	{
		return coordsToTransform.add(this.displacement);
	}
}
