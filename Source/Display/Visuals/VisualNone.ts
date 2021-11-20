
namespace ThisCouldBeBetter.GameFramework
{

export class VisualNone implements Visual<VisualNone>
{
	static Instance: VisualNone = new VisualNone();

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		// do nothing
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
