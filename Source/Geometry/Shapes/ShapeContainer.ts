
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeContainer extends ShapeBase
{
	// Only collides if the other shape is fully contained in the child shape.

	child: Shape;

	constructor(child: Shape)
	{
		super();

		this.child = child;
	}

	// Clonable.

	clone(): ShapeContainer
	{
		return new ShapeContainer(this.child.clone());
	}

	overwriteWith(other: ShapeContainer): ShapeContainer
	{
		this.child.overwriteWith(other.child);
		return this;
	}

	// Equatable.

	equals(other: ShapeContainer)
	{
		return this.child.equals(other.child);
	}

	// ShapeBase.

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		return this.child.normalAtPos(posToCheck, normalOut);
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		return this.child.surfacePointNearPos(posToCheck, surfacePointOut);
	}

	toBoxAxisAligned(boxOut: BoxAxisAligned): BoxAxisAligned
	{
		return this.child.toBoxAxisAligned(boxOut);
	}

	// Transformable.

	transform(transformToApply: TransformBase): ShapeContainer { throw new Error("Not implemented!");  }

}

}
