
namespace ThisCouldBeBetter.GameFramework
{

export class VisualInvisible implements Visual<VisualInvisible>
{
	private child: VisualBase;

	constructor(child: VisualBase)
	{
		this.child = child;
	}

	// Cloneable.

	clone(): VisualInvisible
	{
		return new VisualInvisible(this.child.clone());
	}

	overwriteWith(other: VisualInvisible): VisualInvisible
	{
		this.child.overwriteWith(other.child);
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualInvisible
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
		// Do nothing.
	}
}

}
