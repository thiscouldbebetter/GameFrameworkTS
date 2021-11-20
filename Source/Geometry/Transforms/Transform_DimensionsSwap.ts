
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_DimensionsSwap implements
	Transform<Transform_DimensionsSwap>
{
	dimensionIndices: number[];

	constructor(dimensionIndices: number[])
	{
		this.dimensionIndices = dimensionIndices;
	}

	clone(): Transform_DimensionsSwap { return this; } // todo

	overwriteWith(other: Transform_DimensionsSwap): Transform_DimensionsSwap
	{
		return this; // todo
	}

	transform(transformable: TransformableBase): TransformableBase
	{
		return transformable; // todo
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		var dimensionIndex0 = this.dimensionIndices[0];
		var dimensionIndex1 = this.dimensionIndices[1];

		var dimension0 = coordsToTransform.dimensionGet(dimensionIndex0);
		var dimension1 = coordsToTransform.dimensionGet(dimensionIndex1);

		coordsToTransform.dimensionSet(dimensionIndex0, dimension1);
		coordsToTransform.dimensionSet(dimensionIndex1, dimension0);
		return coordsToTransform;
	}
}

}
