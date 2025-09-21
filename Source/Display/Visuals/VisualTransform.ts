
namespace ThisCouldBeBetter.GameFramework
{

export class VisualTransform extends VisualBase<VisualTransform>
{
	transformToApply: TransformBase;
	child: Visual;

	_childTransformed: Visual;

	constructor(transformToApply: TransformBase, child: Visual)
	{
		super();

		this.transformToApply = transformToApply;
		this.child = child;

		this._childTransformed = child.clone();
	}

	static fromTransformAndChild
	(
		transformToApply: TransformBase, child: Visual
	): VisualTransform
	{
		return new VisualTransform(transformToApply, child);
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

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.child.initialize(uwpe);
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return this.child.initializeIsComplete(uwpe);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		this._childTransformed.overwriteWith(this.child);
		this.transformToApply.transform(this._childTransformed);
		this._childTransformed.draw(uwpe, display);
	}
}

}
