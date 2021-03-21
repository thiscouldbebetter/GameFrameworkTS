
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Orient implements Transform
{
	orientation: Orientation;

	_components: Coords[];

	constructor(orientation: Orientation)
	{
		this.orientation = orientation;

		this._components = [ Coords.create(), Coords.create(), Coords.create() ];
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
			components[0].overwriteWith(ori.forward).multiplyScalar(coordsToTransform.x).add
			(
				components[1].overwriteWith(ori.right).multiplyScalar(coordsToTransform.y).add
				(
					components[2].overwriteWith(ori.down).multiplyScalar(coordsToTransform.z)
				)
			)
		);

		return coordsToTransform;
	}
}

}
