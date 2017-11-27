
function VisualOffset(child, offset)
{
	this.child = child;
	this.offset = offset;

	// temps

	this.drawLoc = new Location(new Coords());
}

{
	VisualOffset.prototype.draw = function(universe, display, drawable, loc)
	{
		this.drawLoc.overwriteWith(loc);
		this.drawLoc.pos.add(this.offset);
		this.child.draw(universe, display, drawable, this.drawLoc);
	}
}
