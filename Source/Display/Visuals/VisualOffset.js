
function VisualOffset(child, offset)
{
	this.child = child;
	this.offset = offset;

	// Helper variables.
	this.posSaved = new Coords();
}

{
	VisualOffset.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var drawablePos = drawable.loc.pos;
		this.posSaved.overwriteWith(drawablePos);
		drawablePos.add(this.offset);
		this.child.draw(universe, world, display, drawable, entity);
		drawablePos.overwriteWith(this.posSaved);
	}
}
