
class VisualInvisible
{
	constructor(child)
	{
		this.child = child;
	}

	// Cloneable.

	clone()
	{
		return new VisualInvisible(this.child.clone());
	};

	overwriteWith(other)
	{
		this.child.overwriteWith(other.child);
	};

	// Transformable.

	transform(transformToApply)
	{
		return transformToApply.transform(this.child);
	};

	// Visual.

	draw(universe, world, display, entity)
	{
		// Do nothing.
	};
}
