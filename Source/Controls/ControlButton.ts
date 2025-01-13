
namespace ThisCouldBeBetter.GameFramework
{

export class ControlButton<TContext> extends ControlBase
{
	_text: DataBinding<TContext, string>;
	hasBorder: boolean;
	_isEnabled: DataBinding<TContext, boolean>;
	_click: () => void;
	canBeHeldDown: boolean;

	_drawLoc: Disposition;
	_sizeHalf: Coords;

	constructor
	(
		name: string,
		pos: Coords,
		size: Coords,
		text: DataBinding<TContext, string>,
		fontNameAndHeight: FontNameAndHeight,
		hasBorder: boolean,
		isEnabled: DataBinding<TContext, boolean>,
		click: () => void,
		canBeHeldDown: boolean
	)
	{
		super(name, pos, size, fontNameAndHeight);
		this._text = text;
		this.hasBorder = hasBorder;
		this._isEnabled = isEnabled;
		this._click = click;
		this.canBeHeldDown = canBeHeldDown || false;

		// Helper variables.
		this._drawLoc = Disposition.create();
		this._sizeHalf = Coords.create();
	}

	static from5<TContext>
	(
		pos: Coords,
		size: Coords,
		text: string,
		fontNameAndHeight: FontNameAndHeight,
		click: () => void
	): ControlButton<TContext>
	{
		return ControlButton.fromPosSizeTextFontClick
		(
			pos, size, text, fontNameAndHeight, click
		);
	}

	static fromPosSizeTextFontClick<TContext>
	(
		pos: Coords,
		size: Coords,
		textAsString: string,
		fontNameAndHeight: FontNameAndHeight,
		click: () => void
	): ControlButton<TContext>
	{
		return ControlButton.fromNamePosSizeTextFontBorderEnabledClick
		(
			"button" + textAsString.split(" ").join(""),
			pos,
			size,
			textAsString,
			fontNameAndHeight,
			true, // hasBorder
			DataBinding.fromTrue(), // isEnabled,
			click
		);
	}

	static fromNamePosSizeTextFontBorderEnabledClick<TContext>
	(
		name: string,
		pos: Coords,
		size: Coords,
		textAsString: string,
		fontNameAndHeight: FontNameAndHeight,
		hasBorder: boolean,
		isEnabled: DataBinding<TContext, boolean>,
		click: () => void
	): ControlButton<TContext>
	{
		var textAsBinding = DataBinding.fromGet( (c: TContext) => textAsString);

		return new ControlButton
		(
			name,
			pos,
			size,
			textAsBinding,
			fontNameAndHeight,
			hasBorder,
			isEnabled,
			click,
			false // canBeHeldDown
		);
	}

	static from8WithTextAsBinding<TContext>
	(
		name: string,
		pos: Coords,
		size: Coords,
		textAsBinding: DataBinding<TContext, string>,
		fontNameAndHeight: FontNameAndHeight,
		hasBorder: boolean,
		isEnabled: DataBinding<TContext, boolean>,
		click: () => void
	): ControlButton<TContext>
	{
		return new ControlButton
		(
			name,
			pos,
			size,
			textAsBinding,
			fontNameAndHeight,
			hasBorder,
			isEnabled,
			click,
			false // canBeHeldDown
		);
	}

	static from9<TContext>
	(
		name: string,
		pos: Coords,
		size: Coords,
		textAsString: string,
		fontNameAndHeight: FontNameAndHeight,
		hasBorder: boolean,
		isEnabled: DataBinding<TContext, boolean>,
		click: () => void,
		canBeHeldDown: boolean
	): ControlButton<TContext>
	{
		return new ControlButton
		(
			name,
			pos,
			size,
			DataBinding.fromGet( (c: TContext) => textAsString),
			fontNameAndHeight,
			hasBorder,
			isEnabled,
			click,
			canBeHeldDown
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

	click(): void
	{
		this._click();
	}

	clickSet(value: () => void): ControlButton<TContext>
	{
		this._click = value;
		return this;
	}

	font(universe: Universe): Font
	{
		return this.fontNameAndHeight.font(universe);
	}

	isEnabled(): boolean
	{
		return this._isEnabled.get();
	}

	hasBorderSet(value: boolean): ControlButton<TContext>
	{
		this.hasBorder = value;
		return this;
	}

	initialize(universe: Universe): void
	{
		var font = this.font(universe);
		var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);
		font.load(uwpe, null);
	}

	initializeIsComplete(universe: Universe): boolean
	{
		var font = this.font(universe);
		var fontIsInitialized = font.isLoaded;
		return fontIsInitialized;
	}

	isEnabledSet
	(
		value: DataBinding<TContext, boolean>
	): ControlButton<TContext>
	{
		this._isEnabled = value;
		return this;
	}

	text(): string
	{
		return this._text.get();
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

		var colorText = (isEnabled ? colorBorder : style.colorDisabled());

		var textAsString = this.text();

		display.drawText
		(
			textAsString,
			this.fontNameAndHeight,
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
