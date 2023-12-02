
namespace ThisCouldBeBetter.GameFramework
{

export class ControlSelect<TContext, TItem, TValue> extends ControlBase
{
	_valueSelected: DataBinding<TContext, TValue>;
	_options: DataBinding<TContext, TItem[]>;
	bindingForOptionValues: DataBinding<TItem, TValue>;
	bindingForOptionText: DataBinding<TItem, string>;

	indexOfOptionSelected: number;

	_drawLoc: Disposition;
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
		fontNameAndHeight: FontNameAndHeight
	)
	{
		super(name, pos, size, fontNameAndHeight);
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
		this._drawLoc = Disposition.create();
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

		if (this.indexOfOptionSelected == null)
		{
			if (direction == 1)
			{
				this.indexOfOptionSelected = 0;
			}
			else
			{
				this.indexOfOptionSelected = options.length - 1;
			}
		}
		else
		{
			this.indexOfOptionSelected = NumberHelper.wrapToRangeMinMax
			(
				this.indexOfOptionSelected + direction, 0, options.length
			);
		}

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

	valueSelected(): TValue
	{
		var returnValue = this._valueSelected.get();
		return returnValue;
	}

	// drawable

	draw
	(
		universe: Universe,
		display: Display,
		drawLoc: Disposition, style: ControlStyle
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
