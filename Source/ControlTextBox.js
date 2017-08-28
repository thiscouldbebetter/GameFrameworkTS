
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
	
	ControlTextBox.prototype.drawToDisplayAtLoc = function(display, drawLoc)
	{
		var drawPos = drawLoc.pos.add(this.pos);

		var text = this.text;

		display.drawRectangle
		(
			drawPos, this.size, 
			display.colorBack, display.colorFore,
			this.isHighlighted // areColorsReversed
		);

		var textWidth = display.textWidthForFontHeight(text, this.fontHeightInPixels);
		var textSize = new Coords(textWidth, this.fontHeightInPixels);
		var textMargin = this.size.clone().subtract(textSize).divideScalar(2);
		var drawPos2 = drawPos.clone().add(textMargin);
		display.drawText
		(
			text, 
			this.fontHeightInPixels, 
			drawPos2, 
			display.colorFore, display.colorBack, this.isHighlighted
		);

		if (this.isHighlighted == true)
		{
			var textBeforeCursor = this.text.substr(0, this.cursorPos);
			var textAtCursor = this.text.substr(this.cursorPos, 1);
			var cursorX = display.textWidthForFontHeight
			(
				textBeforeCursor, this.fontHeightInPixels
			);
			var cursorWidth = display.textWidthForFontHeight
			(
				textAtCursor, this.fontHeightInPixels
			);
			drawPos2.x += cursorX;
			
			display.drawRectangle
			(
				drawPos2,
				new Coords(cursorWidth, this.fontHeightInPixels), // size
				display.colorBack, 
				display.colorBack
			);
			
			display.drawText
			(
				textAtCursor,
				this.fontHeightInPixels,
				drawPos2,
				display.colorFore
			);
		}
	}

}
