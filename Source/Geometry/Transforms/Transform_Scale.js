
function Transform_Scale(scaleFactors)
{
	this.scaleFactors = scaleFactors;
}

{
	Transform_Scale.fromScalar = function(scalar)
	{
		return new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(scalar));
	};

	Transform_Scale.prototype.transformCoords = function(coordsToTransform)
	{
		return coordsToTransform.multiply(this.scaleFactors);
	};
}
