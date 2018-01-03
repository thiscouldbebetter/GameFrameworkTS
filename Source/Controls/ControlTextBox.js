
function ControlTextBox(name, pos, size, text, fontHeightInPixels, numberOfCharsMax)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this._text = text;
	this.fontHeightInPixels = fontHeightInPixels;
	this.numberOfCharsMax = numberOfCharsMax;

	this.isHighlighted = false;
	this.cursorPos = this.text().length;

	// Helper variables.
	this.drawPos = new Coords();
	this.drawPosText = new Coords();
	this.drawLoc = new Location(this.drawPos);
	this.textMargin = new Coords();
	this.textSize = new Coords();
}

{
	ControlTextBox.prototype.style = function(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	}

	ControlTextBox.prototype.text = function(value, universe)
	{
		if (value != null)
		{
			if (this._text.set == null)
			{
				this._text = value;
			}
			else
			{
				this._text.set(value);
			}
		}

		return (this._text.get == null ? this._text : this._text.get(universe) );
	}

	// events

	ControlTextBox.prototype.actionHandle = function(actionNameToHandle)
	{
		var text = this.text();

		if (actionNameToHandle == "ControlCancel")
		{
			this.text(text.substr(0, text.length - 1));

			this.cursorPos = 
			(
				this.cursorPos - 1
			).wrapToRangeMinMax
			(
				0, text.length + 1
			);
		}
		else if (actionNameToHandle == "ControlConfirm")
		{
			this.cursorPos = 
			(
				this.cursorPos + 1
			).wrapToRangeMinMax(0, text.length + 1);
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
				this.cursorPos < text.length ? text.charCodeAt(this.cursorPos) : "A".charCodeAt(0) - 1
			);

			charCodeAtCursor = 
			(
				charCodeAtCursor + direction
			).wrapToRangeMinMax
			(
				"A".charCodeAt(0),
				"Z".charCodeAt(0) + 1
			);

			var charAtCursor = String.fromCharCode(charCodeAtCursor);

			this.text
			(
				text.substr(0, this.cursorPos)
				+ charAtCursor
				+ text.substr(this.cursorPos + 1)
			);
		}
		else if (actionNameToHandle.startsWith("_") && actionNameToHandle.length == "2") // printable character
		{
			if (this.numberOfCharsMax == null || text.length < this.numberOfCharsMax)
			{
				text = this.text
				(
					text.substr(0, this.cursorPos)
					+ actionNameToHandle.substr(1)
					+ text.substr(this.cursorPos)
				);

				this.cursorPos = 
				(
					this.cursorPos + 1
				).wrapToRangeMinMax
				(
					0, text.length + 1
				);
			}
		}

		return true; // wasActionHandled
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

	ControlTextBox.prototype.draw = function(universe, display, drawLoc)
	{
		var drawPos = this.drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		var style = this.style(universe);

		var text = this.text();

		display.drawRectangle
		(
			drawPos, this.size,
			style.colorFill, style.colorBorder,
			this.isHighlighted // areColorsReversed
		);

		var textWidth = display.textWidthForFontHeight(text, this.fontHeightInPixels);
		var textSize = this.textSize.overwriteWithDimensions(textWidth, this.fontHeightInPixels, 0);
		var textMargin = this.textMargin.overwriteWith(this.size).subtract(textSize).half();
		var drawPosText = this.drawPosText.overwriteWith(drawPos).add(textMargin);
		display.drawText
		(
			text,
			this.fontHeightInPixels,
			drawPosText,
			style.colorBorder,
			style.colorFill,
			this.isHighlighted,
			false, // isCentered
			this.size.x // widthMaxInPixels
		);

		if (this.isHighlighted == true)
		{
			var textBeforeCursor = text.substr(0, this.cursorPos);
			var textAtCursor = text.substr(this.cursorPos, 1);
			var cursorX = display.textWidthForFontHeight
			(
				textBeforeCursor, this.fontHeightInPixels
			);
			var cursorWidth = display.textWidthForFontHeight
			(
				textAtCursor, this.fontHeightInPixels
			);
			drawPosText.x += cursorX;

			display.drawRectangle
			(
				drawPosText,
				new Coords(cursorWidth, this.fontHeightInPixels), // size
				style.colorFill,
				style.colorFill
			);

			display.drawText
			(
				textAtCursor,
				this.fontHeightInPixels,
				drawPosText,
				style.colorBorder,
				null, // colorBack
				null, // isHighlighted
				this.size.x // widthMaxInPixels
			);
		}
	}

}
