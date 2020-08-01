
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
		return new VisualGroup(ArrayHelper.clone(this.children) );
	}

	overwriteWith(other: Visual): Visual
	{
		var otherAsVisualGroup = other as VisualGroup;
		ArrayHelper.overwriteWith(this.children, otherAsVisualGroup.children);
		return this;
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		this.children.forEach(x => transformToApply.transform(x));
		return this;
	}
}
