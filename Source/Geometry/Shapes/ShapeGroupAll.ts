
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeGroupAll extends ShapeBase
{
	children: Shape[];

	constructor(children: Shape[])
	{
		super();

		this.children = children;
	}

	static fromChildren(children: Shape[]): ShapeGroupAll
	{
		return new ShapeGroupAll(children);
	}

	// Clonable.

	clone(): ShapeGroupAll
	{
		return new ShapeGroupAll(ArrayHelper.clone(this.children));
	}

	overwriteWith(other: ShapeGroupAll): ShapeGroupAll
	{
		ArrayHelper.overwriteWith(this.children, other.children);
		return this;
	}

	// Equatable.

	equals(other: ShapeGroupAll): boolean
	{
		var thisAndOtherAreEqualSoFar =
			(this.children.length == other.children.length);
		if (thisAndOtherAreEqualSoFar)
		{
			for (var i = 0; i < this.children.length; i++)
			{
				var childOfThis = this.children[i];
				var childOfOther = other.children[i];
				var childrenOfThisAndOtherAreEqual = childOfThis.equals(childOfOther);
				if (childrenOfThisAndOtherAreEqual == false)
				{
					thisAndOtherAreEqualSoFar = false;
					break;
				}
			}
		}
		return thisAndOtherAreEqualSoFar;
	}

	// ShapeBase.

	containsPoint(pointToCheck: Coords): boolean
	{
		var doAnyChildShapesNotContainPoint =
			this.children.some(x => x.containsPoint(pointToCheck) == false);

		var doAllChildShapesContainPoint =
			(doAnyChildShapesNotContainPoint == false);

		return doAllChildShapesContainPoint;
	}

	// Transformable.

	transform(transformToApply: TransformBase): ShapeGroupAll
	{
		this.children.forEach( (x: Shape) => x.transform(transformToApply));
		return this;
	}
}

}
