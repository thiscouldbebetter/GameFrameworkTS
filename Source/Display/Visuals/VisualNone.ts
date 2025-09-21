
namespace ThisCouldBeBetter.GameFramework
{

export class VisualNone extends VisualBase<VisualNone>
{
	static Instance: VisualNone = new VisualNone();

	constructor()
	{
		super();
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return true;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		// Do nothing.
	}

	// Clonable.

	clone(): VisualNone
	{
		return this; // todo
	}

	overwriteWith(other: VisualNone): VisualNone
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualNone
	{
		return this; // todo
	}
}

}
