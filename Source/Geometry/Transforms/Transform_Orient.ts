
class Transform_Orient implements Transform
{
	orientation: Orientation;

	constructor(orientation: Orientation)
	{
		this.orientation = orientation;
	}

	overwriteWith(other: Transform)
	{
		return this; // todo
	}

	transform(transformable: Transformable): Transformable
	{
		return transformable.transform(this);
	};

	transformCoords(coordsToTransform: Coords)
	{
		// todo
		// Compare to Transform_OrientRDF.transformCoords().
		// Should this be doing the same thing?

		coordsToTransform.overwriteWithDimensions
		(
			this.orientation.forward.dotProduct(coordsToTransform),
			this.orientation.right.dotProduct(coordsToTransform),
			this.orientation.down.dotProduct(coordsToTransform)
		);
		return coordsToTransform;
	};
}
