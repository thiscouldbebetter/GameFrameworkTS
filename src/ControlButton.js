
function ControlButton(name, pos, size, text, click)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.text = text;
	this.click = click;

	this.isHighlighted = false;	
}

{
	ControlButton.prototype.focusGain = function()
	{
		this.isHighlighted = true;
	}

	ControlButton.prototype.focusLose = function()
	{
		this.isHighlighted = false;
	}

	ControlButton.prototype.inputHandle = function(inputToHandle)
	{
		if (inputToHandle == "Enter")
		{
			this.click();
		}
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
	
	ControlButton.prototype.draw = function()
	{
		var control = this;
		var display = Globals.Instance.display;
		
		var pos = control.pos;
		var size = control.size;

		display.drawRectangle
		(
			pos, size, 
			display.colorBack, display.colorFore,
			control.isHighlighted // areColorsReversed
		);

		var text = control.text;

		var textWidth = display.graphics.measureText(text).width;
		var textSize = new Coords(textWidth, display.fontHeightInPixels);
		var textMargin = size.clone().subtract(textSize).divideScalar(2);
		var drawPos = pos.clone().add(textMargin);

		display.drawText(text, drawPos, display.colorFore, display.colorBack, control.isHighlighted);
	}
}
