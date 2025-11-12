
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Locate implements Transform<Transform_Locate>
{
	loc: Disposition;

	transformOrient: Transform_Orient;
	transformTranslate: Transform_Translate;

	constructor(loc: Disposition)
	{
		this.loc = loc || Disposition.create();

		this.transformOrient = new Transform_Orient(null);
		this.transformTranslate = new Transform_Translate(null);
	}

	static create(): Transform_Locate
	{
		return new Transform_Locate(Disposition.create() );
	}

	static fromDisposition(loc: Disposition): Transform_Locate
	{
		return new Transform_Locate(loc);
	}

	clone(): Transform_Locate
	{
		return new Transform_Locate(this.loc.clone());
	}

	overwriteWith(other: Transform_Locate): Transform_Locate
	{
		this.loc.overwriteWith(other.loc);
		return this;
	}

	transform(transformable: TransformableBase): TransformableBase
	{
		return transformable.transform(this);
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		this.transformOrient.orientation = this.loc.orientation;
		this.transformOrient.transformCoords(coordsToTransform);

		this.transformTranslate.displacement = this.loc.pos;
		this.transformTranslate.transformCoords(coordsToTransform);

		return coordsToTransform;
	}
}

}
