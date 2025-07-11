
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

	// Equatable

	equals(other: ShapeBase) { return false; } // todo

	// ShapeBase.

	collider(): ShapeBase { return null; }

	containsPoint(pointToCheck: Coords): boolean
	{
		var doAnyChildShapesNotContainPoint =
			this.shapes.some(x => x.containsPoint(pointToCheck) == false);

		var doAllChildShapesContainPoint =
			(doAnyChildShapesNotContainPoint == false);

		return doAllChildShapesContainPoint;
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		throw new Error("Not implemented!");
	}

	pointRandom(randomizer: Randomizer): Coords
	{
		return null; // todo
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

	transform(transformToApply: TransformBase): ShapeGroupAll
	{
		this.shapes.forEach( (x: ShapeBase) => x.transform(transformToApply));
		return this;
	}
}

}
