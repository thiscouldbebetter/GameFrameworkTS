
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

	static fromOrientation(orientation: Orientation): Transform_Orient
	{
		return new Transform_Orient(orientation);
	}

	static fromOrientationForward(orientationForward: Coords): Transform_Orient
	{
		return new Transform_Orient(Orientation.fromForward(orientationForward) );
	}

	// Clonable.

	clone(): Transform_Orient
	{
		return new Transform_Orient(this.orientation.clone());
	}

	overwriteWith(other: Transform_Orient): Transform_Orient
	{
		this.orientation.overwriteWith(other.orientation);
		return this;
	}

	// Transform.

	transform(transformable: TransformableBase): TransformableBase
	{
		return transformable.transform(this);
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		var components = this._components;
		var ori = this.orientation;

		var componentXForward =
			components[0]
				.overwriteWith(ori.forward)
				.multiplyScalar(coordsToTransform.x);

		var componentYRight =
			components[1]
				.overwriteWith(ori.right)
				.multiplyScalar(coordsToTransform.y);

		var componentZDown =
			components[2]
				.overwriteWith(ori.down)
				.multiplyScalar(coordsToTransform.z);

		coordsToTransform
			.overwriteWith(componentXForward)
			.add(componentYRight)
			.add(componentZDown);

		return coordsToTransform;
	}
}

}
