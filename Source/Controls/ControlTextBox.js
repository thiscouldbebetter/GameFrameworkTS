
class ControlTextBox
{
	constructor(name, pos, size, text, fontHeightInPixels, numberOfCharsMax)
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
		this._drawPos = new Coords();
		this._drawPosText = new Coords();
		this._drawLoc = new Location(this._drawPos);
		this._textMargin = new Coords();
		this._textSize = new Coords();
	}

	style(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	};

	text(value, universe)
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
	};

	// events

	actionHandle(actionNameToHandle)
	{
		var text = this.text();

		var controlActionNames = ControlActionNames.Instances();
		if (actionNameToHandle == controlActionNames.ControlCancel)
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
		else if (actionNameToHandle == controlActionNames.ControlConfirm)
		{
			this.cursorPos =
			(
				this.cursorPos + 1
			).wrapToRangeMinMax(0, text.length + 1);
		}
		else if
		(
			actionNameToHandle == controlActionNames.ControlIncrement
			|| actionNameToHandle == controlActionNames.ControlDecrement
		)
		{
			// This is a bit counterintuitive.
			var direction = (actionNameToHandle == controlActionNames.ControlIncrement ? -1 : 1);

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
		else if (actionNameToHandle.length == 1 || actionNameToHandle.startsWith("_") ) // printable character
		{
			if (actionNameToHandle.startsWith("_"))
			{
				if (actionNameToHandle == "_")
				{
					actionNameToHandle = " ";
				}
				else
				{
					actionNameToHandle = actionNameToHandle.substr(1);
				}
			}

			if (this.numberOfCharsMax == null || text.length < this.numberOfCharsMax)
			{
				text = this.text
				(
					text.substr(0, this.cursorPos)
					+ actionNameToHandle
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
	};

	focusGain()
	{
		this.isHighlighted = true;
	};

	focusLose()
	{
		this.isHighlighted = false;
	};

	mouseClick(mouseClickPos)
	{
		var parent = this.parent;
		parent.indexOfChildWithFocus = parent.children.indexOf(this);
		this.isHighlighted = true;
	};

	// drawable

	draw(universe, display, drawLoc)
	{
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		var style = this.style(universe);

		var text = this.text();

		display.drawRectangle
		(
			drawPos, this.size,
			style.colorFill, style.colorBorder,
			this.isHighlighted // areColorsReversed
		);

		var textWidth =
			display.textWidthForFontHeight(text, this.fontHeightInPixels);
		var textSize =
			this._textSize.overwriteWithDimensions(textWidth, this.fontHeightInPixels, 0);
		var textMargin =
			this._textMargin.overwriteWith(this.size).subtract(textSize).half();
		var drawPosText =
			this._drawPosText.overwriteWith(drawPos).add(textMargin);

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

		if (this.isHighlighted)
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
				false, // isHighlighted
				false, // isCentered
				this.size.x // widthMaxInPixels
			);
		}
	};
}
