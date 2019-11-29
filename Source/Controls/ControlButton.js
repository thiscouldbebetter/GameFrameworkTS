
function ControlButton(name, pos, size, text, fontHeightInPixels, hasBorder, isEnabled, click, context, canBeHeldDown)
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

{
	ControlButton.prototype.actionHandle = function(actionNameToHandle)
	{
		if (actionNameToHandle == "ControlConfirm")
		{
			this.click(this.context);
		}

		return (this.canBeHeldDown == false); // wasActionHandled
	};

	ControlButton.prototype.isEnabled = function()
	{
		return (this._isEnabled.get == null ? this._isEnabled : this._isEnabled.get() );
	};

	// events

	ControlButton.prototype.focusGain = function()
	{
		this.isHighlighted = true;
	};

	ControlButton.prototype.focusLose = function()
	{
		this.isHighlighted = false;
	};

	ControlButton.prototype.mouseClick = function(clickPos)
	{
		if (this.isEnabled())
		{
			this.click(this.context);
		}
		return (this.canBeHeldDown == false); // wasClickHandled
	};

	ControlButton.prototype.mouseEnter = function()
	{
		this.isHighlighted = true;
	};

	ControlButton.prototype.mouseExit = function()
	{
		this.isHighlighted = false;
	};

	ControlButton.prototype.scalePosAndSize = function(scaleFactor)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
	};

	ControlButton.prototype.style = function(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	};

	// drawable

	ControlButton.prototype.draw = function(universe, display, drawLoc)
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
