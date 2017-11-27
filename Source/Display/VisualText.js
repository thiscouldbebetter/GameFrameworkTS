
function VisualText(text, color)
{
	this.text = text;
	this.color = color;
}

{
	VisualText.prototype.draw = function(universe, display, drawable, loc)
	{
		display.drawText
		(
			this.text,
			display.fontHeightInPixels,
			loc.pos,
			this.color, // colorFill
			display.colorBack,
			false, // areColorsReversed
			true, // isCentered
			null // widthMaxInPixels
		);
	}
}
