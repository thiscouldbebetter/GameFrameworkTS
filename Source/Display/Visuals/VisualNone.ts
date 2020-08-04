
class VisualNone implements Visual
{
	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		// do nothing
	};

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
