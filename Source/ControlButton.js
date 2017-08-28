
function ControlButton(name, pos, size, text, fontHeightInPixels, hasBorder, click)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.text = text;
	this.fontHeightInPixels = fontHeightInPixels;
	this.hasBorder = hasBorder;
	this.click = click;

	this.isHighlighted = false;
}

{
	ControlButton.prototype.actionHandle = function(actionNameToHandle)
	{
		if (actionNameToHandle == "ControlConfirm")
		{
			this.click();
		}
	}
	
	ControlButton.prototype.focusGain = function()
	{
		this.isHighlighted = true;
	}

	ControlButton.prototype.focusLose = function()
	{
		this.isHighlighted = false;
	}

	ControlButton.prototype.mouseClick = function(clickPos)
	{
		this.click();
	}

	ControlButton.prototype.mouseEnter = function(mouseMovePos)
	{
		this.isHighlighted = true;
	}

	ControlButton.prototype.mouseExit = function(mouseMovePos)
	{
		this.isHighlighted = false;
	}

	// drawable
	
	ControlButton.prototype.drawToDisplayAtLoc = function(display, drawLoc)
	{	
		var drawPos = drawLoc.pos;
		drawPos.add(this.pos);

		if (this.hasBorder == true)
		{
			display.drawRectangle
			(
				drawPos, this.size, 
				display.colorBack, display.colorFore,
				this.isHighlighted // areColorsReversed
			);
		}

		var text = this.text;

		var textWidth = display.textWidthForFontHeight(text, this.fontHeightInPixels);
		var textSize = new Coords(textWidth, this.fontHeightInPixels);
		var textMargin = this.size.clone().subtract(textSize).divideScalar(2);
		drawPos.add(textMargin);

		display.drawText
		(
			text, 
			this.fontHeightInPixels, 
			drawPos, 
			display.colorFore,
			display.colorBack,
			this.isHighlighted
		);
	}
}
