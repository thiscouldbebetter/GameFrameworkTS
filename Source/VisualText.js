
function VisualText(text, color)
{
	this.text = text;
	this.color = color;
}

{
	VisualText.prototype.drawToDisplayForDrawableAndLoc = function(display, drawable, loc)
	{
		display.drawText
		(
			this.text,
			display.fontHeightInPixels, 
			loc.pos,
			this.color, // colorFore 
			display.colorBack, 
			false // areColorsReversed
		);
	}
}
