
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
		var otherAsScale = other as Transform_Scale;
		this.scaleFactors.overwriteWith(otherAsScale.scaleFactors);
		return this;
	}

	transform(transformable: Transformable): Transformable
	{
		return transformable.transform(this);
	}

	transformCoords(coordsToTransform: Coords)
	{
		return coordsToTransform.multiply(this.scaleFactors);
	};
}
