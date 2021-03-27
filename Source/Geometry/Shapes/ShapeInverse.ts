
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeInverse implements ShapeBase
{
	shape: ShapeBase;

	constructor(shape: ShapeBase)
	{
		this.shape = shape;
	}

	// Clonable.

	clone(): ShapeInverse
	{
		return new ShapeInverse(this.shape.clone());
	}

	overwriteWith(other: ShapeInverse): ShapeInverse
	{
		this.shape.overwriteWith(other.shape);
		return this;
	}

	// ShapeBase.

	locate(loc: Disposition): ShapeBase
	{
		this.shape.locate(loc);
		return this;
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		return this.shape.normalAtPos(posToCheck, normalOut).invert();
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		return this.shape.surfacePointNearPos(posToCheck, surfacePointOut);
	}

	toBox(boxOut: Box): Box { throw("Not implemented!"); }
}

}
