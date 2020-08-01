
class VisualTransform implements Visual
{
	transformToApply: Transform;
	child: Visual;

	_childBeforeTransform: Visual;

	constructor(transformToApply: Transform, child: Visual)
	{
		this.transformToApply = transformToApply;
		this.child = child;

		this._childBeforeTransform = this.child.clone();
	}

	// Cloneable.

	clone(): Visual
	{
		return new VisualTransform(this.transformToApply, this.child.clone());
	};

	overwriteWith(other: Visual): Visual
	{
		var otherAsVisualTransform = other as VisualTransform;
		this.child.overwriteWith(otherAsVisualTransform.child);
		return this;
	};

	// Transformable.

	transform(transformToApply: Transform)
	{
		return this.child.transform(transformToApply);
	};

	// Visual.

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		this._childBeforeTransform.overwriteWith(this.child);
		this.transformToApply.transform(this.child);
		this.child.draw(universe, world, display, entity);
		this.child.overwriteWith(this._childBeforeTransform);
	};
}
