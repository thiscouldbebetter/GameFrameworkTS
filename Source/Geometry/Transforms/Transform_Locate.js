
function Transform_Locate(loc)
{
	this.loc = loc;

	this.transformOrient = new Transform_Orient(loc.orientation);
	this.transformTranslate = new Transform_Translate(loc.pos);
}

{
	Transform_Locate.prototype.applyToCoords = function(coordsToTransform)
	{
		this.transformOrient.applyToCoords(coordsToTransform);
		this.transformTranslate.applyToCoords(coordsToTransform);
		return coordsToTransform;
	}
}
