
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

		var fontHeightInPixels = (this.fontHeightInPixels == null ? display.fontHeightInPixels : this.fontHeightInPixels);

		var textMargins;

		if (this.isTextCentered == true)
		{
			var textWidth = display.textWidthForFontHeight
			(
				this.text, this.fontHeightInPixels
			);
			textMargins = new Coords
			(
				(this.size.x - textWidth) / 2,
				(this.size.y - fontHeightInPixels) / 2
			);
		}
		else
		{
			textMargins = new Coords
			(
				2,
				(this.size.y - fontHeightInPixels) / 2
			);
		}

		drawPos.add(textMargins);
		display.drawText
		(
			this.text, fontHeightInPixels, drawPos, display.colorFore
		);
	}
}
