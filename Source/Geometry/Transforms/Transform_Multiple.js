
function Transform_Multiple(transforms)
{
	this.transforms = transforms;
}

{
	Transform_Multiple.prototype.applyToCoords = function(coordsToTransform)
	{
		for (var i = 0; i < this.transforms.length; i++)
		{
			var transform = this.transforms[i];
			transform.applyToCoords(coordsToTransform);
		}
		return coordsToTransform;
	}
}
