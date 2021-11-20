
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Orient implements Transform<Transform_Orient>
{
	orientation: Orientation;

	_components: Coords[];

	constructor(orientation: Orientation)
	{
		this.orientation = orientation;

		this._components = [ Coords.create(), Coords.create(), Coords.create() ];
	}

	clone(): Transform_Orient
	{
		return new Transform_Orient(this.orientation.clone());
	}

	overwriteWith(other: Transform_Orient): Transform_Orient
	{
		this.orientation.overwriteWith(other.orientation);
		return this;
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
