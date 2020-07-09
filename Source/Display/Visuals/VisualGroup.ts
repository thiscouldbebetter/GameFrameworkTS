
class VisualGroup implements Visual
{
	children: Visual[];

	constructor(children: Visual[])
	{
		this.children = children;
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.draw(universe, world, display, entity);
		}
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
