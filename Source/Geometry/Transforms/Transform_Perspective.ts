
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Perspective implements Transform<Transform_Perspective>
{
	focalLength: number;

	constructor(focalLength: number)
	{
		this.focalLength = focalLength;
	}

	// Clonable.

	clone(): Transform_Perspective
	{
		return new Transform_Perspective(this.focalLength);
	}

	overwriteWith(other: Transform_Perspective): Transform_Perspective
	{
		this.focalLength = other.focalLength;
		return this;
	}

	transform(transformable: TransformableBase): TransformableBase
	{
		return transformable; // todo
	}

	transformCoords(coordsToTransform: Coords): Coords
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

		coordsToTransform.z = distanceAlongCameraForward;

		return coordsToTransform;
	}
}

}
