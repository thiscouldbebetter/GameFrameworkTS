
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_None implements Transform<Transform_None>
{
	constructor()
	{}

	clone(): Transform_None { return this; } // todo

	overwriteWith(other: Transform_None): Transform_None
	{
		return this;
	}

	transform(transformable: TransformableBase): TransformableBase
	{
		return transformable;
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		return coordsToTransform;
	}
}

}
