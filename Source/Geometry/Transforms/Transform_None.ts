
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_None implements Transform
{
	constructor()
	{}

	overwriteWith(other: Transform)
	{
		return this;
	}

	transform(transformable: Transformable): Transformable
	{
		return transformable;
	}

	transformCoords(coordsToTransform: Coords)
	{
		return coordsToTransform;
	}
}

}
