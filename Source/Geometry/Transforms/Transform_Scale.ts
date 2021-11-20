
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Scale implements Transform<Transform_Scale>
{
	scaleFactors: Coords;

	constructor(scaleFactors: Coords)
	{
		this.scaleFactors = scaleFactors;
	}

	static fromScalar(scalar: number): Transform_Scale
	{
		return new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(scalar));
	}

	clone(): Transform_Scale
	{
		return new Transform_Scale(this.scaleFactors.clone());
	}

	overwriteWith(other: Transform_Scale): Transform_Scale
	{
		this.scaleFactors.overwriteWith(other.scaleFactors);
		return this;
	}

	transform(transformable: TransformableBase): TransformableBase
	{
		return transformable.transform(this);
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		return coordsToTransform.multiply(this.scaleFactors);
	}
}

}
