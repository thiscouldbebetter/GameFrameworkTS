
namespace ThisCouldBeBetter.GameFramework
{

export class VisualTransform implements Visual
{
	transformToApply: Transform;
	child: Visual;

	_childTransformed: Visual;

	constructor(transformToApply: Transform, child: Visual)
	{
		this.transformToApply = transformToApply;
		this.child = child;

		this._childTransformed = child.clone();
	}

	// Cloneable.

	clone(): Visual
	{
		return new VisualTransform(this.transformToApply, this.child.clone());
	}

	overwriteWith(other: Visual): Visual
	{
		var otherAsVisualTransform = other as VisualTransform;
		this.child.overwriteWith(otherAsVisualTransform.child);
		return this;
	}

	// Transformable.

	transform(transformToApply: Transform)
	{
		return this.child.transform(transformToApply);
	}

	// Visual.

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		this._childTransformed.overwriteWith(this.child);
		this.transformToApply.transform(this._childTransformed);
		this._childTransformed.draw(universe, world, place, entity, display);
	}
}

}
