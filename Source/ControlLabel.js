
function ControlLabel(name, pos, size, isTextCentered, text, fontHeightInPixels)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.isTextCentered = isTextCentered;
	this._text = text;
	this.fontHeightInPixels = fontHeightInPixels;
}

{
	ControlLabel.prototype.text = function()
	{
		return (this._text.get == null ? this._text : this._text.get() );
	}

	// drawable

	ControlLabel.prototype.drawToDisplayAtLoc = function(display, drawLoc)
	{
		var drawPos = drawLoc.pos.add(this.pos);
		var text = this.text();

		display.drawText
		(
			text,
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
