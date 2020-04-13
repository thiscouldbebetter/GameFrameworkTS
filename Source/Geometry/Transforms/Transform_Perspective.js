
class Transform_Perspective
{
	constructor(focalLength)
	{
		this.focalLength = focalLength;
	}

	transformCoords(coordsToTransform)
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
	};
}
