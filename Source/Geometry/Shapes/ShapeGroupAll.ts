
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeGroupAll implements ShapeBase
{
	shapes: ShapeBase[];

	constructor(shapes: ShapeBase[])
	{
		this.shapes = shapes;
	}

	// Clonable.

	clone(): ShapeGroupAll
	{
		return new ShapeGroupAll(ArrayHelper.clone(this.shapes));
	}

	overwriteWith(other: ShapeGroupAll): ShapeGroupAll
	{
		ArrayHelper.overwriteWith(this.shapes, other.shapes);
		return this;
	}

	// ShapeBase.

	locate(loc: Disposition): ShapeBase
	{
		throw("Not implemented!");
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		throw("Not implemented!");
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		throw("Not implemented!");
	}

	toBox(boxOut: Box): Box
	{
		throw("Not implemented!");
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		this.shapes.forEach( (x: ShapeBase) => x.transform(transformToApply));
		return this;
	}
}

}
