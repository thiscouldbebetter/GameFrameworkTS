
namespace ThisCouldBeBetter.GameFramework
{

export class VisualTransform implements Visual<VisualTransform>
{
	transformToApply: TransformBase;
	child: VisualBase;

	_childTransformed: VisualBase;

	constructor(transformToApply: TransformBase, child: VisualBase)
	{
		this.transformToApply = transformToApply;
		this.child = child;

		this._childTransformed = child.clone();
	}

	// Cloneable.

	clone(): VisualTransform
	{
		return new VisualTransform(this.transformToApply, this.child.clone());
	}

	overwriteWith(other: VisualTransform): VisualTransform
	{
		this.child.overwriteWith(other.child);
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualTransform
	{
		transformToApply.transform(this.child);
		return this;
	}

	// Visual.

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		this._childTransformed.overwriteWith(this.child);
		this.transformToApply.transform(this._childTransformed);
		this._childTransformed.draw(uwpe, display);
	}
}

}
