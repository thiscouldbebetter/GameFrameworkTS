
function VisualText(text, colorFill, colorBorder)
{
	this.text = text;
	this.colorFill = colorFill;
	this.colorBorder = colorBorder;
}

{
	VisualText.prototype.draw = function(universe, display, drawable, loc)
	{
		display.drawText
		(
			this.text,
			display.fontHeightInPixels,
			loc.pos,
			this.colorFill, 
			this.colorBorder,
			false, // areColorsReversed
			true, // isCentered
			null // widthMaxInPixels
		);
	}
}
