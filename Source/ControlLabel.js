
function ControlLabel(name, pos, size, isTextCentered, text, fontHeightInPixels)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.isTextCentered = isTextCentered;
	this.text = text;
	this.fontHeightInPixels = fontHeightInPixels;
}

{
	// drawable

	ControlLabel.prototype.drawToDisplayAtLoc = function(display, drawLoc)
	{
		var drawPos = drawLoc.pos.add(this.pos);

		display.drawText
		(
			this.text,
			this.fontHeightInPixels,
			drawPos,
			display.colorFore,
			display.colorBack, // colorOutline
			null, // areColorsReversed
			this.isTextCentered,
			this.size.x // widthMaxInPixels
		);
	}
}
