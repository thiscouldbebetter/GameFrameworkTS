
function VisualText(text, colorFill, colorBorder)
{
	this._text = text;
	this.colorFill = colorFill;
	this.colorBorder = colorBorder;
}

{
	VisualText.prototype.draw = function(universe, world, display, drawable)
	{
		var text = this.text(universe, world, display, drawable);
		display.drawText
		(
			text,
			display.fontHeightInPixels,
			drawable.loc.pos,
			this.colorFill,
			this.colorBorder,
			false, // areColorsReversed
			true, // isCentered
			null // widthMaxInPixels
		);
	}

	VisualText.prototype.text = function(universe, world, display, drawable)
	{
		return (this._text.get == null ? this._text : this._text.get(universe, world, display, drawable) );
	}
}
