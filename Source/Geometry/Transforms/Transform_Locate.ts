
class Transform_Locate
{
	loc: Disposition;

	transformOrient: Transform_Orient;
	transformTranslate: Transform_Translate;

	constructor(loc)
	{
		this.loc = loc;

		this.transformOrient = new Transform_Orient(null);
		this.transformTranslate = new Transform_Translate(null);
	}

	transformCoords(coordsToTransform)
	{
		this.transformOrient.orientation = this.loc.orientation;
		this.transformOrient.transformCoords(coordsToTransform);

		this.transformTranslate.displacement = this.loc.pos;
		this.transformTranslate.transformCoords(coordsToTransform);

		return coordsToTransform;
	};
}
