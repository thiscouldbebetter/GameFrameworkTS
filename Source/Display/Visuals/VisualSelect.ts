
class VisualSelect implements Visual
{
	selectChildName: (u: Universe, w: World, d: Display, e:Entity, v: VisualSelect) => string;
	childNames: string[];
	children: Visual[];
	childrenByName: Map<string, Visual>;

	constructor
	(
		selectChildName: (u: Universe, w: World, d: Display, e:Entity, v: VisualSelect) => string,
		childNames: string[],
		children: Visual[]
	)
	{
		this.selectChildName = selectChildName;
		this.childNames = childNames;
		this.children = children;
		this.childrenByName = new Map<string, Visual>();

		for (var i = 0; i < this.children.length; i++)
		{
			var childName = this.childNames[i];
			var child = this.children[i];
			this.childrenByName.set(childName, child);
		}
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var childToSelectName = this.selectChildName(universe, world, display, entity, this);
		var childSelected = this.childrenByName.get(childToSelectName);
		childSelected.draw(universe, world, display, entity);
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
