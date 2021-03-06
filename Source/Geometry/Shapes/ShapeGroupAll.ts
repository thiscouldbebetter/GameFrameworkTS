
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
		throw new Error("Not implemented!");
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		throw new Error("Not implemented!");
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		throw new Error("Not implemented!");
	}

	toBox(boxOut: Box): Box
	{
		throw new Error("Not implemented!");
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		this.shapes.forEach( (x: ShapeBase) => x.transform(transformToApply));
		return this;
	}
}

}
