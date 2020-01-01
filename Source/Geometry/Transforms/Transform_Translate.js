
function Transform_Translate(displacement)
{
	this.displacement = displacement;
}

{
	Transform_Translate.prototype.displacementSet = function(value)
	{
		this.displacement.overwriteWith(value);
		return this;
	};

	// transform

	Transform_Translate.prototype.transform = function(transformable)
	{
		return transformable.transform(this);
	};

	Transform_Translate.prototype.transformCoords = function(coordsToTransform)
	{
		return coordsToTransform.add(this.displacement);
	};
}
