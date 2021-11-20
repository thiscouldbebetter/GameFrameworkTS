
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_OrientRDF implements Transform<Transform_OrientRDF>
{
	// "RDF" = "right, down, forward".
 
	orientation: Orientation;

	_components: Coords[];

	constructor(orientation: Orientation)
	{
		this.orientation = orientation;

		// Helper variables.
		this._components = [ Coords.create(), Coords.create(), Coords.create() ];
	}

	clone(): Transform_OrientRDF
	{
		return this; // todo
	}

	overwriteWith(other: Transform_OrientRDF): Transform_OrientRDF
	{
		return this; // todo
	}

	transform(transformable: TransformableBase): TransformableBase
	{
		return transformable.transform(this);
	}

	transformCoords(coordsToTransform: Coords): Coords
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
	}
}

}
