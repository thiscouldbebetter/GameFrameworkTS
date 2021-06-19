
namespace ThisCouldBeBetter.GameFramework
{

export class VisualNone implements Visual
{
	static Instance: VisualNone = new VisualNone();

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		// do nothing
	}

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}

}
