
class Transform_TranslateInvert
{
	constructor(displacement)
	{
		this.displacement = displacement;
	}

	transformCoords(coordsToTransform)
	{
		return coordsToTransform.subtract(this.displacement);
	};
}
