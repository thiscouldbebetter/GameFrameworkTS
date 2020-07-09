
class VisualDynamic implements Visual
{
	methodForVisual: (u: Universe, w: World, d: Display, e: Entity) => Visual;

	constructor(methodForVisual: (u: Universe, w: World, d: Display, e: Entity) => Visual)
	{
		this.methodForVisual = methodForVisual;
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var visual = this.methodForVisual.call(this, universe, world, display, entity);
		visual.draw(universe, world, display, entity);
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
