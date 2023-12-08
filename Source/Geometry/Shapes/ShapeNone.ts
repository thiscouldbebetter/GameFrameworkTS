
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeNone implements ShapeBase
{
	// Clonable.

	clone(): ShapeNone
	{
		return new ShapeNone();
	}

	overwriteWith(other: ShapeNone): ShapeNone
	{
		return this;
	}

	// Equatable

	equals(other: ShapeBase) { return false; }

	// ShapeBase.

	collider(): ShapeBase { return null; }

	locate(loc: Disposition): ShapeBase
	{
		return this;
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		throw new Error("Not implemented!");
	}

	pointRandom(randomizer: Randomizer): Coords
	{
		throw new Error("Not implemented!");
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		throw new Error("Not implemented!");
	}

	toBox(boxOut: Box): Box { throw new Error("Not implemented!"); }

	// Transformable.

	transform(transformToApply: TransformBase): ShapeNone { return this;  }

}

}
