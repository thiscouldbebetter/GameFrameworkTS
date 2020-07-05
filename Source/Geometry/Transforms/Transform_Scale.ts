
class Transform_Scale
{
	scaleFactors: Coords;

	constructor(scaleFactors)
	{
		this.scaleFactors = scaleFactors;
	}

	static fromScalar(scalar)
	{
		return new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(scalar));
	};

	transformCoords(coordsToTransform)
	{
		return coordsToTransform.multiply(this.scaleFactors);
	};
}
