
class Transform_DimensionsSwap implements Transform
{
	dimensionIndices: number[];

	constructor(dimensionIndices: number[])
	{
		this.dimensionIndices = dimensionIndices;
	}

	overwriteWith(other: Transform)
	{
		return this; // todo
	}

	transform(transformable: Transformable): Transformable
	{
		return transformable; // todo
	}

	transformCoords(coordsToTransform: Coords)
	{
		var dimensionIndex0 = this.dimensionIndices[0];
		var dimensionIndex1 = this.dimensionIndices[1];

		var dimension0 = coordsToTransform.dimensionGet(dimensionIndex0);
		var dimension1 = coordsToTransform.dimensionGet(dimensionIndex1);

		coordsToTransform.dimensionSet(dimensionIndex0, dimension1);
		coordsToTransform.dimensionSet(dimensionIndex1, dimension0);
		return coordsToTransform;
	};
}
