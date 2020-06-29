
class Transform_Translate
{
	constructor(displacement)
	{
		this.displacement = displacement;
	}

	displacementSet(value)
	{
		this.displacement.overwriteWith(value);
		return this;
	};

	// transform

	transform(transformable)
	{
		return transformable.transform(this);
	};

	transformCoords(coordsToTransform)
	{
		return coordsToTransform.add(this.displacement);
	};
}
