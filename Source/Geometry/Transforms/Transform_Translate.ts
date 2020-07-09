
class Transform_Translate implements Transform
{
	displacement: Coords;

	constructor(displacement: Coords)
	{
		this.displacement = displacement;
	}

	displacementSet(value: Coords)
	{
		this.displacement.overwriteWith(value);
		return this;
	};

	// transform

	overwriteWith(other: Transform)
	{
		return this; // todo
	}

	transform(transformable: Transformable): Transformable
	{
		return transformable.transform(this);
	};

	transformCoords(coordsToTransform: Coords)
	{
		return coordsToTransform.add(this.displacement);
	};
}
