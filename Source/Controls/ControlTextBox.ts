
class ControlTextBox implements Control
{
	name: string;
	pos: Coords;
	size: Coords;
	_text: any;
	fontHeightInPixels: number;
	numberOfCharsMax: number;

	cursorPos: number;
	isHighlighted: boolean;
	parent: any;
	styleName: string;

	_drawPos: Coords;
	_drawPosText: Coords;
	_drawLoc: Disposition;
	_textMargin: Coords;
	_textSize: Coords;

	constructor(name: string, pos: Coords, size: Coords, text: any, fontHeightInPixels: number, numberOfCharsMax: number)
	{
		this.name = name;
		this.pos = pos;
		this.size = size;
		this._text = text;
		this.fontHeightInPixels = fontHeightInPixels;
		this.numberOfCharsMax = numberOfCharsMax;

		this.isHighlighted = false;
		this.cursorPos = this.text(null, null).length;

		// Helper variables.
		this._drawPos = new Coords(0, 0, 0);
		this._drawPosText = new Coords(0, 0, 0);
		this._drawLoc = new Disposition(this._drawPos, null, null);
		this._textMargin = new Coords(0, 0, 0);
		this._textSize = new Coords(0, 0, 0);
	}

	style(universe: Universe)
	{
		return universe.controlBuilder.stylesByName.get(this.styleName == null ? "Default" : this.styleName);
	};

	text(value: any, universe: Universe)
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

	actionHandle(actionNameToHandle: string, universe: Universe): boolean
	{
		var text = this.text(null, null);

		var controlActionNames = ControlActionNames.Instances();
		if (actionNameToHandle == controlActionNames.ControlCancel)
		{
			this.text(text.substr(0, text.length - 1), null);

			this.cursorPos = NumberHelper.wrapToRangeMinMax
			(
				this.cursorPos - 1, 0, text.length + 1
			);
		}
		else if (actionNameToHandle == controlActionNames.ControlConfirm)
		{
			this.cursorPos = NumberHelper.wrapToRangeMinMax(this.cursorPos + 1, 0, text.length + 1);
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

			if (charCodeAtCursor == "Z".charCodeAt(0) && direction == 1)
			{
				charCodeAtCursor = "a".charCodeAt(0);
			}
			else if (charCodeAtCursor == "a".charCodeAt(0) && direction == -1)
			{
				charCodeAtCursor = "Z".charCodeAt(0);
			}
			else
			{
				charCodeAtCursor = charCodeAtCursor + direction;
			}

			charCodeAtCursor = NumberHelper.wrapToRangeMinMax
			(
				charCodeAtCursor,
				"A".charCodeAt(0),
				"z".charCodeAt(0) + 1
			);

			var charAtCursor = String.fromCharCode(charCodeAtCursor);

			this.text
			(
				text.substr(0, this.cursorPos)
					+ charAtCursor
					+ text.substr(this.cursorPos + 1),
				null
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
						+ text.substr(this.cursorPos),
					null
				);

				this.cursorPos = NumberHelper.wrapToRangeMinMax
				(
					this.cursorPos + 1, 0, text.length + 1
				);
			}
		}

		return true; // wasActionHandled
	};

	actionToInputsMappings(): ActionToInputsMapping[]
	{
		return null; // todo
	}

	childWithFocus(): Control
	{
		return null; // todo
	}

	focusGain()
	{
		this.isHighlighted = true;
	};

	focusLose()
	{
		this.isHighlighted = false;
	};

	isEnabled()
	{
		return true; // todo
	}

	mouseClick(mouseClickPos: Coords)
	{
		var parent = this.parent;
		parent.indexOfChildWithFocus = parent.children.indexOf(this);
		this.isHighlighted = true;
		return true;
	};

	mouseEnter() {}

	mouseExit() {}

	mouseMove(mouseMovePos: Coords) {}

	scalePosAndSize(scaleFactor: Coords)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
		return this;
	};

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition)
	{
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		var style = this.style(universe);

		var text = this.text(null, null);

		display.drawRectangle
		(
			drawPos, this.size,
			Color.systemColorGet(style.colorFill),
			Color.systemColorGet(style.colorBorder),
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
			Color.systemColorGet(style.colorBorder),
			Color.systemColorGet(style.colorFill),
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
				new Coords(cursorWidth, this.fontHeightInPixels, 0), // size
				Color.systemColorGet(style.colorFill),
				Color.systemColorGet(style.colorFill),
				null
			);

			display.drawText
			(
				textAtCursor,
				this.fontHeightInPixels,
				drawPosText,
				Color.systemColorGet(style.colorBorder),
				null, // colorBack
				false, // isHighlighted
				false, // isCentered
				this.size.x // widthMaxInPixels
			);
		}
	};
}
