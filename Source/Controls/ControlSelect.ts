
namespace ThisCouldBeBetter.GameFramework
{

export class ControlSelect<TContext, TItem, TValue> extends ControlBase
{
	_valueSelected: DataBinding<TContext, TValue>;
	_options: DataBinding<TContext, TItem[]>;
	bindingForOptionValues: DataBinding<TItem, TValue>;
	bindingForOptionText: DataBinding<TItem, string>;

	indexOfOptionSelected: number;

	_drawPos: Coords;
	_sizeHalf: Coords;

	constructor
	(
		name: string,
		pos: Coords,
		size: Coords,
		valueSelected: DataBinding<TContext, TValue>,
		options: DataBinding<TContext, TItem[]>,
		bindingForOptionValues: DataBinding<TItem, TValue>,
		bindingForOptionText: DataBinding<TItem, string>,
		fontHeightInPixels: number
	)
	{
		super(name, pos, size, fontHeightInPixels);
		this._valueSelected = valueSelected;
		this._options = options;
		this.bindingForOptionValues = bindingForOptionValues;
		this.bindingForOptionText = bindingForOptionText;

		this.indexOfOptionSelected = null;
		var valueSelectedActualized = this.valueSelected();
		var optionsActualized = this.options();
		for (var i = 0; i < optionsActualized.length; i++)
		{
			var option = optionsActualized[i];
			var optionValue = this.bindingForOptionValues.contextSet
			(
				option
			).get();

			if (optionValue == valueSelectedActualized)
			{
				this.indexOfOptionSelected = i;
				break;
			}
		}

		// Helper variables.
		this._drawPos = Coords.create();
		this._sizeHalf = Coords.create();
	}

	actionHandle(actionNameToHandle: string, universe: Universe): boolean
	{
		var controlActionNames = ControlActionNames.Instances();
		if (actionNameToHandle == controlActionNames.ControlDecrement)
		{
			this.optionSelectedNextInDirection(-1);
		}
		else if
		(
			actionNameToHandle == controlActionNames.ControlIncrement
			|| actionNameToHandle == controlActionNames.ControlConfirm
		)
		{
			this.optionSelectedNextInDirection(1);
		}
		return true; // wasActionHandled
	}

	mouseClick(clickPos: Coords): boolean
	{
		this.optionSelectedNextInDirection(1);
		return true; // wasClickHandled
	}

	optionSelected(): TItem
	{
		var optionSelected =
		(
			this.indexOfOptionSelected == null
			? null
			: this.options()[this.indexOfOptionSelected]
		);
		return optionSelected;
	}

	optionSelectedNextInDirection(direction: number): void
	{
		var options = this.options();

		this.indexOfOptionSelected = NumberHelper.wrapToRangeMinMax
		(
			this.indexOfOptionSelected + direction, 0, options.length
		);

		var optionSelected = this.optionSelected();
		var valueToSelect =
		(
			optionSelected == null
			? null
			: this.bindingForOptionValues.contextSet(optionSelected).get()
		);

		this._valueSelected.set(valueToSelect);
	}

	options(): TItem[]
	{
		return this._options.get();
	}

	scalePosAndSize(scaleFactor: Coords): void
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
	}

	valueSelected(): TValue
	{
		var returnValue = this._valueSelected.get();
		return returnValue;
	}

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition): void
	{
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);

		var style = this.style(universe);

		display.drawRectangle
		(
			drawPos, this.size,
			(this.isHighlighted ? style.colorBorder() : style.colorFill()),
			(this.isHighlighted ? style.colorFill() : style.colorBorder())
		);

		drawPos.add(this._sizeHalf.overwriteWith(this.size).half());

		var optionSelected = this.optionSelected();
		var text =
		(
			optionSelected == null
			? "-"
			: this.bindingForOptionText.contextSet(optionSelected).get()
		);

		display.drawText
		(
			text,
			this.fontHeightInPixels,
			drawPos,
			(this.isHighlighted ? style.colorFill() : style.colorBorder()),
			(this.isHighlighted ? style.colorBorder() : style.colorFill()),
			true, // isCenteredHorizontally,
			false, // isCenteredVertically
			this.size
		);
	}
}

}
