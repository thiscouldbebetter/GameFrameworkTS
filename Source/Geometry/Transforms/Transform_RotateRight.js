
class Transform_RotateRight
{
	constructor(quarterTurnsToRotate)
	{
		this.quarterTurnsToRotate = quarterTurnsToRotate;
	}

	transformCoords(coordsToTransform)
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
