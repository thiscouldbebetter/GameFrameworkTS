
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_OrientRDF implements Transform
{
	orientation: Orientation;

	_components: Coords[];

	constructor(orientation: Orientation)
	{
		this.orientation = orientation;

		// Helper variables.
		this._components = [ new Coords(0, 0, 0), new Coords(0, 0, 0), new Coords(0, 0, 0) ];
	}

	overwriteWith(other: Transform)
	{
		return this; // todo
	}

	transform(transformable: Transformable): Transformable
	{
		return transformable.transform(this);
	}

	transformCoords(coordsToTransform: Coords)
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
