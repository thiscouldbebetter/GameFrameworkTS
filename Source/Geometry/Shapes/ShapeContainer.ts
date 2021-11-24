
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeContainer implements ShapeBase
{
	shape: ShapeBase;

	constructor(shape: ShapeBase)
	{
		this.shape = shape;
	}

	// Clonable.

	clone(): ShapeContainer
	{
		return new ShapeContainer(this.shape.clone());
	}

	overwriteWith(other: ShapeContainer): ShapeContainer
	{
		this.shape.overwriteWith(other.shape);
		return this;
	}

	// Equatable

	equals(other: ShapeBase) { return false; } // todo

	// ShapeBase.

	collider(): ShapeBase { return null; }

	locate(loc: Disposition): ShapeBase
	{
		this.shape.locate(loc);
		return this;
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		return this.shape.normalAtPos(posToCheck, normalOut);
	}

	pointRandom(randomizer: Randomizer): Coords
	{
		return null; // todo
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		return this.shape.surfacePointNearPos(posToCheck, surfacePointOut);
	}

	toBox(boxOut: Box): Box
	{
		return this.shape.toBox(boxOut);
	}

	// Transformable.

	transform(transformToApply: TransformBase): ShapeContainer { throw new Error("Not implemented!");  }

}

}
