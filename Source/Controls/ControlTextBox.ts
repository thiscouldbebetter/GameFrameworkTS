
namespace ThisCouldBeBetter.GameFramework
{

export class ControlTextBox extends ControlBase
{
	_text: any;
	numberOfCharsMax: number;
	_isEnabled: DataBinding<any,boolean>;

	cursorPos: number;

	_drawPos: Coords;
	_drawPosText: Coords;
	_drawLoc: Disposition;
	_textMargin: Coords;
	_textSize: Coords;

	constructor
	(
		name: string, pos: Coords, size: Coords, text: any,
		fontHeightInPixels: number, numberOfCharsMax: number,
		isEnabled: DataBinding<any,boolean>
	)
	{
		super(name, pos, size, fontHeightInPixels);
		this._text = text;
		this.fontHeightInPixels = fontHeightInPixels;
		this.numberOfCharsMax = numberOfCharsMax;
		this._isEnabled = isEnabled;

		this.cursorPos = null;

		// Helper variables.
		this._drawPos = Coords.create();
		this._drawPosText = Coords.create();
		this._drawLoc = Disposition.fromPos(this._drawPos);
		this._textMargin = Coords.create();
		this._textSize = Coords.create();
	}

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
	}

	// events

	actionHandle(actionNameToHandle: string, universe: Universe): boolean
	{
		var text = this.text(null, null);

		var controlActionNames = ControlActionNames.Instances();
		if
		(
			actionNameToHandle == controlActionNames.ControlCancel
			|| actionNameToHandle == Input.Names().Backspace
		)
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

			var textEdited = text.substr(0, this.cursorPos)
				+ charAtCursor
				+ text.substr(this.cursorPos + 1);

			this.text(textEdited, null);
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
				var textEdited =
					text.substr(0, this.cursorPos)
						+ actionNameToHandle
						+ text.substr(this.cursorPos);

				text = this.text(textEdited, null);

				this.cursorPos = NumberHelper.wrapToRangeMinMax
				(
					this.cursorPos + 1, 0, text.length + 1
				);
			}
		}

		return true; // wasActionHandled
	}

	focusGain()
	{
		this.isHighlighted = true;
		this.cursorPos = this.text(null, null).length;
	}

	focusLose()
	{
		this.isHighlighted = false;
		this.cursorPos = null;
	}

	isEnabled()
	{
		return (this._isEnabled.get());
	}

	mouseClick(mouseClickPos: Coords)
	{
		var parent = this.parent;
		var parentAsContainer = parent as ControlContainer;
		parentAsContainer.indexOfChildWithFocus =
			parentAsContainer.children.indexOf(this);
		this.isHighlighted = true;
		return true;
	}

	scalePosAndSize(scaleFactor: Coords)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
		return this;
	}

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition)
	{
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		var style = this.style(universe);

		var text = this.text(null, null);

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
				new Coords(cursorWidth, this.fontHeightInPixels, 0), // size
				style.colorFill,
				style.colorFill, // ?
				null
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
	}
}

}
