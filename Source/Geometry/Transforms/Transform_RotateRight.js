
function Transform_RotateRight(quarterTurnsToRotate)
{
	this.quarterTurnsToRotate = quarterTurnsToRotate;
}

{
	Transform_RotateRight.prototype.transformCoords = function(coordsToTransform)
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
