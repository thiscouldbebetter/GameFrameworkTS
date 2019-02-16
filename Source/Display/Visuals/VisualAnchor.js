
function VisualAnchor(child, posToAnchorAt)
{
	this.child = child;
	this.posToAnchorAt = posToAnchorAt;

	// Helper variables.
	this.posSaved = new Coords();
}

{
	VisualAnchor.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var drawablePos = drawable.loc.pos;
		this.posSaved.overwriteWith(drawablePos);
		drawablePos.overwriteWith(this.posToAnchorAt);
		this.child.draw(universe, world, display, drawable, entity);
		drawablePos.overwriteWith(this.posSaved);
	};
}
