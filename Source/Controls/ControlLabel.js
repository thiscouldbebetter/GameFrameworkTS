
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
	ControlLabel.prototype.style = function()
	{
		return ControlStyle.Instances[this.styleName == null ? "Default" : this.styleName];
	}

	ControlLabel.prototype.text = function()
	{
		return (this._text.get == null ? this._text : this._text.get() );
	}

	// drawable

	ControlLabel.prototype.drawToDisplayAtLoc = function(display, drawLoc)
	{
		var drawPos = drawLoc.pos.add(this.pos);
		var style = this.style();
		var text = this.text();

		display.drawText
		(
			text,
			this.fontHeightInPixels,
			drawPos,
			style.colorBorder,
			style.colorFill, // colorOutline
			null, // areColorsReversed
			this.isTextCentered,
			this.size.x // widthMaxInPixels
		);
	}
}
