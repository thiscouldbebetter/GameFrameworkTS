
function VisualGroup(children)
{
	this.children = children;
}

{
	VisualGroup.prototype.drawToDisplayForDrawableAndLoc = function(display, drawable, loc)
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.drawToDisplayForDrawableAndLoc(display, drawable, loc);
		}
	}
}
