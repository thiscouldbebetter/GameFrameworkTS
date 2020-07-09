
class Transform_RotateRight implements Transform
{
	quarterTurnsToRotate: number;

	constructor(quarterTurnsToRotate: number)
	{
		this.quarterTurnsToRotate = quarterTurnsToRotate;
	}

	overwriteWith(other: Transform)
	{
		return this; // todo
	}

	transform(transformable: Transformable): Transformable
	{
		return transformable; // todo
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
