
function ControlTextBox(name, pos, size, text, fontHeightInPixels)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.text = text;
	this.fontHeightInPixels = fontHeightInPixels;

	this.isHighlighted = false;
	this.cursorPos = this.text.length;
}

{
	ControlTextBox.prototype.actionHandle = function(actionNameToHandle)
	{
		if (actionNameToHandle == "ControlCancel")
		{
			this.text = this.text.substr(0, this.text.length - 1);

			this.cursorPos = NumberHelper.wrapValueToRangeMinMax
			(
				this.cursorPos - 1, 0, this.text.length + 1
			);
		}
		else if (actionNameToHandle == "ControlConfirm")
		{
			this.cursorPos = NumberHelper.wrapValueToRangeMinMax
			(
				this.cursorPos + 1, 0, this.text.length + 1
			);
		}
		else if 
		(
			actionNameToHandle == "ControlIncrement" 
			|| actionNameToHandle == "ControlDecrement"
		)
		{
			// This is a bit counterintuitive.
			var direction = (actionNameToHandle == "ControlIncrement" ? -1 : 1); 
 
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
		else if (actionNameToHandle.length == 1) // printable character
		{
			this.text = 
				this.text.substr(0, this.cursorPos)
				+ actionNameToHandle
				+ this.text.substr(this.cursorPos);

			this.cursorPos = NumberHelper.wrapValueToRangeMinMax
			(
				this.cursorPos + 1, 0, this.text.length + 1
			);
			
			Globals.Instance.inputHelper.inputInactivate(actionNameToHandle);
		}
	}
	
	ControlTextBox.prototype.focusGain = function()
	{
		this.isHighlighted = true;
	}

	ControlTextBox.prototype.focusLose = function()
	{
		this.isHighlighted = false;
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
		);

		var textWidth = display.textWidthForFontHeight(text, this.fontHeightInPixels);
		var textSize = new Coords(textWidth, this.fontHeightInPixels);
		var textMargin = size.clone().subtract(textSize).divideScalar(2);
		var drawPos = pos.clone().add(textMargin);
		display.drawText
		(
			text, 
			this.fontHeightInPixels, 
			drawPos, 
			display.colorFore, display.colorBack, control.isHighlighted
		);

		if (control.isHighlighted == true)
		{
			var textBeforeCursor = control.text.substr(0, control.cursorPos);
			var textAtCursor = control.text.substr(control.cursorPos, 1);
			var cursorX = display.textWidthForFontHeight
			(
				textBeforeCursor, this.fontHeightInPixels
			);
			var cursorWidth = display.textWidthForFontHeight
			(
				textAtCursor, this.fontHeightInPixels
			);
			drawPos.x += cursorX;
			
			display.drawRectangle
			(
				drawPos,
				new Coords(cursorWidth, this.fontHeightInPixels), // size
				display.colorBack, 
				display.colorBack
			);
			
			display.drawText
			(
				textAtCursor,
				this.fontHeightInPixels,
				drawPos,
				display.colorFore
			);
		}
	}

}
