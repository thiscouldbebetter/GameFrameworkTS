
class ControlButton
{
	constructor(name, pos, size, text, fontHeightInPixels, hasBorder, isEnabled, click, context, canBeHeldDown)
	{
		this.name = name;
		this.pos = pos;
		this.size = size;
		this.text = text;
		this.fontHeightInPixels = fontHeightInPixels;
		this.hasBorder = hasBorder;
		this._isEnabled = isEnabled;
		this.click = click;
		this.context = context;
		this.canBeHeldDown = (canBeHeldDown == null ? false : canBeHeldDown);

		this.isHighlighted = false;

		// Helper variables.
		this._drawLoc = new Location(new Coords());
		this._sizeHalf = new Coords();
	}

	actionHandle(actionNameToHandle)
	{
		if (actionNameToHandle == ControlActionNames.Instances().ControlConfirm)
		{
			this.click(this.context);
		}

		return (this.canBeHeldDown == false); // wasActionHandled
	};

	isEnabled()
	{
		return (this._isEnabled.get == null ? this._isEnabled : this._isEnabled.get() );
	};

	// events

	focusGain()
	{
		this.isHighlighted = true;
	};

	focusLose()
	{
		this.isHighlighted = false;
	};

	mouseClick(clickPos)
	{
		if (this.isEnabled())
		{
			this.click(this.context);
		}
		return (this.canBeHeldDown == false); // wasClickHandled
	};

	mouseEnter()
	{
		this.isHighlighted = true;
	};

	mouseExit()
	{
		this.isHighlighted = false;
	};

	scalePosAndSize(scaleFactor)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
	};

	style(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	};

	// drawable

	draw(universe, display, drawLoc)
	{
		var drawPos = this._drawLoc.overwriteWith(drawLoc).pos;
		drawPos.add(this.pos);

		var isEnabled = this.isEnabled();
		var isHighlighted = this.isHighlighted && isEnabled;

		var style = this.style(universe);
		var colorFill = style.colorFill;
		var colorBorder = style.colorBorder;

		if (this.hasBorder)
		{
			display.drawRectangle
			(
				drawPos, this.size,
				colorFill, colorBorder,
				isHighlighted // areColorsReversed
			);
		}

		drawPos.add(this._sizeHalf.overwriteWith(this.size).half());

		var colorText = (isEnabled ? colorBorder : style.colorDisabled);

		display.drawText
		(
			this.text,
			this.fontHeightInPixels,
			drawPos,
			colorText,
			colorFill,
			isHighlighted,
			true, // isCentered
			this.size.x // widthMaxInPixels
		);
	};
}
