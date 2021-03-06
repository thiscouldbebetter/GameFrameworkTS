
namespace ThisCouldBeBetter.GameFramework
{

export class ControlButton extends ControlBase
{
	text: string;
	hasBorder: boolean;
	_isEnabled: any;
	click: any;
	context: any;
	canBeHeldDown: boolean;

	_drawLoc: Disposition;
	_sizeHalf: Coords;

	constructor
	(
		name: string,
		pos: Coords,
		size: Coords,
		text: string,
		fontHeightInPixels: number,
		hasBorder: boolean,
		isEnabled: any,
		click: any,
		context: any,
		canBeHeldDown: boolean
	)
	{
		super(name, pos, size, fontHeightInPixels);
		this.text = text;
		this.hasBorder = hasBorder;
		this._isEnabled = isEnabled;
		this.click = click;
		this.context = context;
		this.canBeHeldDown = (canBeHeldDown == null ? false : canBeHeldDown);

		// Helper variables.
		this._drawLoc = Disposition.create();
		this._sizeHalf = Coords.create();
	}

	static from8
	(
		name: string,
		pos: Coords,
		size: Coords,
		text: string,
		fontHeightInPixels: number,
		hasBorder: boolean,
		isEnabled: any,
		click: any
	)
	{
		return new ControlButton
		(
			name, pos, size, text, fontHeightInPixels, hasBorder,
			isEnabled, click, null, null
		);
	}

	static from9
	(
		name: string,
		pos: Coords,
		size: Coords,
		text: string,
		fontHeightInPixels: number,
		hasBorder: boolean,
		isEnabled: any,
		click: any,
		context: any
	)
	{
		return new ControlButton
		(
			name, pos, size, text, fontHeightInPixels, hasBorder,
			isEnabled, click, context, null
		);
	}

	actionHandle(actionNameToHandle: string, universe: Universe)
	{
		if (actionNameToHandle == ControlActionNames.Instances().ControlConfirm)
		{
			this.click(this.context);
		}

		return (this.canBeHeldDown == false); // wasActionHandled
	}

	isEnabled()
	{
		return (this._isEnabled.get == null ? this._isEnabled : this._isEnabled.get() );
	}

	// events

	mouseClick(clickPos: Coords)
	{
		if (this.isEnabled())
		{
			this.click(this.context);
		}
		return (this.canBeHeldDown == false); // wasClickHandled
	}

	scalePosAndSize(scaleFactor: Coords)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
	}

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition, style: ControlStyle)
	{
		var drawPos = this._drawLoc.overwriteWith(drawLoc).pos;
		drawPos.add(this.pos);

		var isEnabled = this.isEnabled();
		var isHighlighted = this.isHighlighted && isEnabled;

		style = style || this.style(universe);
		var colorFill = style.colorFill;
		var colorBorder = style.colorBorder;

		if (this.hasBorder)
		{
			display.drawRectangle
			(
				drawPos, this.size,
				colorFill,
				colorBorder,
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
	}
}

}
