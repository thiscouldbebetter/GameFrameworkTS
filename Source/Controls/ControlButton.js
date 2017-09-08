
function ControlButton(name, pos, size, text, fontHeightInPixels, hasBorder, isEnabled, click)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.text = text;
	this.fontHeightInPixels = fontHeightInPixels;
	this.hasBorder = hasBorder;
	this._isEnabled = isEnabled;
	this.click = click;

	this.isHighlighted = false;
}

{
	ControlButton.prototype.actionHandle = function(actionNameToHandle)
	{
		if (actionNameToHandle == "ControlConfirm")
		{
			this.click();
		}
	}

	ControlButton.prototype.isEnabled = function()
	{
		return (this._isEnabled.get == null ? this._isEnabled : this._isEnabled.get() );
	}

	// events

	ControlButton.prototype.focusGain = function()
	{
		this.isHighlighted = true;
	}

	ControlButton.prototype.focusLose = function()
	{
		this.isHighlighted = false;
	}

	ControlButton.prototype.mouseClick = function(clickPos)
	{
		if (this.isEnabled() == true)
		{
			this.click();
		}

		return true; // wasClickHandled
	}

	ControlButton.prototype.mouseEnter = function(mouseMovePos)
	{
		this.isHighlighted = true;
	}

	ControlButton.prototype.mouseExit = function(mouseMovePos)
	{
		this.isHighlighted = false;
	}

	ControlButton.prototype.style = function()
	{
		return ControlStyle.Instances[this.styleName == null ? "Default" : this.styleName];
	}

	// drawable

	ControlButton.prototype.drawToDisplayAtLoc = function(display, drawLoc)
	{
		var drawPos = drawLoc.pos.clone();
		drawPos.add(this.pos);

		var isEnabled = this.isEnabled();
		var isHighlighted = this.isHighlighted && isEnabled;

		var style = this.style();
		var colorFill = style.colorFill;
		var colorBorder = (isEnabled == true ? style.colorBorder : style.colorDisabled );

		if (this.hasBorder == true)
		{
			display.drawRectangle
			(
				drawPos, this.size,
				colorFill, colorBorder,
				isHighlighted // areColorsReversed
			);
		}

		drawPos.add(this.size.clone().divideScalar(2));

		display.drawText
		(
			this.text,
			this.fontHeightInPixels,
			drawPos,
			colorBorder,
			colorFill,
			isHighlighted,
			true, // isCentered
			this.size.x // widthMaxInPixels
		);
	}
}
