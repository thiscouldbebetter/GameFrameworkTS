
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeTransformed implements ShapeBase
{
	transformToApply: TransformBase;
	child: ShapeBase;

	constructor(transformToApply: TransformBase, child: ShapeBase)
	{
		this.transformToApply = transformToApply;
		this.child = child;
	}

	static fromTransformAndChild
	(
		transformToApply: TransformBase,
		child: ShapeBase
	): ShapeTransformed
	{
		return new ShapeTransformed(transformToApply, child);
	}

	// Clonable.

	clone(): ShapeTransformed
	{
		return new ShapeTransformed
		(
			this.transformToApply.clone(),
			this.child.clone()
		);
	}

	overwriteWith(other: ShapeTransformed): ShapeTransformed
	{
		this.transformToApply.overwriteWith(other.transformToApply);
		this.child.overwriteWith(other.child);
		return this;
	}

	// Equatable

	equals(other: ShapeBase): boolean
	{
		throw new Error("Not yet implemented!");
	} // todo

	// ShapeBase.

	collider(): ShapeBase { return null; }

	containsPoint(pointToCheck: Coords): boolean
	{
		throw new Error("Not yet implemented!");
	}

	locate(loc: Disposition): ShapeBase
	{
		this.child.locate(loc);
		return this;
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		throw new Error("Not yet implemented!");
	}

	pointRandom(randomizer: Randomizer): Coords
	{
		throw new Error("Not yet implemented!");
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		throw new Error("Not yet implemented!");
	}

	toBox(boxOut: Box): Box { throw new Error("Not implemented!"); }

	// Transformable.

	transform(transformToApply: TransformBase): ShapeGroupAny
	{
		throw new Error("Not yet implemented!");
	}
}

}
