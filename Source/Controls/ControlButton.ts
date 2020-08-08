
class ControlButton implements Control
{
	name: string;
	pos: Coords;
	size: Coords;
	text: string;
	fontHeightInPixels: number;
	hasBorder: boolean;
	_isEnabled: any;
	click: any;
	context: any;
	canBeHeldDown: boolean;

	isHighlighted: boolean;
	parent: Control;
	styleName: string;

	_drawLoc: Disposition;
	_sizeHalf: Coords;

	constructor
	(
		name: string, pos: Coords, size: Coords, text: string,
		fontHeightInPixels: number, hasBorder: boolean, isEnabled: any,
		click: any, context: any, canBeHeldDown: boolean)
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
		this._drawLoc = new Disposition(new Coords(0, 0, 0), Orientation.default(), null);
		this._sizeHalf = new Coords(0, 0, 0);
	}

	actionHandle(actionNameToHandle: string, universe: Universe)
	{
		if (actionNameToHandle == ControlActionNames.Instances().ControlConfirm)
		{
			this.click(this.context);
		}

		return (this.canBeHeldDown == false); // wasActionHandled
	};

	actionToInputsMappings(): ActionToInputsMapping[]
	{
		return null; // todo
	}

	childWithFocus(): Control
	{
		return null;
	}

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

	mouseClick(clickPos: Coords)
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

	mouseMove(movePos: Coords) {}

	scalePosAndSize(scaleFactor: Coords)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
	};

	style(universe: Universe)
	{
		return universe.controlBuilder.stylesByName.get(this.styleName == null ? "Default" : this.styleName);
	};

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition)
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
				Color.systemColorGet(colorFill),
				Color.systemColorGet(colorBorder),
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
			Color.systemColorGet(colorText),
			Color.systemColorGet(colorFill),
			isHighlighted,
			true, // isCentered
			this.size.x // widthMaxInPixels
		);
	};
}
