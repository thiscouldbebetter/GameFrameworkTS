
function Transform_OrientRDF(orientation)
{
	this.orientation = orientation;

	// Helper variables.
	this._components = [ new Coords(), new Coords(), new Coords() ];
}

{
	Transform_OrientRDF.prototype.transform = function(transformable)
	{
		return transformable.transform(this);
	};

	Transform_OrientRDF.prototype.transformCoords = function(coordsToTransform)
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
