
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_RotateLeft implements Transform<Transform_RotateLeft>
{
	quarterTurnsToRotate: number;

	constructor(quarterTurnsToRotate: number)
	{
		this.quarterTurnsToRotate = quarterTurnsToRotate;
	}

	static fromQuarterTurnsToRotate(quarterTurnsToRotate: number): Transform_RotateLeft
	{
		return new Transform_RotateLeft(quarterTurnsToRotate);
	}

	// Clonable.

	clone(): Transform_RotateLeft
	{
		return new Transform_RotateLeft(this.quarterTurnsToRotate);
	}

	overwriteWith(other: Transform_RotateLeft): Transform_RotateLeft
	{
		this.quarterTurnsToRotate = other.quarterTurnsToRotate;
		return this;
	}

	// Transform.

	transform(transformable: TransformableBase): TransformableBase
	{
		return transformable.transform(this);
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		for (var i = 0; i < this.quarterTurnsToRotate; i++)
		{
			var temp = coordsToTransform.x;
			coordsToTransform.x = coordsToTransform.y;
			coordsToTransform.y = 0 - temp;
		}

		return coordsToTransform;
	}
}

}
