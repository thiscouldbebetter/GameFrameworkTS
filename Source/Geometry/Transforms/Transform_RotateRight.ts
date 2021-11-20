
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_RotateRight implements Transform<Transform_RotateRight>
{
	quarterTurnsToRotate: number;

	constructor(quarterTurnsToRotate: number)
	{
		this.quarterTurnsToRotate = quarterTurnsToRotate;
	}

	clone(): Transform_RotateRight
	{
		return new Transform_RotateRight(this.quarterTurnsToRotate);
	}

	overwriteWith(other: Transform_RotateRight): Transform_RotateRight
	{
		this.quarterTurnsToRotate = other.quarterTurnsToRotate;
		return this;
	}

	transform(transformable: TransformableBase): TransformableBase
	{
		return transformable.transform(this);
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		for (var i = 0; i < this.quarterTurnsToRotate; i++)
		{
			var temp = coordsToTransform.x;
			coordsToTransform.x = 0 - coordsToTransform.y;
			coordsToTransform.y = temp;
		}

		return coordsToTransform;
	}
}

}
