
function ControlTextBox(name, pos, size, text)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.text = text;

	this.isHighlighted = false;
}

{
	ControlTextBox.prototype.draw = function()
	{
		Globals.Instance.displayHelper.drawControlTextBox(this);
	}
	
	ControlTextBox.prototype.keyPressed = function(keyCodePressed, isShiftKeyPressed)
	{
		if (keyCodePressed == 8) // backspace
		{
			this.text = this.text.substr(0, this.text.length - 1);
		}
		else
		{
			var charTyped = String.fromCharCode(keyCodePressed);
			if (isShiftKeyPressed == false)
			{
				charTyped = charTyped.toLowerCase();
			}
			this.text += charTyped;
		}
	}

	ControlTextBox.prototype.mouseClick = function(mouseClickPos)
	{
		var parent = this.parent;
		parent.indexOfChildWithFocus = parent.children.indexOf(this);
		this.isHighlighted = true;
	}
}
