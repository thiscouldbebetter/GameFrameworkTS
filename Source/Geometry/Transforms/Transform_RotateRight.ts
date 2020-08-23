
class Transform_RotateRight implements Transform
{
	quarterTurnsToRotate: number;

	constructor(quarterTurnsToRotate: number)
	{
		this.quarterTurnsToRotate = quarterTurnsToRotate;
	}

	overwriteWith(other: Transform)
	{
		this.quarterTurnsToRotate = (other as Transform_RotateRight).quarterTurnsToRotate;
		return this;
	}

	transform(transformable: Transformable): Transformable
	{
		return transformable.transform(this);
	}

	transformCoords(coordsToTransform: Coords)
	{
		for (var i = 0; i < this.quarterTurnsToRotate; i++)
		{
			var temp = coordsToTransform.x;
			coordsToTransform.x = 0 - coordsToTransform.y;
			coordsToTransform.y = temp;
		}

		return coordsToTransform;
	};
}
