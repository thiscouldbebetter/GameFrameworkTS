
class Transform_Multiple implements Transform
{
	transforms: Transform[];

	constructor(transforms: Transform[])
	{
		this.transforms = transforms;
	}

	overwriteWith(other: Transform)
	{
		return this; // todo
	}

	transform(transformable: Transformable): Transformable
	{
		for (var i = 0; i < this.transforms.length; i++)
		{
			var transform = this.transforms[i];
			transform.transform(transformable);
		}
		return transformable;
	};

	transformCoords(coordsToTransform: Coords): Coords
	{
		for (var i = 0; i < this.transforms.length; i++)
		{
			var transform = this.transforms[i];
			transform.transformCoords(coordsToTransform);
		}
		return coordsToTransform;
	};
}
