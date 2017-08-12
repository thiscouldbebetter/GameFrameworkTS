
function VisualOffset(child, offset)
{
	this.child = child;
	this.offset = offset;

	// temps

	this.drawLoc = new Location(new Coords());
}

{
	VisualOffset.prototype.drawToDisplayAtLoc = function(display, loc, entity)
	{
		this.drawLoc.overwriteWith(loc);
		this.drawLoc.pos.add(this.offset);
		this.child.drawToDisplayAtLoc(display, this.drawLoc, entity);
	}
}
