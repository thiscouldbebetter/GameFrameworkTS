
function ControlTextBox(name, pos, size, text)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.text = text;

	this.isHighlighted = false;
	this.cursorPos = this.text.length;
}

{
	ControlTextBox.prototype.draw = function()
	{
		Globals.Instance.display.drawControlTextBox(this);
	}

	ControlTextBox.prototype.focusGain = function()
	{
		this.isHighlighted = true;
	}

	ControlTextBox.prototype.focusLose = function()
	{
		this.isHighlighted = false;
	}
	
	ControlTextBox.prototype.inputHandle = function(inputToHandle)
	{
		if (inputToHandle == "Backspace")
		{
			this.text = this.text.substr(0, this.text.length - 1);

			this.cursorPos = NumberHelper.wrapValueToRangeMinMax
			(
				this.cursorPos - 1, 0, this.text.length + 1
			);
		}
		else if (inputToHandle == "Enter" || inputToHandle == "Delete")
		{
			var direction = (inputToHandle == "Delete" ? -1 : 1);

			this.cursorPos = NumberHelper.wrapValueToRangeMinMax
			(
				this.cursorPos + direction, 0, this.text.length + 1
			);
		}
		else if (inputToHandle == "ArrowDown" || inputToHandle == "ArrowUp")
		{
			var direction = (inputToHandle == "ArrowDown" ? -1 : 1);

			var charCodeAtCursor = 
			(
				this.cursorPos < this.text.length ? this.text.charCodeAt(this.cursorPos) : "A".charCodeAt(0) - 1
			);
						
			charCodeAtCursor = NumberHelper.wrapValueToRangeMinMax
			(
				charCodeAtCursor + direction, 
				"A".charCodeAt(0), 
				"Z".charCodeAt(0)
			);

			var charAtCursor = String.fromCharCode(charCodeAtCursor);

			this.text = 
				this.text.substr(0, this.cursorPos)
				+ charAtCursor
				+ this.text.substr(this.cursorPos + 1); 
		}
		else if (inputToHandle.length == 1) // printable character
		{
			this.text = 
				this.text.substr(0, this.cursorPos)
				+ inputToHandle
				+ this.text.substr(this.cursorPos);

			this.cursorPos = NumberHelper.wrapValueToRangeMinMax
			(
				this.cursorPos + 1, 0, this.text.length + 1
			);
		}
	}

	ControlTextBox.prototype.mouseClick = function(mouseClickPos)
	{
		var parent = this.parent;
		parent.indexOfChildWithFocus = parent.children.indexOf(this);
		this.isHighlighted = true;
	}
}
