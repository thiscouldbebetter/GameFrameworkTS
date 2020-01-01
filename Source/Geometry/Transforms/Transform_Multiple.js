
function Transform_Multiple(transforms)
{
	this.transforms = transforms;
}

{
	Transform_Multiple.prototype.transform = function(transformable)
	{
		for (var i = 0; i < this.transforms.length; i++)
		{
			var transform = this.transforms[i];
			transform.transform(transformable);
		}
		return transformable;
	};

	Transform_Multiple.prototype.transformCoords = function(coordsToTransform)
	{
		for (var i = 0; i < this.transforms.length; i++)
		{
			var transform = this.transforms[i];
			transform.transformCoords(coordsToTransform);
		}
		return coordsToTransform;
	};
}
