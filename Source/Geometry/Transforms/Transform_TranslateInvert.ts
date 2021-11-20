
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_TranslateInvert implements Transform<Transform_TranslateInvert>
{
	displacement: Coords;

	constructor(displacement: Coords)
	{
		this.displacement = displacement;
	}

	clone(): Transform_TranslateInvert
	{
		return new Transform_TranslateInvert(this.displacement.clone());
	}

	overwriteWith(other: Transform_TranslateInvert): Transform_TranslateInvert
	{
		this.displacement.overwriteWith(other.displacement);
		return this;
	}

	transform(transformable: TransformableBase): TransformableBase
	{
		return transformable; // todo
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		return coordsToTransform.subtract(this.displacement);
	}
}

}
