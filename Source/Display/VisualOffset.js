
function VisualOffset(child, offset)
{
	this.child = child;
	this.offset = offset;

	// temps

	this.drawLoc = new Location(new Coords());
}

{
	VisualOffset.prototype.drawToDisplayForDrawableAndLoc = function(display, drawable, loc)
	{
		this.drawLoc.overwriteWith(loc);
		this.drawLoc.pos.add(this.offset);
		this.child.drawToDisplayForDrawableAndLoc(display, drawable, this.drawLoc);
	}
}
