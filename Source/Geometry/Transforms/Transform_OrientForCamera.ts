
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_OrientForCamera
	implements Transform<Transform_OrientForCamera>
{
	orientation: Orientation;

	constructor(orientation: Orientation)
	{
		this.orientation = orientation;
	}

	clone(): Transform_OrientForCamera
	{
		return new Transform_OrientForCamera(this.orientation.clone());
	}

	overwriteWith(other: Transform_OrientForCamera): Transform_OrientForCamera
	{
		this.orientation.overwriteWith(other.orientation);
		return this; // todo
	}

	transform(transformable: TransformableBase): TransformableBase
	{
		return transformable; // todo
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		coordsToTransform.overwriteWithDimensions
		(
			this.orientation.right.dotProduct(coordsToTransform),
			this.orientation.down.dotProduct(coordsToTransform),
			this.orientation.forward.dotProduct(coordsToTransform)
		);
		return coordsToTransform;
	}
}

}
