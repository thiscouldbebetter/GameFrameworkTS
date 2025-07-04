
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
		return new Transform_Scale(Coords.ones().multiplyScalar(scalar));
	}

	static fromScaleFactor(scaleFactor: number): Transform_Scale
	{
		return new Transform_Scale(Coords.ones().multiplyScalar(scaleFactor) );
	}

	static fromScaleFactors(scaleFactors: Coords): Transform_Scale
	{
		return new Transform_Scale(scaleFactors);
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
