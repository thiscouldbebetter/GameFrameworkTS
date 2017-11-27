
function VisualGroup(children)
{
	this.children = children;
}

{
	VisualGroup.prototype.draw = function(universe, display, drawable, loc)
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.draw(universe, display, drawable, loc);
		}
	}
}
