
function VisualGroup(children)
{
	this.children = children;
}

{
	VisualGroup.prototype.drawToDisplayAtLoc = function(display, loc, entity)
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.drawToDisplayAtLoc(display, loc, entity);
		}
	}
}
