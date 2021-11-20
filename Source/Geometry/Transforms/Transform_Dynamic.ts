
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Dynamic implements Transform<Transform_Dynamic>
{
	transformTransformable: (t: TransformableBase) => TransformableBase;

	constructor
	(
		transformTransformable: (t: TransformableBase) => TransformableBase
	)
	{
		this.transformTransformable = transformTransformable;
	}

	// Clonable.

	clone(): Transform_Dynamic { return this; } // todo

	overwriteWith(other: Transform_Dynamic): Transform_Dynamic
	{
		return this;
	}

	// TransformBase.

	transform(transformable: TransformableBase): TransformableBase
	{
		return this.transformTransformable(transformable);
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		return coordsToTransform; // todo
	}
}

}
