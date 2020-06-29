
class Transform_Locate
{
	constructor(loc)
	{
		this.loc = loc;

		this.transformOrient = new Transform_Orient();
		this.transformTranslate = new Transform_Translate();
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
