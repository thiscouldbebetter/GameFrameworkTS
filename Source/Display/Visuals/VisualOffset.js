
function VisualOffset(child, offset)
{
	this.child = child;
	this.offset = offset;

	// Helper variables.
	this._posSaved = new Coords();
}

{
	VisualOffset.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var drawablePos = entity.Locatable.loc.pos;
		this._posSaved.overwriteWith(drawablePos);
		drawablePos.add(this.offset);
		this.child.draw(universe, world, display, drawable, entity);
		drawablePos.overwriteWith(this._posSaved);
	};
}
