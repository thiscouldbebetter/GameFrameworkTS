
function VisualText(text, color)
{
	this.text = text;
	this.color = color;
}

{
	VisualText.prototype.drawToDisplayAtLoc = function(display, loc)
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
