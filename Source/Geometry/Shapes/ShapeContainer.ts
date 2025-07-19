
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeContainer implements ShapeBase
{
	// Only collides if the other shape is fully contained in the child shape.

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

	containsPoint(pointToCheck: Coords): boolean
	{
		throw new Error("Not yet implemented!");
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

	toBoxAxisAligned(boxOut: BoxAxisAligned): BoxAxisAligned
	{
		return this.shape.toBoxAxisAligned(boxOut);
	}

	// Transformable.

	transform(transformToApply: TransformBase): ShapeContainer { throw new Error("Not implemented!");  }

}

}
