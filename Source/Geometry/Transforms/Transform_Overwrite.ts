
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Overwrite implements Transform<Transform_Overwrite>
{
	transformableToOverwriteWith: TransformableBase;

	constructor(transformableToOverwriteWith: TransformableBase)
	{
		this.transformableToOverwriteWith = transformableToOverwriteWith;
	}

	clone(): Transform_Overwrite
	{
		return this; // todo
	}

	overwriteWith(other: Transform_Overwrite): Transform_Overwrite
	{
		return this; // todo
	}

	transform(transformable: TransformableBase): TransformableBase
	{
		transformable.overwriteWith(this.transformableToOverwriteWith);
		return transformable;
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		return coordsToTransform;
	}
}

}
