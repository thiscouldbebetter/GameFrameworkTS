
namespace ThisCouldBeBetter.GameFramework
{

export class VisualInvisible implements Visual
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
	}

	overwriteWith(other: Visual): Visual
	{
		var otherAsVisualInvisible = other as VisualInvisible;
		this.child.overwriteWith(otherAsVisualInvisible.child);
		return this;
	}

	// Transformable.

	transform(transformToApply: Transform): VisualInvisible
	{
		transformToApply.transform(this.child);
		return this;
	}

	// Visual.

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		// Do nothing.
	}
}

}
