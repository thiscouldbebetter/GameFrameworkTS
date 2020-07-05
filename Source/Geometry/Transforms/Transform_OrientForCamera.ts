
class Transform_OrientForCamera
{
	orientation: Orientation;

	constructor(orientation)
	{
		this.orientation = orientation;
	}

	transformCoords(coordsToTransform)
	{
		coordsToTransform.overwriteWithDimensions
		(
			this.orientation.right.dotProduct(coordsToTransform),
			this.orientation.down.dotProduct(coordsToTransform),
			this.orientation.forward.dotProduct(coordsToTransform)
		);
		return coordsToTransform;
	};
}
