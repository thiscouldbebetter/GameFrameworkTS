
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
				"Z".charCodeAt(0) + 1
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
	
	// drawable
	
	ControlTextBox.prototype.draw = function()
	{
		var control = this;
		var display = Globals.Instance.display;
		
		var pos = control.pos;
		var size = control.size;

		var text = control.text;

		display.drawRectangle
		(
			pos, size, 
			display.colorBack, display.colorFore,
			control.isHighlighted // areColorsReversed
		)

		var textWidth = display.graphics.measureText(text).width;
		var textSize = new Coords(textWidth, display.fontHeightInPixels);
		var textMargin = size.clone().subtract(textSize).divideScalar(2);
		var drawPos = pos.clone().add(textMargin);
		display.drawText(text, drawPos, display.colorFore, display.colorBack, control.isHighlighted);				

		if (control.isHighlighted == true)
		{
			var textBeforeCursor = control.text.substr(0, control.cursorPos);
			var textAtCursor = control.text.substr(control.cursorPos, 1);
			var cursorX = display.graphics.measureText(textBeforeCursor).width;
			var cursorWidth = display.graphics.measureText(textAtCursor).width;
			drawPos.x += cursorX;
			
			display.drawRectangle
			(
				drawPos,
				new Coords(cursorWidth, display.fontHeightInPixels), // size
				display.colorBack, 
				display.colorBack
			);
			
			display.drawText
			(
				textAtCursor,
				drawPos,
				display.colorFore
			)
		}
	}

}
