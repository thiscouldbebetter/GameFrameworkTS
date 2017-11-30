
function ControlImage(name, pos, size, image)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.image = image;

	// Helper variables.
	this.drawPos = new Coords();
	this.drawLoc = new Location(this.drawPos);
}

{
	ControlImage.prototype.style = function(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	}

	// drawable

	ControlImage.prototype.draw = function(universe, display, drawLoc)
	{
		var drawPos = this.drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		var style = this.style(universe);

		display.drawRectangle
		(
			drawPos, this.size,
			style.colorFill, style.colorBorder
		);

		display.drawImage
		(
			this.image,
			drawPos,
			this.size // hack
		);
	}
}
