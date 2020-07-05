
class Transform_TranslateInvert
{
	displacement: Coords;

	constructor(displacement)
	{
		this.displacement = displacement;
	}

	transformCoords(coordsToTransform)
	{
		return coordsToTransform.subtract(this.displacement);
	};
}
