
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Translate implements Transform<Transform_Translate>
{
	displacement: Coords;

	constructor(displacement: Coords)
	{
		this.displacement = displacement;
	}

	static fromDisplacement(displacement: Coords): Transform_Translate
	{
		return new Transform_Translate(displacement);
	}

	displacementSet(value: Coords): Transform_Translate
	{
		this.displacement.overwriteWith(value);
		return this;
	}

	// Clonable.

	clone(): Transform_Translate
	{
		return this; // todo
	}

	overwriteWith(other: Transform_Translate): Transform_Translate
	{
		return this; // todo
	}

	// Strings.
	toString(): string
	{
		var returnValue = Transform_Translate.name + " by " + this.displacement;
		return returnValue;
	}

	// Transform.

	transform(transformable: TransformableBase): TransformableBase
	{
		return transformable.transform(this);
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		return coordsToTransform.add(this.displacement);
	}
}

}
