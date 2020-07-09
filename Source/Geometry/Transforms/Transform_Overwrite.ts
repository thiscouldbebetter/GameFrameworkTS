
class Transform_Overwrite implements Transform
{
	transformableToOverwriteWith: Transformable;

	constructor(transformableToOverwriteWith: Transformable)
	{
		this.transformableToOverwriteWith = transformableToOverwriteWith;
	}

	overwriteWith(other: Transform): Transform
	{
		return this; // todo
	}

	transform(transformable: Transformable): Transformable
	{
		return transformable; // todo
	};

	transformCoords(coordsToTransform: Coords): Coords
	{
		return coordsToTransform;
	}
}
