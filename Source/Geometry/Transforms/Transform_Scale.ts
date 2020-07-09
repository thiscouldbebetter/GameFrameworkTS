
class Transform_Scale implements Transform
{
	scaleFactors: Coords;

	constructor(scaleFactors: Coords)
	{
		this.scaleFactors = scaleFactors;
	}

	static fromScalar(scalar: number)
	{
		return new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(scalar));
	};

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
		return coordsToTransform.multiply(this.scaleFactors);
	};
}
