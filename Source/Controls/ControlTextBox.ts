
namespace ThisCouldBeBetter.GameFramework
{

export class ControlTextBox<TContext> extends ControlBase
{
	_text: DataBinding<TContext, string>;
	numberOfCharsMax: number;
	_isEnabled: DataBinding<TContext,boolean>;

	cursorPos: number;

	_drawPos: Coords;
	_drawPosText: Coords;
	_drawLoc: Disposition;
	_textMargin: Coords;
	_textSize: Coords;

	constructor
	(
		name: string,
		pos: Coords,
		size: Coords,
		text: DataBinding<TContext,string>,
		fontNameAndHeight: FontNameAndHeight,
		numberOfCharsMax: number,
		isEnabled: DataBinding<TContext,boolean>
	)
	{
		super(name, pos, size, fontNameAndHeight);
		this._text = text;
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

	text(value: string): string
	{
		if (value != null)
		{
			this._text.set(value);
		}

		return this._text.get();
	}

	// events

	actionHandle(actionNameToHandle: string, universe: Universe): boolean
	{
		var text = this.text(null);

		var controlActionNames = ControlActionNames.Instances();
		if
		(
			actionNameToHandle == controlActionNames.ControlCancel
			|| actionNameToHandle == Input.Names().Backspace
		)
		{
			this.text(text.substr(0, text.length - 1));

			this.cursorPos = NumberHelper.wrapToRangeMinMax
			(
				this.cursorPos - 1, 0, text.length + 1
			);
		}
		else if (actionNameToHandle == controlActionNames.ControlConfirm)
		{
			this.cursorPos = NumberHelper.wrapToRangeMinMax
			(
				this.cursorPos + 1, 0, text.length + 1
			);
		}
		else if
		(
			actionNameToHandle == controlActionNames.ControlIncrement
			|| actionNameToHandle == controlActionNames.ControlDecrement
		)
		{
			// This is a bit counterintuitive.
			var direction =
			(
				actionNameToHandle == controlActionNames.ControlIncrement
				? -1
				: 1
			);

			var charCodeAtCursor =
			(
				this.cursorPos < text.length
				? text.charCodeAt(this.cursorPos)
				: "A".charCodeAt(0) - 1
			);

			if 
			(
				charCodeAtCursor == "Z".charCodeAt(0)
				&& direction == 1
			)
			{
				charCodeAtCursor = "a".charCodeAt(0);
			}
			else if 
			(
				charCodeAtCursor == "a".charCodeAt(0)
				&& direction == -1
			)
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

			this.text(textEdited);
		}
		else if (actionNameToHandle.length == 1)
		{
			// Printable character.

			if
			(
				this.numberOfCharsMax == null
				|| text.length < this.numberOfCharsMax
			)
			{
				var textEdited =
					text.substr(0, this.cursorPos)
						+ actionNameToHandle
						+ text.substr(this.cursorPos);

				text = this.text(textEdited);

				this.cursorPos = NumberHelper.wrapToRangeMinMax
				(
					this.cursorPos + 1, 0, text.length + 1
				);
			}
		}

		return true; // wasActionHandled
	}

	focusGain(): void
	{
		this.isHighlighted = true;
		this.cursorPos = this.text(null).length;
	}

	focusLose(): void
	{
		this.isHighlighted = false;
		this.cursorPos = null;
	}

	isEnabled(): boolean
	{
		return this._isEnabled.get();
	}

	mouseClick(mouseClickPos: Coords): boolean
	{
		var parent = this.parent;
		var parentAsContainer = parent as ControlContainer;
		parentAsContainer.indexOfChildWithFocus =
			parentAsContainer.children.indexOf(this);
		this.isHighlighted = true;
		return true;
	}

	mouseEnter(): void {}

	mouseExit(): void {}

	scalePosAndSize(scaleFactor: Coords): ControlBase
	{
		return super.scalePosAndSize(scaleFactor);
	}

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition): void
	{
		var fontHeightInPixels = this.fontNameAndHeight.heightInPixels;

		var drawPos =
			this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		var style = this.style(universe);

		var text = this.text(null);
		var textWidth =
			display.textWidthForFontHeight(text, fontHeightInPixels);
		var textSize =
			this._textSize.overwriteWithDimensions(textWidth, fontHeightInPixels, 0);
		var textMargin =
			this._textMargin.overwriteWith(this.size).subtract(textSize).half();
		var drawPosText =
			this._drawPosText.overwriteWith(drawPos).add(textMargin);

		style.drawBoxOfSizeAtPosWithColorsToDisplay
		(
			this.size, drawPos,
			style.colorFill(), style.colorBorder(),
			this.isHighlighted,
			display
		);

		if (this.isHighlighted == false)
		{
			display.drawTextWithFontAtPosWithColorsFillAndOutline
			(
				text,
				this.fontNameAndHeight,
				drawPosText,
				style.colorBorder(),
				style.colorFill(),
				false, // isCenteredHorizontally
				false, // isCenteredVertically
				this.size
			);
		}
		else
		{
			display.drawTextWithFontAtPosWithColorsFillAndOutline
			(
				text,
				this.fontNameAndHeight,
				drawPosText,
				style.colorFill(),
				style.colorBorder(),
				false, // isCenteredHorizontally
				false, // isCenteredVertically
				this.size
			);

			var textBeforeCursor = text.substr(0, this.cursorPos);
			var textAtCursor = text.substr(this.cursorPos, 1);
			var cursorX = display.textWidthForFontHeight
			(
				textBeforeCursor, fontHeightInPixels
			);
			var cursorWidth = display.textWidthForFontHeight
			(
				textAtCursor, fontHeightInPixels
			);
			drawPosText.x += cursorX;

			style.drawBoxOfSizeAtPosWithColorsToDisplay
			(
				Coords.fromXY(cursorWidth, fontHeightInPixels), // size
				drawPosText,
				style.colorFill(),
				style.colorFill(), // ?
				this.isHighlighted,
				display
			);

			display.drawTextWithFontAtPosWithColorsFillAndOutline
			(
				textAtCursor,
				this.fontNameAndHeight,
				drawPosText,
				style.colorBorder(),
				null, // colorBack
				false, // isCenteredHorizontally
				false, // isCenteredVertically
				this.size
			);
		}
	}
}

}
