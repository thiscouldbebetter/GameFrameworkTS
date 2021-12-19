
namespace ThisCouldBeBetter.GameFramework
{

export class ControlButton<TContext> extends ControlBase
{
	text: string;
	hasBorder: boolean;
	_isEnabled: DataBinding<TContext, boolean>;
	click: () => void;
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
		isEnabled: DataBinding<TContext, boolean>,
		click: () => void,
		canBeHeldDown: boolean
	)
	{
		super(name, pos, size, fontHeightInPixels);
		this.text = text;
		this.hasBorder = hasBorder;
		this._isEnabled = isEnabled;
		this.click = click;
		this.canBeHeldDown = (canBeHeldDown == null ? false : canBeHeldDown);

		// Helper variables.
		this._drawLoc = Disposition.create();
		this._sizeHalf = Coords.create();
	}

	static from8<TContext>
	(
		name: string,
		pos: Coords,
		size: Coords,
		text: string,
		fontHeightInPixels: number,
		hasBorder: boolean,
		isEnabled: DataBinding<TContext, boolean>,
		click: () => void
	)
	{
		return new ControlButton
		(
			name, pos, size, text, fontHeightInPixels, hasBorder,
			isEnabled, click, false // canBeHeldDown
		);
	}

	actionHandle(actionNameToHandle: string, universe: Universe): boolean
	{
		if (actionNameToHandle == ControlActionNames.Instances().ControlConfirm)
		{
			this.click();
		}

		return (this.canBeHeldDown == false); // wasActionHandled
	}

	isEnabled(): boolean
	{
		return this._isEnabled.get();
	}

	// events

	mouseClick(clickPos: Coords): boolean
	{
		if (this.isEnabled())
		{
			this.click();
		}
		return (this.canBeHeldDown == false); // wasClickHandled
	}

	scalePosAndSize(scaleFactor: Coords): void
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
	}

	// drawable

	draw
	(
		universe: Universe, display: Display, drawLoc: Disposition, style: ControlStyle
	): void
	{
		var drawPos = this._drawLoc.overwriteWith(drawLoc).pos;
		drawPos.add(this.pos);

		var isEnabled = this.isEnabled();
		var isHighlighted = this.isHighlighted && isEnabled;

		style = style || this.style(universe);
		var colorFill = style.colorFill();
		var colorBorder = style.colorBorder();

		if (this.hasBorder)
		{
			style.drawBoxOfSizeAtPosWithColorsToDisplay
			(
				this.size, drawPos, colorFill, colorBorder, isHighlighted, display
			);
		}

		// drawPos.add(this._sizeHalf.overwriteWith(this.size).half());

		var colorText = (isEnabled ? colorBorder : style.colorDisabled());

		display.drawText
		(
			this.text,
			this.fontHeightInPixels,
			drawPos,
			(isHighlighted ? colorFill : colorText),
			(isHighlighted ? colorText : colorFill),
			true, // isCenteredHorizontally
			true, // isCenteredVertically
			this.size // sizeMaxInPixels
		);
	}
}

}
