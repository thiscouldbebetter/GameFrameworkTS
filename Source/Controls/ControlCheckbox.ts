
namespace ThisCouldBeBetter.GameFramework
{

export class ControlCheckbox<TContext> extends ControlBase
{
	_text: DataBinding<TContext, string>;
	_isEnabled: DataBinding<TContext, boolean>;
	valueBinding: DataBinding<TContext, boolean>;

	_drawLoc: Disposition;
	_sizeHalf: Coords;

	constructor
	(
		name: string,
		pos: Coords,
		size: Coords,
		text: DataBinding<TContext, string>,
		fontNameAndHeight: FontNameAndHeight,
		isEnabled: DataBinding<TContext, boolean>,
		valueBinding: DataBinding<TContext, boolean>
	)
	{
		super(name, pos, size, fontNameAndHeight);
		this._text = text;
		this._isEnabled = isEnabled;
		this.valueBinding = valueBinding;

		// Helper variables.
		this._drawLoc = Disposition.create();
		this._sizeHalf = Coords.create();
	}

	actionHandle(actionNameToHandle: string, universe: Universe): boolean
	{
		if (actionNameToHandle == ControlActionNames.Instances().ControlConfirm)
		{
			this.click();
		}

		return true; // wasHandled
	}

	click(): void
	{
		var value = this.value();
		var valueNext = (value == false);
		this.valueBinding.set(valueNext);
	}

	isEnabled(): boolean
	{
		return this._isEnabled.get();
	}

	text(): string
	{
		return this._text.get();
	}

	value(): boolean
	{
		return this.valueBinding.get();
	}

	// events

	mouseClick(clickPos: Coords): boolean
	{
		if (this.isEnabled())
		{
			this.click();
		}
		return true; // wasClickHandled
	}

	// drawable

	draw
	(
		universe: Universe,
		display: Display,
		drawLoc: Disposition,
		style: ControlStyle
	): void
	{
		var drawPos = this._drawLoc.overwriteWith(drawLoc).pos;
		drawPos.add(this.pos);

		var isEnabled = this.isEnabled();
		var isHighlighted = this.isHighlighted && isEnabled;

		style = style || this.style(universe);
		var colorFill = style.colorFill();
		var colorBorder = style.colorBorder();

		style.drawBoxOfSizeAtPosWithColorsToDisplay
		(
			this.size, drawPos, colorFill, colorBorder, isHighlighted, display
		);

		var colorText = (isEnabled ? colorBorder : style.colorDisabled());

		var textAsString = this.text();

		var value = this.value();
		var valueAsText = (value ? "X" : " ");
		textAsString = "[" + valueAsText + "] " + textAsString; 

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
