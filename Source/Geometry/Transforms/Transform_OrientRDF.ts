
class Transform_OrientRDF
{
	constructor(orientation)
	{
		this.orientation = orientation;

		// Helper variables.
		this._components = [ new Coords(), new Coords(), new Coords() ];
	}

	transform(transformable)
	{
		return transformable.transform(this);
	};

	transformCoords(coordsToTransform)
	{
		var components = this._components;
		var ori = this.orientation;

		coordsToTransform.overwriteWith
		(
			components[0].overwriteWith(ori.right).multiplyScalar(coordsToTransform.x).add
			(
				components[1].overwriteWith(ori.down).multiplyScalar(coordsToTransform.y).add
				(
					components[2].overwriteWith(ori.forward).multiplyScalar(coordsToTransform.z)
				)
			)
		);

		return coordsToTransform;
	};
}
