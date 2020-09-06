
class Transform_Locate implements Transform
{
	loc: Disposition;

	transformOrient: Transform_Orient;
	transformTranslate: Transform_Translate;

	constructor(loc: Disposition)
	{
		this.loc = loc || new Disposition(null, null, null);

		this.transformOrient = new Transform_Orient(null);
		this.transformTranslate = new Transform_Translate(null);
	}

	overwriteWith(other: Transform)
	{
		return this; // todo
	}

	transform(transformable: Transformable): Transformable
	{
		return transformable.transform(this);
	}

	transformCoords(coordsToTransform: Coords)
	{
		this.transformOrient.orientation = this.loc.orientation;
		this.transformOrient.transformCoords(coordsToTransform);

		this.transformTranslate.displacement = this.loc.pos;
		this.transformTranslate.transformCoords(coordsToTransform);

		return coordsToTransform;
	}
}
