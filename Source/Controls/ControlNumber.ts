
namespace ThisCouldBeBetter.GameFramework
{

export class ControlNumber<TContext> extends ControlBase
{
	_value: DataBinding<TContext, number>;
	_valueMin: DataBinding<TContext, number>;
	_valueMax: DataBinding<TContext, number>;
	_isEnabled: DataBinding<TContext, boolean>;

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
		value: DataBinding<TContext, number>,
		valueMin: DataBinding<TContext, number>,
		valueMax: DataBinding<TContext, number>,
		fontHeightInPixels: number,
		isEnabled: DataBinding<TContext, boolean>,
	)
	{
		super(name, pos, size, fontHeightInPixels);
		this._value = value;
		this._valueMin = valueMin;
		this._valueMax = valueMax;
		this.fontHeightInPixels = fontHeightInPixels;
		this._isEnabled = isEnabled;

		this.cursorPos = null;

		// Helper variables.
		this._drawPos = Coords.create();
		this._drawPosText = Coords.create();
		this._drawLoc = Disposition.fromPos(this._drawPos);
		this._textMargin = Coords.create();
		this._textSize = Coords.create();
	}

	numberOfDigitsMax(): number
	{
		return Math.ceil
		(
			Math.log(this.valueMax()) / Math.log(10)
		);
	}

	value(): number
	{
		return this._value.get();
	}

	valueMin(): number
	{
		return this._valueMin.get();
	}

	valueMax(): number
	{
		return this._valueMax.get();
	}

	valueSet(valueToSet: number): void
	{
		this._value.set(valueToSet);
	}

	// events

	actionHandle(actionNameToHandle: string, universe: Universe): boolean
	{
		var value = this.value();
		var valueAsString = value.toString();

		var controlActionNames = ControlActionNames.Instances();
		if
		(
			actionNameToHandle == controlActionNames.ControlCancel
			|| actionNameToHandle == Input.Names().Backspace
		)
		{
			valueAsString = valueAsString.substr(0, valueAsString.length - 1);
			value = parseFloat(valueAsString);
			this.valueSet(value);

			this.cursorPos = NumberHelper.wrapToRangeMinMax
			(
				this.cursorPos - 1, 0, valueAsString.length + 1
			);
		}
		else if (actionNameToHandle == controlActionNames.ControlConfirm)
		{
			this.cursorPos = NumberHelper.wrapToRangeMinMax
			(
				this.cursorPos + 1, 0, valueAsString.length + 1
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

			var valueOld = this.value();
			var valueNew = valueOld + direction;

			if (valueNew < this.valueMin())
			{
				valueNew = this.valueMin();
			}
			else if (valueNew > this.valueMax())
			{
				valueNew = this.valueMax();
			}

			this.valueSet(valueNew);
		}
		else if 
		(
			actionNameToHandle.length == 1
			|| actionNameToHandle.startsWith("_")
		)
		{
			// Printable character.

			if (actionNameToHandle.startsWith("_"))
			{
				actionNameToHandle = actionNameToHandle.substr(1);
			}

			if
			(
				this.numberOfDigitsMax() == null
				|| this.value.toString().length < this.numberOfDigitsMax()
			)
			{
				var valueAsStringEdited =
					valueAsString.substr(0, this.cursorPos)
						+ actionNameToHandle
						+ valueAsString.substr(this.cursorPos);

				value = parseFloat(valueAsStringEdited);
				this.valueSet(value);

				this.cursorPos = NumberHelper.wrapToRangeMinMax
				(
					this.cursorPos + 1, 0, valueAsStringEdited.length + 1
				);
			}
		}

		return true; // wasActionHandled
	}

	focusGain(): void
	{
		this.isHighlighted = true;
		this.cursorPos = this.value.toString().length;
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

	scalePosAndSize(scaleFactor: Coords): ControlNumber<TContext>
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
		return this;
	}

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition): void
	{
		var drawPos =
			this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		var style = this.style(universe);

		var text = this.value().toString();
		var textWidth =
			display.textWidthForFontHeight(text, this.fontHeightInPixels);
		var textSize =
			this._textSize.overwriteWithDimensions(textWidth, this.fontHeightInPixels, 0);
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
			display.drawText
			(
				text,
				this.fontHeightInPixels,
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
			display.drawText
			(
				text,
				this.fontHeightInPixels,
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
				textBeforeCursor, this.fontHeightInPixels
			);
			var cursorWidth = display.textWidthForFontHeight
			(
				textAtCursor, this.fontHeightInPixels
			);
			drawPosText.x += cursorX;

			style.drawBoxOfSizeAtPosWithColorsToDisplay
			(
				Coords.fromXY(cursorWidth, this.fontHeightInPixels), // size
				drawPosText,
				style.colorFill(),
				style.colorFill(), // ?
				this.isHighlighted,
				display
			);

			display.drawText
			(
				textAtCursor,
				this.fontHeightInPixels,
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
