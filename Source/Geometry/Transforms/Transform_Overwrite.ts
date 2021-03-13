
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Overwrite implements Transform
{
	transformableToOverwriteWith: Transformable;

	constructor(transformableToOverwriteWith: Transformable)
	{
		this.transformableToOverwriteWith = transformableToOverwriteWith;
	}

	overwriteWith(other: Transform): Transform
	{
		return this; // todo
	}

	transform(transformable: Transformable): Transformable
	{
		// todo
		//transformable.overwriteWith(this.transformableToOverwriteWith);
		return this;
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		return coordsToTransform;
	}
}

}
