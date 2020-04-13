
class VisualSelect
{
	constructor(selectChildName, childNames, children)
	{
		this.selectChildName = selectChildName;
		this.childNames = childNames;
		this.children = children;

		for (var i = 0; i < this.children.length; i++)
		{
			var childName = this.childNames[i];
			var child = this.children[i];
			this.children[childName] = child;
		}
	}

	draw(universe, world, display, entity)
	{
		var childToSelectName = this.selectChildName(universe, world, display, entity, this);
		var childSelected = this.children[childToSelectName];
		childSelected.draw(universe, world, display, entity);
	};
}
