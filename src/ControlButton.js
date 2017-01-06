
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
	ControlButton.prototype.draw = function()
	{
		Globals.Instance.display.drawControlButton(this);
	}

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
}
