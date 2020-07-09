
class Transform_TranslateInvert implements Transform
{
	displacement: Coords;

	constructor(displacement: Coords)
	{
		this.displacement = displacement;
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
		return coordsToTransform.subtract(this.displacement);
	};
}
