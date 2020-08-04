
class VisualInvisible implements Visual
{
	private child: Visual;

	constructor(child: Visual)
	{
		this.child = child;
	}

	// Cloneable.

	clone(): Visual
	{
		return new VisualInvisible(this.child.clone());
	};

	overwriteWith(other: Visual): Visual
	{
		var otherAsVisualInvisible = other as VisualInvisible;
		this.child.overwriteWith(otherAsVisualInvisible.child);
		return this;
	};

	// Transformable.

	transform(transformToApply: Transform)
	{
		return transformToApply.transform(this.child);
	};

	// Visual.

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		// Do nothing.
	};
}
