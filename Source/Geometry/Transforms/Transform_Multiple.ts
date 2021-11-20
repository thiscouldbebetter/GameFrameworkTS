
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Multiple implements Transform<Transform_Multiple>
{
	transforms: TransformBase[];

	constructor(transforms: TransformBase[])
	{
		this.transforms = transforms;
	}

	clone(): Transform_Multiple
	{
		return new Transform_Multiple(this.transforms); // todo
	}

	overwriteWith(other: Transform_Multiple): Transform_Multiple
	{
		return this; // todo
	}

	transform(transformable: TransformableBase): TransformableBase
	{
		for (var i = 0; i < this.transforms.length; i++)
		{
			var transform = this.transforms[i];
			//transform.transform(transformable);
			transformable.transform(transform);
		}
		return transformable;
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		for (var i = 0; i < this.transforms.length; i++)
		{
			var transform = this.transforms[i];
			transform.transformCoords(coordsToTransform);
		}
		return coordsToTransform;
	}
}

}
