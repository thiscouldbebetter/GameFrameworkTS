
function VisualSelect(name, childNames, children)
{
	this.name = name;
	this.childNames = childNames;
	this.children = children;

	for (var i = 0; i < this.children.length; i++)
	{
		var childName = this.childNames[i];
		var child = this.children[i];
		this.children[childName] = child;
	}
}

{
	VisualSelect.prototype.childSelected = function(drawable)
	{
		var childNameSelected = drawable["visualNameSelected_" + this.name];
		if (childNameSelected == null)
		{
			childNameSelected = this.childNames[0];
			drawable.visualNameSelected = childNameSelected;
		}
		return this.children[childNameSelected];
	}

	VisualSelect.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var childSelected = this.childSelected(drawable);
		childSelected.draw(universe, world, display, drawable, entity);
	}
}
