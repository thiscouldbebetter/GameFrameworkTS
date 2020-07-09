
class VisualNone implements Visual
{
	draw(universe: Universe, world: World, display: Display, entity: Entity)
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
