
namespace ThisCouldBeBetter.GameFramework
{

export class ControlTextBox<TContext> extends ControlBase
{
	_text: DataBinding<TContext, string>;
	charsMax: number;
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
		charsMax: number,
		isEnabled: DataBinding<TContext,boolean>
	)
	{
		fontNameAndHeight = fontNameAndHeight || FontNameAndHeight.default();

		super(name, pos, size, fontNameAndHeight);

		this._text = text;
		this.charsMax = charsMax;
		this._isEnabled = isEnabled;

		this.cursorPos = null;

		// Helper variables.
		this._drawPos = Coords.create();
		this._drawPosText = Coords.create();
		this._drawLoc = Disposition.fromPos(this._drawPos);
		this._textMargin = Coords.create();
		this._textSize = Coords.create();
	}

	static fromNamePosSizeAndTextBinding<TContext>
	(
		name: string,
		pos: Coords,
		size: Coords,
		textBinding: DataBinding<TContext,string>
	)
	{
		return new ControlTextBox
		(
			name, pos, size, textBinding,
			null, null, null
		);
	}

	static fromNamePosSizeTextFontCharsMaxAndIsEnabled<TContext>
	(
		name: string,
		pos: Coords,
		size: Coords,
		text: DataBinding<TContext,string>,
		fontNameAndHeight: FontNameAndHeight,
		charsMax: number,
		isEnabled: DataBinding<TContext,boolean>
	)
	{
		return new ControlTextBox<TContext>
		(
			name, pos, size, text, fontNameAndHeight, charsMax, isEnabled
		);
	}

	static fromPosSizeAndTextBinding<TContext>
	(
		pos: Coords,
		size: Coords,
		textBinding: DataBinding<TContext,string>
	)
	{
		return new ControlTextBox
		(
			null, pos, size, textBinding,
			null, null, null
		);
	}

	static fromPosSizeAndTextImmediate
	(
		pos: Coords,
		size: Coords,
		textImmediate: string
	)
	{
		var name = ControlTextBox.name + textImmediate;
		var textAsBinding = DataBinding.fromContext<string>(textImmediate);
		return new ControlTextBox<string>
		(
			name,
			pos, size, textAsBinding,
			null, null, null
		);
	}

	charsMaxSet(value: number): ControlTextBox<TContext>
	{
		this.charsMax = value;
		return this;
	}

	text(): string
	{
		return this._text.get();
	}

	textSet(value: string): ControlTextBox<TContext>
	{
		this._text.set(value);
		return this;
	}

	// events

	actionHandle(actionNameToHandle: string, universe: Universe): boolean
	{
		var wasActionHandled = true;

		var text = this.text();

		var controlActionNames = ControlActionNames.Instances();
		if
		(
			actionNameToHandle == controlActionNames.ControlCancel
			|| actionNameToHandle == Input.Instances().Backspace.name
		)
		{
			if (text.length > 0)
			{
				text = text.substr(0, text.length - 1);
				this.textSet(text);

				this.cursorPos = NumberHelper.wrapToRangeMinMax
				(
					this.cursorPos - 1, 0, text.length + 1
				);
			}
		}
		else if (actionNameToHandle == controlActionNames.ControlPrev)
		{
			if (this.cursorPos == 0)
			{
				wasActionHandled = false;
			}
			else
			{
				this.cursorPos = NumberHelper.wrapToRangeMinMax
				(
					this.cursorPos - 1, 0, text.length + 1
				);
			}
		}
		else if
		(
			actionNameToHandle == controlActionNames.ControlNext
			|| actionNameToHandle == controlActionNames.ControlConfirm
		)
		{
			if (this.cursorPos >= text.length)
			{
				wasActionHandled = false;
			}
			else if (text.length >= this.charsMax)
			{
				wasActionHandled = false;
			}
			else
			{
				this.cursorPos = NumberHelper.wrapToRangeMinMax
				(
					this.cursorPos + 1, 0, text.length + 1
				);
			}
		}
		else if
		(
			actionNameToHandle == controlActionNames.ControlIncrement
			|| actionNameToHandle == controlActionNames.ControlDecrement
		)
		{
			if (this.cursorPos < this.charsMax)
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

				this.textSet(textEdited);
			}
		}
		else if (actionNameToHandle.length == 1)
		{
			// Printable character.

			if
			(
				this.charsMax == null
				|| text.length < this.charsMax
			)
			{
				var textEdited =
					text.substr(0, this.cursorPos)
						+ actionNameToHandle
						+ text.substr(this.cursorPos);

				this.textSet(textEdited);
				text = this.text();

				this.cursorPos = NumberHelper.wrapToRangeMinMax
				(
					this.cursorPos + 1, 0, text.length + 1
				);
			}
		}

		return wasActionHandled;
	}

	focusGain(): void
	{
		this.isHighlighted = true;
		this.cursorPos = this.text().length;
	}

	focusLose(): void
	{
		this.isHighlighted = false;
		this.cursorPos = null;
	}

	isEnabled(): boolean
	{
		return this._isEnabled == null ? true : this._isEnabled.get();
	}

	mouseClick(mouseClickPos: Coords): boolean
	{
		var parent = this.parent;
		var parentAsContainer = parent as ControlContainer;
		parentAsContainer.indexOfChildWithFocusSet
		(
			parentAsContainer.children.indexOf(this)
		);
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

		var text = this.text();
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
