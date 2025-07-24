
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeTransformed extends ShapeBase
{
	transformToApply: TransformBase;
	child: Shape;

	_childAfterTransformation: Shape;

	constructor(transformToApply: TransformBase, child: Shape)
	{
		super();

		this.transformToApply = transformToApply;
		this.child = child;

		this._childAfterTransformation = this.child.clone();
	}

	static fromTransformAndChild
	(
		transformToApply: TransformBase,
		child: Shape
	): ShapeTransformed
	{
		return new ShapeTransformed(transformToApply, child);
	}

	shapeAfterTransformation(): Shape
	{
		var returnValue =
			this._childAfterTransformation
				.overwriteWith(this.child)
				.transform(this.transformToApply);

		return returnValue;
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

	equals(other: ShapeTransformed): boolean
	{
		return this.child.equals(other.child); // todo - && this.transform.equals(other.transform);
	}

	// Transformable.

	transform(transformToApply: TransformBase): ShapeTransformed
	{
		this.child.transform(transformToApply); // Is this correct?
		return this;
	}
}

}
