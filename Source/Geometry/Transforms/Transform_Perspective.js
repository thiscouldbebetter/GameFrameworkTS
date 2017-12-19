
function Transform_Perspective(focalLength)
{
	this.focalLength = focalLength;
}

{
	Transform_Perspective.prototype.applyToCoords = function(coordsToTransform)
	{
		var distanceAlongCameraForward = coordsToTransform.z;

		coordsToTransform.multiplyScalar
		(
			this.focalLength
		);

		if (distanceAlongCameraForward != 0)
		{
			coordsToTransform.divideScalar
			(
				distanceAlongCameraForward
			);
		}
		return coordsToTransform;
	}
}
