
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeGroupAny extends ShapeBase
{
	children: Shape[];

	private _displacement: Coords;
	private _surfacePointForChild: Coords;

	constructor(children: Shape[])
	{
		super();

		this.children = children;

		this._displacement = Coords.create();
		this._surfacePointForChild = Coords.create();
	}

	static fromChildren(children: Shape[]): ShapeGroupAny
	{
		return new ShapeGroupAny(children);
	}

	// Clonable.

	clone(): ShapeGroupAny
	{
		return new ShapeGroupAny(ArrayHelper.clone(this.children));
	}

	overwriteWith(other: ShapeGroupAny): ShapeGroupAny
	{
		ArrayHelper.overwriteWith(this.children, other.children);
		return this;
	}

	// Equatable.

	equals(other: ShapeGroupAny): boolean
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

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		var distanceMinSoFar = Number.POSITIVE_INFINITY;
		for (var i = 0; i < this.children.length; i++)
		{
			var shape = this.children[i];

			shape.surfacePointNearPos(posToCheck, this._surfacePointForChild);

			var distanceFromPosToCheck = this._displacement.overwriteWith
			(
				this._surfacePointForChild
			).subtract
			(
				posToCheck
			).magnitude();

			if (distanceFromPosToCheck < distanceMinSoFar)
			{
				distanceMinSoFar = distanceFromPosToCheck;
				surfacePointOut.overwriteWith(this._surfacePointForChild);
			}
		}

		return surfacePointOut;
	}

	// Strings.

	toString(): string
	{
		var returnValue =
			ShapeGroupAny.name + " of children " + this.children.map(x => x.toString() );
		return returnValue;
	}

	// Transformable.

	transform(transformToApply: TransformBase): ShapeGroupAny
	{
		this.children.forEach( (x: Shape) => x.transform(transformToApply));
		return this;
	}
}

}
