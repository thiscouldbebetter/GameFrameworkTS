
class Transform_Dynamic implements Transform
{
	transformTransformable: (t: Transformable) => Transformable;

	constructor(transformTransformable: (t: Transformable) => Transformable)
	{
		this.transformTransformable = transformTransformable;
	}

	overwriteWith(other: Transform)
	{
		return this;
	}

	transform(transformable: Transformable): Transformable
	{
		return this.transformTransformable(transformable);
	}

	transformCoords(coordsToTransform: Coords)
	{
		return coordsToTransform; // todo
	}
}
