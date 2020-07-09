
class VisualTransform implements Visual
{
	transformToApply: Transform;
	child: Visual;

	constructor(transformToApply: Transform, child: Visual)
	{
		this.transformToApply = transformToApply;
		this.child = child;
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
		this.child.transform(this.transformToApply);
		this.child.draw(universe, world, display, entity);
	};
}
