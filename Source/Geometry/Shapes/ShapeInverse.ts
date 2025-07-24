
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeInverse extends ShapeBase
{
	child: Shape;

	constructor(child: Shape)
	{
		super();

		this.child = child;
	}

	// Clonable.

	clone(): ShapeInverse
	{
		return new ShapeInverse(this.child.clone());
	}

	overwriteWith(other: ShapeInverse): ShapeInverse
	{
		this.child.overwriteWith(other.child);
		return this;
	}

	// Equatable

	equals(other: Shape) { return this.child.equals( (other as ShapeInverse).child); }

	// ShapeBase.

	containsPoint(pointToCheck: Coords): boolean
	{
		return (this.child.containsPoint(pointToCheck) == false);
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		return this.child.normalAtPos(posToCheck, normalOut).invert();
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		return this.child.surfacePointNearPos(posToCheck, surfacePointOut);
	}

	// Transformable.

	transform(transformToApply: TransformBase): ShapeInverse { throw new Error("Not implemented!");  }

}

}
