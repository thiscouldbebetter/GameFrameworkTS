
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
	
	ControlLabel.prototype.draw = function()
	{
		var control = this;
		var display = Globals.Instance.display;
		
		var pos = control.pos;
		var size = control.size;
		var text = control.text;

		var textHeight = display.fontHeightInPixels;

		var textMargins;

		if (control.isTextCentered == true)
		{
			var textWidth = display.textWidthForFontHeight(text, this.fontHeightInPixels);
			textMargins = new Coords
			(
				(size.x - textWidth) / 2,
				(size.y - textHeight) / 2
			);
		}
		else
		{
			textMargins = new Coords
			(
				2,
				(size.y - textHeight) / 2
			);
		}

		var drawPos = pos.clone().add(textMargins);
		display.drawText(text, this.fontHeightInPixels, drawPos, display.colorFore);				
	}
}
